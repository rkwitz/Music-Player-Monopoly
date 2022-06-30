// How To Setup Server
// ===========================================
// cd to /backend
// npm install
// node server
// go to localhost:3000

const { config } = require('./config'); // 0: client ID, 1: client secret
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios').default;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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
	for (var rem = num, off = 0; rem > 0; rem -= 49, off += 49) {
		var lim = 0;
		if (rem >= 50) {
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
	for (let index = (buffer.indexOf("external_urls")), i = 0; i != num; index = (buffer.indexOf("external_urls", index + 10)), i++) {
		if (i != 0) {
			info = info.concat(",");
		}
		info = info.concat("{", 
		"\"name\"",buffer.substring(buffer.indexOf("name\"", index) + 5, buffer.indexOf("\"", buffer.indexOf("name\"", index) + 8) + 1), ",",
		"\"followers\"", buffer.substring(buffer.indexOf("total\"", index) + 6, buffer.indexOf("}", buffer.indexOf("total\"", index) + 8)), ",",
		"\"popularity\"", buffer.substring(buffer.indexOf("popularity\"", index) + 11, buffer.indexOf(",", buffer.indexOf("popularity\"", index) + 13)), ",",
		"\"genres\"", buffer.substring(buffer.indexOf("genres\"", index) + 7, buffer.indexOf("]", buffer.indexOf("genres\"", index)) + 1), ",",
		"\"image\"", buffer.substring(buffer.indexOf("url\"", index) + 4, buffer.indexOf(",", buffer.indexOf("url\"", index))), ",",
		"\"url\"", buffer.substring(buffer.indexOf("spotify\"", index) + 8, buffer.indexOf("}", buffer.indexOf("spotify\"", index))), ",",
		"\"uri\"", buffer.substring(buffer.indexOf("uri\"", index) + 4, buffer.indexOf("}", buffer.indexOf("uri\"", index))),
		"}");
	}
	info = info.concat("],\"total\":", num, "}");
	return info;
}
app.get('/myTopArtists', (req, res) => {
	// how the req body must be formatted to make a request to the backend
	format = {"range": "short|medium|long", "numberArtists": "1 - 99"}
	if (!(correctKeys(format, req.body) && (req.body.range == "short" || req.body.range == "medium" || req.body.range == "long") 
	&& !isNaN(req.body.numberArtists) && parseInt(req.body.numberArtists) > 0 && parseInt(req.body.numberArtists) <= 99)) {
		res.status(400).json({"request body format": format});
		return;
	}
	let range = `${req.body.range}_term`;
	let num = parseInt(req.body.numberArtists);	
	topArtistsParser(range, num).then((data) => {
		res.status(200).send(data);
	})
	.catch((err) => {
		res.status(500).json(err);
	});
});


app.listen(port, () => {
	console.log('Listening on *:3000');
});

// favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/../frontend/resources/logo.png'));
