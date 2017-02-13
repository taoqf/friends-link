#!/usr/bin/env node
import * as log4js from 'log4js';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as path from 'path';
import * as morgan from 'morgan';
import * as serveFavicon from 'serve-favicon';
import * as errorhandler from 'errorhandler';
import config from './config';
import router from './router';
// import wx from './wx-check-signature';

(() => {
	log4js.configure('./log4js.json');
	process.on('SIGINT', function () {
		process.nextTick(function () {
			process.exit(0);
		});
	});
	console.warn('Starting http server at port ', config.PORT, '...');
	let app = express();

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	// parse application/json
	app.use(bodyParser.json({
		type: '*/json'
	}));
	// parse an HTML body into a string
	app.use(bodyParser.text({
		type: 'text/html'
	}));

	const store = new session.MemoryStore();

	app.use(session({
		store: store,
		secret: 'fl',	// key
		name: 'fl',
		proxy: false,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true }
	}));

	// app.use(wx);

	app.use(router);

	app.use('/', express.static(path.join(__dirname, 'pages')));

	app.use(serveFavicon(__dirname + '/favicon.ico'));
	app.use(morgan('combined'))

	if (process.env.NODE_ENV === 'development') {
		// only use in development
		app.use(errorhandler())
	}

	try {
		app.listen(config.PORT);
		console.warn('Http server started at port ', config.PORT);
	} catch (e) {
		console.error('Failed starting http server at port', config.PORT);
		console.error(e);
	}
})();