const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios').default;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('../frontend'))

app.listen(port, () => {
	console.log('Listening on *:3000');
});