require('dotenv').config();
const express = require('express');
const dialer = require('dialer').Dialer;
const bodyParser = require('body-parser');
const app = express();
const logger = require('./logger.js');
const application = {};
const filename = 'file';
const logFileName = './logs/' + filename + '.log';
application.logger = logger(logFileName)()('bot');
const module1 = {};
module1.logger = application.logger('module1');
const info = module1.logger('info');
const warning = module1.logger('warning');
const error = module1.logger('error');
const debug = module1.logger('debug');


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
			info(_bridge);
			bridgePool.forEach((element,index) => {
				let interval = setInterval(async () => {
					let status = await element.getStatus();
					
					if (currentStatus !== status) {
						currentStatus = status;
						io.emit('status', status);
						info(currentStatus);
					}
					if (
						currentStatus === 'ANSWERED' ||
						currentStatus === 'FAILED' ||
						currentStatus === 'BUSY' ||
						currentStatus === 'NO ANSWER'
					) {
						info(currentStatus);
						clearInterval(interval);
						bridgePool.splice(index, 1);
					}
					
				}, 1000);
				info({ id: index, status: element.STATUSES.NEW });
				res.json({ id: index, status: element.STATUSES.NEW });
				
			});
		}
	} catch (e){
		error(e);
	}
	
});
app.get('/status/:id', async function (req, res) {
	try {
		let id = req.params.id;
		let status = await bridgePool[id].getStatus();
		res.json({ id: id, 'status': status });
		info({ id: id, 'status': status });
	} catch (e) {
		error(e);
	}
});