//	Wisdom comes from experience.
//	Experience is often a result of lack of wisdom.
//	-	Terry Pratchett

'use strict';

//	*********************************************************
//	Require Modules
//	*********************************************************

const commandLineArgs = require('command-line-args');

var packageJSON = require('./package.json');

var logger = require('./loggingModule');
var log = logger.logger("debug");

var database = require('./database');
var webPage = require('./webPageModule');

var ripple = require('./rippleModule');

//	*********************************************************
//	Define Variables
//	*********************************************************

process.setMaxListeners(25);	//	TODO: Why was this going over?

var Accounts = {};

var Settings =
{
	version: packageJSON.version
};

var Wallets = {};

var Bots = {};

//	*********************************************************
//	Define Command line Options
//	*********************************************************

const CLIOptions =
	[
		{
			name: 'port',
			alias: 'p',
			type: Number
		},
		{
			name: 'verbose',
			alias: 'v',
			type: Boolean
		},
		{
			name: 'verboseSave',
			alias: 'V',
			type: Boolean
		},
		{
			name: 'debug',
			alias: 'd',
			type: Boolean
		},
		{
			name: 'debugSave',
			alias: 'D',
			type: Boolean
		}
		//{ name: 'src', type: String, multiple: true, defaultOption: true },
	];

const CLIArguments = commandLineArgs(CLIOptions);

//	*********************************************************
//	Initialize Command line Options
//	*********************************************************

if (CLIArguments.debugSave != null)
{
	log.info(`Setting debugSave mode on.`);
	logger.debugSave = true;
}
if (CLIArguments.verboseSave != null)
{
	log.info(`Setting verboseSave mode on.`);
	logger.verboseSave = true;
}

if (CLIArguments.debug != null)
{
	log.info(`Setting debug mode on.`);
	log = logger.logger("debug");
}
else if (CLIArguments.verbose != null)
{
	log.info(`Setting verbose mode on.`);
	log = logger.logger("verbose");
}


process.once('SIGUSR2', function ()
{
	log.debug("Goodbye!");
	process.kill(process.pid, 'SIGUSR2');
});

//	*********************************************************
//	Initialize Default parameters
//	*********************************************************

Settings.port = 3000;

//	*********************************************************
//	Overide database settings
//	*********************************************************

function CLIOveride()
{
	log.debug(`Checking CLI overide arguments`);

	if (CLIArguments.port != null)
	{
		log.info(`Setting port to: ${CLIArguments.port}`);
		Settings.port = CLIArguments.port;
	}
}

//	*********************************************************
//	Display Welcome Message and Start Program
//	*********************************************************

log.info(`Welcome to CryptoCowboy ${packageJSON.version}`);

setTimeout(function ()
{
	initialize();
}, 50);

//	*********************************************************
//	Start Script
//	*********************************************************

async function initialize()
{
	await log.debug("CC: Initialize");

	await database.createTables();
	await log.debug("CC: Loading Settings");

	var settings = await database.loadSettings();
	if (settings == null)
	{
		log.warn("CC: No settings data found.");
	} else
	{
		Object.assign(Settings, settings);
		log.debug(`CC: Loaded settings: ${settings}`);
	}
	await CLIOveride();

	var wallets = await database.loadWallets();
	if (wallets == null)
	{
		log.warn("CC: No wallets found.");
	}
	else
	{
		Object.assign(Wallets, wallets);
		log.debug(`CC: Loaded wallets`);
	}

	log.debug("Initiating connection to Ripple API");
	await ripple.connect();
	await ripple.subscribeToAccounts(Wallets);

	await webPage.startWebServer(Settings.port, Accounts, Settings, Wallets, Bots, database);
}
