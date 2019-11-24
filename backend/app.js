require('dotenv').config();
const express = require('express');
const dialer = require('dialer').Dialer;
const bodyParser = require('body-parser');
const app = express();
const url = 'https://uni-call.fcc-online.pl';
const server = app.listen(3000, function () {
	console.log('Sitecall app listening on port 3000!');
});
const io = require('socket.io')(server);
const supportPhoneNumber = process.env.SUPPORT_PHONE_NUMBER;

const login = process.env.LOGIN;
const password = process.env.PASSWORD;

let bridgePool = [];
dialer.configure({login: login, password: password, url: url});
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
	next();
});
app.use(bodyParser.text());
app.use(bodyParser.json());

let currentStatus;
app.post('/call', async function (req, res) {
	try {
		let data = req.body;
		let isGoodNumber = /^(\d{9})$/.test(data.number);
		if (isGoodNumber) {
			let _bridge = await dialer.call(supportPhoneNumber, data.number);
			bridgePool.push(_bridge);
			bridgePool.forEach((element,index) => {
				let interval = setInterval(async () => {
					let status = await element.getStatus();
					if (currentStatus !== status) {
						currentStatus = status;
						io.emit('status', status);
					}
					if (
						currentStatus === 'ANSWERED' ||
						currentStatus === 'FAILED' ||
						currentStatus === 'BUSY' ||
						currentStatus === 'NO ANSWER'
					) {
						
						clearInterval(interval);
						bridgePool.splice(index, 1);
					}
					
				}, 1000);
				
				res.json({ id: index, status: element.STATUSES.NEW });
				
			});
		}
	} catch (e){
		console.error(e);
	}
	
});
app.get('/status/:id', async function (req, res) {
	try {
		let id = req.params.id;
		let status = await bridgePool[id].getStatus();
		res.json({ id: id, 'status': status });
	} catch (e) {
		console.error(e);
	}
});