// How To Setup Server
// ===========================================
// cd to /backend
// npm install
// node server
// go to localhost:3000

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
    clientId: '',
    clientSecret: '',
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

		console.log('access_token:', access_token);
		console.log('refresh_token:', refresh_token);
		console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
		res.redirect('/landing.html');

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


app.listen(port, () => {
	console.log('Listening on *:3000');
});

// favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/../frontend/resources/logo.png'));