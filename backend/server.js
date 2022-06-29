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

app.get('/myTopArtists', (req, res) => {
	// how the req body must be formatted to make a request to the backend
	format = {"range": "short|medium|long", "numberArtists": "#"}
	if (!(correctKeys(format, req.body) && (req.body.range == "short" || req.body.range == "medium" || req.body.range == "long"))) {
		res.status(400).json({"request body format": format});
		return;
	}
    let range = `${req.body.range}_term`;
	axios.get('https://api.spotify.com/v1/me/top/artists ', {
		params: {limit: 50, offset: 0, time_range: range},
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
			Host: "api.spotify.com",
		},
	}).then((data) => {
		res.status(200).json(data['data']);
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
