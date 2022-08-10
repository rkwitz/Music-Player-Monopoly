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
app.use(express.static(path.join(__dirname, './frontend')));


// initialize OAuth
// ====================
// copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js
var SpotifyWebApi = require('spotify-web-api-node');
const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'playlist-read-collaborative',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played',
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

		// spotifyApi.setAccessToken(access_token);
		// spotifyApi.setRefreshToken(refresh_token);

		console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
		// res.redirect('/index.html');
		res.redirect(`/#access_token=${access_token}&refresh_token=${refresh_token}`)

	// 	setInterval(async () => {
	// 		const data = await spotifyApi.refreshAccessToken();
	// 		const access_token = data.body['access_token'];

	// 		console.log('The access token has been refreshed!');
	// 		console.log('access_token:', access_token);
	// 		spotifyApi.setAccessToken(access_token);
	// 	}, expires_in / 2 * 1000);
	// 	}).catch(error => {
	// 		console.error('Error getting Tokens:', error);
	// 		res.send(`Error getting Tokens: ${error}`);
	});
});

function correctKeys(ob1, ob2) {
	if (Object.keys(ob1).length == Object.keys(ob2).length) {
		return Object.keys(ob1).every(key => ob2.hasOwnProperty(key));
	} else return false;
}

/*********************************************************************************************************************/
// statistic endpoints

async function topArtistsParser(range, num, loggedInSpotifyApi) {
	let numItems = 0
	let rem = num
	let itr
	if (rem > 49) {
		itr = 2
	}
	else {
		itr = 1
	}
	let lim = 49
	let off = 0
	let result = {}
	let artists = Array()
	for (let i = 0; i < itr; i++) {
		await axios.get('https://api.spotify.com/v1/me/top/artists ', {
			params: {limit: lim, offset: off, time_range: range},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${loggedInSpotifyApi.getAccessToken()}`,
				Host: "api.spotify.com",
			},
		}).then((data) => {
			let size = 50
			if (data.data.items.length < size) {
				size = data.data.items.length
			}
			for (let j = 0; j < size; j++) {
				numItems++
				let artist = {}
				artist.name = data.data.items[j].name
				let genreArr = Array()
				for (let k = 0; k < data.data.items[j].genres.length; k++) {
					genreArr.push(data.data.items[j].genres[k])
				}
				artist.popularity = data.data.items[j].popularity
				if (data.data.items[j].images.length != 0) {
					artist.image = data.data.items[j].images[0].url
				}
				else {
					artist.image = "/resources/noimage.png"
				}
				artist.genres = genreArr
				artist.id = data.data.items[j].id
				artist.followers = data.data.items[j].followers.total
				artist.uri = data.data.items[j].uri
				artists.push(artist)
			}
		});
		lim = 50
		off = 49
		rem = rem - 49
	}
	result.total = numItems
	result.artists = artists
	return result
}

app.get('/myTopArtists', (req, res) => {
	// how the req body must be formatted to make a request to the backend
	format = {range: "short|medium|long", numberArtists: "1 - 99"}
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Content-type', 'application/json');
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	let request = req.query;
	if (!(correctKeys(format, request) && (request.range == "short" || request.range == "medium" || request.range == "long") 
	&& !isNaN(request.numberArtists) && parseInt(request.numberArtists) > 0 && parseInt(request.numberArtists) <= 99)) {
		res.status(400).json({"request body format": format});
		console.log("incorrect request body:", '\n', request);
		return;
	}
	let range = `${request.range}_term`;
	let num = parseInt(request.numberArtists);	
	topArtistsParser(range, num, loggedInSpotifyApi).then((data) => {
		res.status(200).json(data);
		console.log(`sent top ${num} artists`);
	})
	.catch((err) => {
		res.status(500).json(err);
		console.log(err)
	});
});

async function topSongsParser(range, num, loggedInSpotifyApi) {
	let numItems = 0
	let rem = num
	let itr
	if (rem > 49) {
		itr = 2
	}
	else {
		itr = 1
	}
	let lim = 49
	let off = 0
	let result = {}
	let songs = Array()
	for (let i = 0; i < itr; i++) {
		await axios.get('https://api.spotify.com/v1/me/top/tracks ', {
			params: {limit: lim, offset: off, time_range: range},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${loggedInSpotifyApi.getAccessToken()}`,
				Host: "api.spotify.com",
			},
		}).then((data) => {
			let size = 50
			if (data.data.items.length < size) {
				size = data.data.items.length
			}
			for (let j = 0; j < size; j++) {
				numItems++
				let song = {}
				song.name = data.data.items[j].name
				let artistArr = Array()
				for (let k = 0; k < data.data.items[j].artists.length; k++) {
					artistArr.push(data.data.items[j].artists[k].name)
				}
				song.artists = artistArr
				song.album = data.data.items[j].album.name
				if (data.data.items[j].album.images.length != 0) {
					song.art = data.data.items[j].album.images[0].url
				}
				else {
					song.art = "/resources/noimage.png"
				}
				song.id = data.data.items[j].id
				song.releaseDate = data.data.items[j].album.release_date
				songs.push(song)
			}
		});
		lim = 50
		off = 49
		rem = rem - 49
	}
	result.total = numItems
	result.songs = songs
	return result
}

app.get('/myTopSongs', (req, res) => {
	format = {range: "short|medium|long", numberSongs: "1 - 99"}
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Content-type', 'application/json');
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	let request = req.query;
	if (!(correctKeys(format, request) && (request.range == "short" || request.range == "medium" || request.range == "long") 
	&& !isNaN(request.numberSongs) && parseInt(request.numberSongs) > 0 && parseInt(request.numberSongs) <= 99)) {
		res.status(400).json({"request body format": format});
		console.log("incorrect request body:", '\n', request);
		return;
	}
	let range = `${request.range}_term`;
	let num = parseInt(request.numberSongs);	
	topSongsParser(range, num, loggedInSpotifyApi).then((data) => {
		res.status(200).json(data);
		console.log(`sent top ${num} songs`);
	})
	.catch((err) => {
		res.status(500).json(err);
	});
});

// app.get('/isLogged', (req, res) => {
// 	var loggedInSpotifyApi = new SpotifyWebApi();
// 	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
// 	loggedInSpotifyApi.getMe()
// 	.then(function(data) {
// 		res.status(200).json(true);
// 	}, function(err) {
// 		res.status(200).json(false);
//   	});
// });

// app.get('/logout', (req, res) => {
// 	var loggedInSpotifyApi = new SpotifyWebApi();
// 	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
// 	loggedInSpotifyApi = new SpotifyWebApi({
// 		// make sure you don't push with clientID or secret filled in
// 		clientId: config[0],
// 		clientSecret: config[1],
// 		redirectUri: 'http://localhost:3000/callback'
// 	});
// });

app.listen(port, () => {
	console.log('Listening on *:3000');
});

// favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/frontend/resources/logo.png'));

// Pause a User's Playback
app.get('/pause', (req, res) => {
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.pause()
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
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.play()
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
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.getMyCurrentPlaybackState()
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
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.skipToNext()
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
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.skipToPrevious()
    .then(function() {
      	res.status(200).send();
    }, function(err) {
    	//if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    	res.status(500).json(err);
      	console.log(err);
    });
});

// Get a playlist
app.get('/playlistGetTracks', (req, res) => {
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	format = {id: "idNumberHere"}
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Content-type', 'application/json');
	let request = req.query;
	let id = `${request.id}`;
	loggedInSpotifyApi.getPlaylist(id)
  	.then(function(data) {
		let result = {}
		let songsArr = Array()
		result.name = data.body.name
		if (data.body.images.length != 0) {
			result.art = data.body.images[0].url
		}
		else {
			result.art = "/resources/noimage.png"
		}
		for (let i = 0; i < data.body.tracks.items.length; i++) {
			let song = {}
			song.name = data.body.tracks.items[i].track.name
			let artistArr = Array()
			for (let j = 0; j < data.body.tracks.items[i].track.artists.length; j++) {
				artistArr.push(data.body.tracks.items[i].track.artists[j].name)
			}
			song.artists = artistArr
			song.album = data.body.tracks.items[i].track.album.name
			if (data.body.tracks.items[i].track.album.images.length != 0) {
				song.art = data.body.tracks.items[i].track.album.images[0].url
			}
			else {
				song.art = "/resources/noimage.png"
			}
			song.id = data.body.tracks.items[i].track.id
			song.releaseDate = data.body.tracks.items[i].track.album.release_date
			songsArr.push(song)
		}
		result.songs = songsArr
		res.status(200).json(result);
  	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  	});
});

// Get a user's playlists
app.get('/usersPlaylists', (req, res) => {
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	let id;
	loggedInSpotifyApi.getMe()
	.then(function(data) {
		id = data.body.id;
	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  	});
	axios.get('https://api.spotify.com/v1/me/playlists', {
		params: {limit: 50, offset: 0},
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${loggedInSpotifyApi.getAccessToken()}`,
			Host: "api.spotify.com",
		},
	}).then(function(data) {
		let playlistIds = Array()
		for (let i = 0; i < data.data.items.length; i++) {
			if (id == data.data.items[i].owner.id) {
				playlistIds.push(data.data.items[i].id)
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
	var loggedInSpotifyApi = new SpotifyWebApi();
	loggedInSpotifyApi.setAccessToken(req.headers['authorization']);
	loggedInSpotifyApi.getMyCurrentPlayingTrack()
  	.then(function(data) {
		let result = {}
		result.name = data.body.item.name
		let artistArr = Array()
		for (let i = 0; i < data.body.item.artists.length; i++) {
			artistArr.push(data.body.item.artists[i].name)
		}
		result.artists = artistArr;
		result.album = data.body.item.album.name
		result.art = data.body.item.album.images[0].url
		res.status(200).json(result);
  	}, function(err) {
		res.status(500).json(err);
    	console.log(err);
  });
});
