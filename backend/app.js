require('dotenv').config();
const express = require('express');
const dialer = require('dialer').Dialer;
const bodyParser = require('body-parser');
const app = express();
const metalog = require('metalog');

const log = metalog({
	path: './logs',
	node: 'S1N1',
	writeInterval: 3000,
	writeBuffer: 64 * 1024,
	keepDays: 5,
	toStdout: [],
}).bind('app1');


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
			log.info(JSON.stringify(_bridge));
			bridgePool.forEach((element,index) => {
				let interval = setInterval(async () => {
					let status = await element.getStatus();
					
					if (currentStatus !== status) {
						currentStatus = status;
						io.emit('status', status);
						log.info(data.number + ' ' + supportPhoneNumber + ' '+ currentStatus);
					}
					if (
						currentStatus === 'ANSWERED' ||
						currentStatus === 'FAILED' ||
						currentStatus === 'BUSY' ||
						currentStatus === 'NO ANSWER'
					) {
						log.info(data.number + ' ' + supportPhoneNumber + ' '+ currentStatus);
						clearInterval(interval);
						bridgePool.splice(index, 1);
					}
					
				}, 1000);
				
				res.json({ id: index, status: element.STATUSES.NEW });
				
			});
		}
	} catch (e){
		log.error(JSON.stringify(e));
	}
	
});
app.get('/status/:id', async function (req, res) {
	try {
		let id = req.params.id;
		let status = await bridgePool[id].getStatus();
		res.json({ id: id, 'status': status });
		log.info({ id: id, 'status': status });
	} catch (e) {
		log.error(JSON.stringify(e));
	}
});