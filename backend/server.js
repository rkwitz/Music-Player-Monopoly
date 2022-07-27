const { config } = require('./config'); // 0: client ID, 1: client secret
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios').default;
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(express.static(__dirname + '/../frontend'));
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));


// initialize OAuth
// ====================
// copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js
var SpotifyWebApi = require('spotify-web-api-node');
const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];
var spotifyApi = new SpotifyWebApi({
	// make sure you don't push with clientID or secret filled in
    clientId: config[0],
    clientSecret: config[1],
    redirectUri: 'http://localhost:3000/callback'
});

app.get('/login', (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
	const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;

	if (error) {
		console.error('Callback Error:', error);
		res.send(`Callback Error: ${error}`);
		return;
	}

	spotifyApi.authorizationCodeGrant(code).then(data => {
		const access_token = data.body['access_token'];
		const refresh_token = data.body['refresh_token'];
		const expires_in = data.body['expires_in'];

		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);

		console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
		res.redirect('/landing.html');
		spotifyApi.searchPlaylists('workout')

		setInterval(async () => {
			const data = await spotifyApi.refreshAccessToken();
			const access_token = data.body['access_token'];

			console.log('The access token has been refreshed!');
			console.log('access_token:', access_token);
			spotifyApi.setAccessToken(access_token);
		}, expires_in / 2 * 1000);
		}).catch(error => {
			console.error('Error getting Tokens:', error);
			res.send(`Error getting Tokens: ${error}`);
	});
});

function correctKeys(ob1, ob2) {
	if (Object.keys(ob1).length == Object.keys(ob2).length) {
		return Object.keys(ob1).every(key => ob2.hasOwnProperty(key));
	} else return false;
}

/*********************************************************************************************************************/
// statistic endpoints

async function topArtistsParser(range, num) {
	var buffer = "";
	var lim = 0;
	for (var rem = num, off = 0, i = 0; rem > 0; rem -= lim, off += 49, i++) {
		if ((rem >= 50) && (i == 0)) {
			lim = 49;
		}
		else {
			lim = rem;
		}
		await axios.get('https://api.spotify.com/v1/me/top/artists ', {
			params: {limit: lim, offset: off, time_range: range},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
				Host: "api.spotify.com",
			},
		}).then((data) => {
			buffer = buffer.concat(JSON.stringify(data['data']));
		});
	}
	let info = "";
	info = info.concat("{\"artists\":[");
	let itr = 0;
	for (let index = (buffer.indexOf("external_urls")), i = 0; index != -1; index = (buffer.indexOf("external_urls", index + 10)), i++, itr++) {
		if (i != 0) {
			info = info.concat(",");
		}
		info = info.concat("{", 
		"\"name\"",buffer.substring(buffer.indexOf("\"name\"", index) + 6, buffer.indexOf("\"", buffer.indexOf("\"name\"", index) + 9) + 1), ",",
		"\"followers\"", buffer.substring(buffer.indexOf("\"total\"", index) + 7, buffer.indexOf("}", buffer.indexOf("\"total\"", index) + 9)), ",",
		"\"popularity\"", buffer.substring(buffer.indexOf("\"popularity\"", index) + 12, buffer.indexOf(",", buffer.indexOf("\"popularity\"", index) + 14)), ",",
		"\"genres\"", buffer.substring(buffer.indexOf("\"genres\"", index) + 8, buffer.indexOf("]", buffer.indexOf("\"genres\"", index)) + 1), ",",
		"\"image\"", buffer.substring(buffer.indexOf("\"url\"", index) + 5, buffer.indexOf(",", buffer.indexOf("\"url\"", index))), ",",
		"\"url\"", buffer.substring(buffer.indexOf("\"spotify\"", index) + 9, buffer.indexOf("}", buffer.indexOf("\"spotify\"", index))), ",",
		"\"uri\"", buffer.substring(buffer.indexOf("\"uri\"", index) + 5, buffer.indexOf("}", buffer.indexOf("\"uri\"", index))),
		"}");
	}
	info = info.concat("],\"total\":", itr, "}");
	return info;
}
app.get('/myTopArtists', (req, res) => {
	// how the req body must be formatted to make a request to the backend
	format = {range: "short|medium|long", numberArtists: "1 - 99"}
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Content-type', 'application/json');
	let request = req.query;
	if (!(correctKeys(format, request) && (request.range == "short" || request.range == "medium" || request.range == "long") 
	&& !isNaN(request.numberArtists) && parseInt(request.numberArtists) > 0 && parseInt(request.numberArtists) <= 99)) {
		res.status(400).json({"request body format": format});
		console.log("incorrect request body:", '\n', request);
		return;
	}
	let range = `${request.range}_term`;
	let num = parseInt(request.numberArtists);	
	topArtistsParser(range, num).then((data) => {
		res.status(200).json(JSON.parse(data));
		console.log(`sent top ${num} artists`);
	})
	.catch((err) => {
		res.status(500).json(err);
	});
});

app.get('/isLogged', (req, res) => {
	var token = 0;
	try{
		token = spotifyApi.getAccessToken()
	}
	catch{
		res.status(200).json(false);
	}
	finally{
		if (token != 0){
			res.status(200).json(true);
		}
		else {
			res.status(200).json(false);
		}

	}

});

app.listen(port, () => {
	console.log('Listening on *:3000');
});

// favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/../frontend/resources/logo.png'));

// Pause a User's Playback
app.get('/pause', (req, res) => {
  spotifyApi.pause()
    .then(function() {
      res.status(200).send();
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      res.status(500).json(err);
      console.log(err);
    });
});

// Start/Resume a User's Playback
app.get('/play', (req, res) => {
  spotifyApi.play()
    .then(function() {
      res.status(200).send();
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      res.status(500).json(err);
      console.log(err);
    });
});

// Get Information About The User's Current Playback State
app.get('/playbackState', (req, res) => {
  spotifyApi.getMyCurrentPlaybackState()
    .then(function(data) {
      // Output items
      if (data.body && data.body.is_playing) {
        res.status(200).send("playing");
      } else {
        res.status(200).send("paused");
      }
    }, function(err) {
      res.status(500).json(err);
      console.log(err);
  });
});

// Skip User’s Playback To Next Track
app.get('/skipNext', (req, res) => {
  spotifyApi.skipToNext()
    .then(function() {
      res.status(200).send();
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      res.status(500).json(err);
      console.log(err);
    });
});

// Skip User’s Playback To Previous Track 
app.get('/skipPrevious', (req, res) => {
  spotifyApi.skipToPrevious()
    .then(function() {
      res.status(200).send();
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      res.status(500).json(err);
      console.log(err);
    });
});

//NOT DONE
/*
// Get a playlist
app.get('/playlistGetTracks', (req, res) => {
	format = {id: "idNumberHere"}
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Content-type', 'application/json');
	let request = req.query;
	let id = `${request.id}`;
	spotifyApi.getPlaylist(id)
  	.then(function(data) {
		
    	//FINSIH HERE
		
  	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  	});
});
*/

// Get a user's playlists
app.get('/usersPlaylists', (req, res) => {
	let id;
	spotifyApi.getMe()
	.then(function(data) {
		id = data.body.id;
	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  	});
	spotifyApi.getUserPlaylists(id)
  	.then(function(data) {
		let playlistIds = Array()
		for (let i = 0; i < data.body.items.length; i++) {
			if (id == data.body.items[i].owner.id) {
				playlistIds.push(data.body.items[i].id)
			}
		}
		res.status(200).json(playlistIds);
  	},function(err) {
		res.status(500).json(err);
    	console.log(err);
  	});
});
  

// Get the User's Currently Playing Track
app.get('/trackPlaying', (req, res) => {
	spotifyApi.getMyCurrentPlayingTrack()
  	.then(function(data) {
		let result = {}
		result.name = data.body.item.name
		let artistArr = Array()
		for (let i = 0; i < data.body.item.artists.length; i++) {
			artistArr.push(data.body.item.artists[i].name)
		}
		result.artist = artistArr;
		result.album = data.body.item.album.name
		result.art = data.body.item.album.images[0].url
		res.status(200).json(result);
  	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  });
});
