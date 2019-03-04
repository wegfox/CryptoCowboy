'use strict';


//	*********************************************************
//	Require Modules
//	*********************************************************

const winston = require('winston');

const Transport = require('winston-transport');
const util = require('util');

//	*********************************************************
//	Define Variables
//	*********************************************************

const {
	format,
} = require('winston');

const {
	printf
} = format;

const config = {
	levels: {
		error: 0,
		warn: 1,
		success: 2,
		info: 3,
		verbose: 4,
		debug: 5,
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		success: 'green',
		info: 'white',
		verbose: 'cyan',
		debug: 'cyan',
	}
};

exports.loggingMode = "debug";
exports.debugSave = false;
exports.verboseSave = false;

winston.addColors(config.colors);

const myFormat = printf(info =>
{
	return `${info.timestamp}: ${info.message}`;
});

const consoleFormat = winston.format.combine(
	winston.format.colorize({
		all: true
	}),
	winston.format.timestamp(),
	myFormat
);

const logFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.json()
);

//	*********************************************************
//	Create a logger
//	*********************************************************

var logger = winston.createLogger();

exports.format = () => 
{

};

class CustomTransport extends Transport
{
	constructor(opts)
	{
		super(opts);

		//
		// Consume any custom options here. e.g.:
		// - Connection information for databases
		// - Authentication information for APIs (e.g. loggly, papertrail,
		//   logentries, etc.).
		//
	}

	log(info, callback)
	{
		setImmediate(() =>
		{
			this.emit('logged', info);
		});

		// Perform the writing to the remote service

		callback();
	}
}

exports.transport = new CustomTransport();

//	If no argument is given, use the default. If argument is given, override the default
exports.logger = (loggingMode) =>
{
	if (loggingMode == null)
	{
		logger = winston.createLogger({
			levels: config.levels,
			transports: [
				new winston.transports.Console({
					format: consoleFormat
				}),
				new winston.transports.File({
					filename: 'logs/error.log',
					level: 'warn',
					format: logFormat,
				}),
				new winston.transports.File({
					filename: 'logs/info.log',
					level: 'info',
					format: logFormat,
				}),
				exports.transport
			],
			level: exports.loggingMode
		});
	} else
	{
		exports.loggingMode = loggingMode;

		logger = winston.createLogger({
			levels: config.levels,
			transports: [
				new winston.transports.Console({
					format: consoleFormat
				}),
				new winston.transports.File({
					filename: 'logs/error.log',
					level: 'warn',
					format: logFormat,
				}),
				new winston.transports.File({
					filename: 'logs/info.log',
					level: 'info',
					format: logFormat,
				}),
				exports.transport
			],
			level: loggingMode
		});

		if (exports.verboseSave)
		{
			logger.add(new winston.transports.File({
				filename: 'logs/verbose.log',
				level: 'verbose',
				format: logFormat,
			}));
		} else if (exports.debugSave)
		{
			logger.add(new winston.transports.File({
				filename: 'logs/verbose.log',
				level: 'verbose',
				format: logFormat,
			}));
			logger.add(new winston.transports.File({
				filename: 'logs/debug.log',
				level: 'debug',
				format: logFormat,
			}));
		}
	}
	return logger;
};

//	*********************************************************
//	Event handlers
//	*********************************************************

logger.on('error', function (err)
{
	console.log("Error occured");
	console.log(err);
});

logger.on('finish', function ()
{
	console.log('Your logger is done logging');
});

//	*********************************************************
//	Quick test of logging modes
//	*********************************************************

setTimeout(function ()
{
	logger.error('error');
	logger.warn('warn');
	logger.success('success');
	logger.info('info');
	logger.verbose('verbose');
	logger.debug('debug');
}, 1000);