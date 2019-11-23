require('dotenv').config();
const express = require('express');
const dialer = require('dialer').Dialer;
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const logger = require('./logger.js');

const url = 'https://uni-call.fcc-online.pl';
let _bridge = null;
const supportPhoneNumber = process.env.SUPPORT_PHONE_NUMBER;
dialer.configure({login: process.env.LOGIN, password: process.env.PASSWORD, url: url});
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
	next();
});
app.use(bodyParser.text());
app.use(bodyParser.json());
app.listen(3000, function () {
	console.log('Sitecall app listening on port 3000!');
});
app.post('/call', async function (req, res) {
	let data = req.body;
	_bridge = await dialer.call(supportPhoneNumber, data.number);
	res.json({ id: '123', status: _bridge.STATUSES.NEW });
});
app.get('/status', async function (req, res) {
	let status = await _bridge.getStatus();
	res.json({ id: '123', 'status': status });
});