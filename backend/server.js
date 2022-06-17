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
app.use(express.static(__dirname + '/../frontend'));



app.listen(port, () => {
	console.log('Listening on *:3000');
});

// favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/../frontend/resources/logo.png'));