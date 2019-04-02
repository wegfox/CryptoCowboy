
var express = require('express');
var app = express();
var http = require('http');
var httpServer = new http.Server(app);

var io = require('socket.io')(httpServer);
exports.io = io;

//const path = require('path');

//var readLastLines = require('read-last-lines');

var log = require('./loggingModule').logger();
var transport = require('./loggingModule').transport;
var ripple = require('./rippleModule');

var Accounts = null;
var Settings = null;
var Wallets = null;
var Bots = null;
var database;

var userCount = 0;

let startWebServer = function (port = 3000, accounts, settings, wallets, bots, db)
{

	Accounts = accounts;
	Settings = settings;
	Wallets = wallets;
	Bots = bots;

	database = db;
	//port = 5;


	listenOnPort(port);

	log.debug("Setting up socket");
	socketConnection();
};
exports.startWebServer = startWebServer;

function listenOnPort(port)
{
	httpServer.listen(port, function ()
	{
		log.verbose('listening on *:' + port.toString());
	});

	log.verbose("Serving pages");

	app.get('/Dashboard', function (req, res)
	{
		res.sendFile(__dirname + "/webpage/index.html");
	});

	app.get('/Wallets', function (req, res)
	{
		res.sendFile(__dirname + "/webpage/index.html");
	});

	app.get('/Bots', function (req, res)
	{
		res.sendFile(__dirname + "/webpage/index.html");
	});

	app.get('/Options', function (req, res)
	{
		res.sendFile(__dirname + "/webpage/index.html");
	});

	app.get('/Support', function (req, res)
	{
		res.sendFile(__dirname + "/webpage/index.html");
	});

	app.post('/Update', function (req, res)
	{
		log.debug("Update");
	});

	app.use(express.static('webpage'));
}


function socketConnection() 
{
	log.debug("Starting Socket");

	let reset = true;

	io.on('connection', function (socket) 
	{
		io.emit('version', Settings.version);
		if (reset) { io.emit('reset', " "); reset = false; }

		log.debug('A user connected');
		userCount++;

		socket.on('getSettings', () => 
		{
			log.debug("Socket: 'getSettings()'");
			log.debug(Settings);

			socket.emit('settings', Settings);
		});

		socket.on('getWallets', function () 
		{
			log.debug("Socket: 'getWallets'");

			log.debug(Wallets);

			//let wallets = {};
			//for (var key in Wallets) 
			//{
			//	wallets[key] = Wallets[key];
			//}
			socket.emit('wallets', Wallets);
		});

		socket.on('getAssets', function (wallet)
		{
			log.debug("Socket: 'getAssets'");
			log.debug(JSON.stringify(wallet));

			let getAssets = async () => 
			{
				try 
				{
					var assets = await ripple.getAssets(wallet.address);
					log.debug(assets);

					socket.emit('assets', assets);
				}
				catch (error)
				{
					log.debug("Failed to read assets");
					socket.emit('assets', null);
				}
			};
			getAssets();
		});


		socket.on('addWallet', function (wallet)
		{
			log.debug("Socket: 'addWallet'");

			database.addWallet(wallet.address, wallet.secret, wallet.nickname, async () =>
			{
				let wallets = await database.loadWallets();
				Object.assign(Wallets, wallets);
				socket.emit('wallets', Wallets);
			});
		});

		socket.on('getOrderBook', async function (pair)
		{
			log.debug("orderBook");

			try
			{
				log.debug(JSON.stringify(pair));
				await ripple.getOrderBook(pair.baseCurrency, pair.pairCurrency, "ask");
				await ripple.getOrderBook(pair.pairCurrency, pair.baseCurrency, "bid");
			}
			catch (error)
			{
				log.error("Error reading order books");
				log.error(error);
			}
		});

		socket.on('submitOrder', async function (orderData)
		{
			log.debug("submitOrder");

			try
			{
				log.debug(JSON.stringify(orderData));
				await ripple.exchange(orderData);
				//await ripple.getOrderBook(pair.baseCurrency, pair.pairCurrency, "ask");
				//await ripple.getOrderBook(pair.pairCurrency, pair.baseCurrency, "bid");
			}
			catch (error)
			{
				log.error("Error submitting order");
				log.error(error);
			}
		});

		socket.on('deleteWallet', function (address)
		{
			log.verbose("Deleting wallet: " + address);

			database.deleteWallet(address, async () =>
			{
				let wallets = await database.loadWallets();
				Object.assign(Wallets, wallets);
				log.debug("Sending new wallet list back to client");
				socket.emit('wallets', Wallets);
			});
		});

	});

	transport.on('logged', (data) =>
	{
		io.emit('log', data);
	});
}



/*



		socket.on('sendPayment', function (paymentInformation)
		{
			logging.verbose("Send Payment");

			rippleAPIModule.issuePayment(paymentInformation);
		});




		//	When user disconnects
		socket.on('disconnect', function ()
		{
			logging.verbose('User disconnected');
			userCount--;
			io.emit('userCount', userCount);
		});
	});
};


/*
exports.broadcast = function(tag, message)
{
	io.emit(tag, message);
};
/*
//  Any user emits with the "command" tag are sent here for further parsing
function handleCommand(commandMessage)
{
    var command = "";
    var data = {};

    if (commandMessage.hasOwnProperty("command") && commandMessage.hasOwnProperty("data"))
    {
        command = commandMessage.command;   //  This is the sub-command
        data = commandMessage.data;  //  This is the raw data stripped of it's headers
    }
    else
    {
        console.log("Invalid command format.");
        return; //  Emit error in logs
    }

    switch (command)
    {


        case "Exit":
            logging.log("Shutting down CryptoCowboy.");
            process.exit();
            break;



        case "enableGateway":
            rippleAPIModule.enableGateway(commandData, function (response)
            {
                //logging.log(JSON.stringify(data));
            });
            break;

        case "getTransactions":
            rippleAPIModule.getTransactions(commandData);
            break;

        case "getAddress":
            console.log("Address: " + rippleAPIModule.address);
            console.log("Address: " + rippleAPIModule.address2);
            console.log(rippleAPIModule.getAddress());
            break;

        case "Stop":
            autoTraderStatus = "Disabled";
            io.emit('autoTraderStatus', autoTraderStatus);
            logging.log("Stoping Auto Trader, please wait...");

            state = "Stop";
            break;

        case "Reset":
            writeTime();
            dayTradeGains = 0.00;
            statsModule.totalTransactions = 0;
            reserve = 0.00;
            reserveXRP = 0.00;

            writeFiles();

            setTimeout(readFiles, 1000);
            break;

        case "BumpRange":
            logging.log("Bumping range.");
            rangePercentage = rangePercentage + rangeIncrement;
            break;

        case "DropRange":
            logging.log("Dropping range.");
            rangePercentage = rangePercentage - rangeIncrement;
            break;

        case "seenWelcomePage":
            fileIOModule.saveSettings("seenWelcomePage", true);
            break;

        case "importWallet":
            fileIOModule.addWallet(commandData);
            break;


}
*/


/*
exports.sendTransactions = function(TX)
{
	io.emit("serverData", { "command": "memo", "data": TX });
};
*/

//var sizeof = require('object-sizeof');
//const EventEmitter = require('events');


//var rippleAPIModule = require('./rippleAPIModule');
//var fileIOModule = require('./fileIOModule');
//var CryptoCowboy = require('./CryptoCowboy');
//var database = require('./database');



//class MyEmitter extends EventEmitter { }
//const eventEmitter = new MyEmitter();