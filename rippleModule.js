const RippleAPI = require('ripple-lib').RippleAPI;

var io = require('./webPageModule').io;

var log = require('./loggingModule').logger();

const api = new RippleAPI
({
	server: 'wss://s1.ripple.com', // Public rippled server
	timeout: 30000,
	feeCushion: 1.2
});

// Milliseconds to wait between checks for a new ledger.
const interval = 3000;

// Number of ledgers to check for valid transaction before failing
const ledgerOffset = 10;
const maxFee = "0.00001";
const myInstructions = { maxLedgerVersionOffset: ledgerOffset, maxFee: maxFee };

api.on('connected', () =>
{
	log.verbose('Connected to Rippled Server');
});

api.on('disconnected', (code) =>
{
	// code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server will be 1000 if this was normal closure
	log.debug('disconnected, code:' + code.toString());	//	TODO Handle weirdness here
});

api.on('error', (errorCode, errorMessage) =>
{
	log.debug(errorCode + ': ' + errorMessage);	//	TODO Handle weirdness here
});

api.connection.on('transaction', (transactionMessage) =>
{
	log.verbose("transaction detected!");

	if (transactionMessage.engine_result != "tesSUCCESS")
	{
		return;
	}

	let transaction = transactionMessage.transaction;

	if (transaction.TransactionType == "OfferCreate")
	{
		//let result = {};
		//result.xrp = transaction.TakerPays / 1000000;
		//result.pair = transaction.TakerGets;

		//log.debug(JSON.stringify(result, null, 2));
		//log.debug(JSON.stringify(result.pair, null, 2));

		io.emit('transaction', transaction);
		// Do something useful with `event`//
		log.debug(JSON.stringify(transaction, null, 2));
	}
});

api.connection.on('validationReceived', (event) =>
{
	log.verbose("validationReceived detected!");
	// Do something useful with `event`//
	//console.log(JSON.stringify(event, null, 2));
});

//	Functions w/o subscribe?
api.connection.on('ledgerClosed', (event) =>
{
	//	This gets pretty noisy here.
	//log.verbose("ledgerClosed detected!");
	// Do something useful with `event`//
	//console.log(JSON.stringify(event, null, 2));
});

api.connection.on('manifestReceived', (event) =>
{
	log.verbose("manifestReceived detected!");
	// Do something useful with `event`//
	//console.log(JSON.stringify(event, null, 2));
});

//	For admin
//this.api.connection.on('peerStatusChange', (event) =>
//{
//log.verbose("peerStatusChange detected!");
// Do something useful with `event`//
//console.log(JSON.stringify(event, null, 2));
//});

exports.connect = () =>
{
	log.debug("Connecting to Ripple Server");
	return api.connect().then(async () => 
	{
		log.debug("Connected to Ripple server");
		//for (var key in Wallets) 
		//{
		//await events(Wallets[key]); 	//	TODO: Dont subscribe twice
		//}
	}).catch((error) => 
	{
		log.error("Error connecting to Ripple API: " + error.toString());
	});
};

exports.subscribeToAccounts = async (wallets) =>
{
	log.verbose('Subscribing to accounts');

	return new Promise(async (resolve, reject) =>
	{
		let addresses = [];

		for (var key in wallets) 
		{
			addresses.push(wallets[key].address);
		}

		await api.request('subscribe',
			{
				//id: this.id++,
				accounts: addresses
			}).then(response =>
		{
			if (response.status == 'success')
			{
				log.verbose('Successfully subscribed');
			}
			else
			{
				log.verbose('Subscribed');
			}
			resolve();
		}).catch(error =>
		{
			log.verbose('Error subscribing');
			reject();
			// Handle `error`
		});
	});
};


exports.subscribeToOrderBook = async (currencyObject) =>
{
	if (currencyObject.currencyCode == "XRP")
	{
		return;
	}

	log.verbose('Subscribing to order book');

	let currency = {};
	currency.currency = currencyObject.currency;
	currency.issuer = currencyObject.counterparty;

	log.debug(JSON.stringify(currencyObject));
	log.debug(JSON.stringify(currency));

	try
	{
		await api.request('subscribe',
			{
				//id: this.id++,
				"books": [
					{
						"taker_pays": {
							"currency": "XRP"
						},
						"taker_gets": currency,
						"snapshot": true
					}
				]
			});
	}
	catch (error) 
	{
		log.debug(error.stack);
	}

};

exports.getOrderBook = async (currencyBuy, currencySell) =>
{

	if (currencySell == null)
	{
		currencySell = { currency: "XRP" };
	}

	if (currencyBuy.currency == currencySell.currency)
	{
		return;
	}

	log.verbose('Reading order books for ' + currencyBuy.currency + " and " + currencySell.currency);

	let formattedCurrencyBuy = {};
	formattedCurrencyBuy.currency = currencyBuy.currency;
	if (currencyBuy.currency != "XRP")
	{
		formattedCurrencyBuy.issuer = currencyBuy.counterparty;
	}


	let formattedCurrencySell = {};
	formattedCurrencySell.currency = currencySell.currency;
	if (currencySell.currency != "XRP")
	{
		formattedCurrencySell.issuer = currencySell.counterparty;
	}

	let result = null;
	try
	{
		result = await api.request('book_offers',
			{
				"taker_pays": formattedCurrencyBuy,
				"taker_gets": formattedCurrencySell,
				"limit": 1
			});
	}
	catch (error) 
	{
		log.debug(error.stack);
	}

	let offers = result.offers;

	//log.debug(JSON.stringify(offers, null, 2));

	if (offers.length == 0)
	{
		log.warn("No order book data available.");
		return;
	}

	for (let i = 0; i < offers.length; i++)
	{
		let offer = offers[i];
		//if (result.engine_result != "tesSUCCESS")
		//{
		//	return;
		//}
		//log.debug(JSON.stringify(offers[i], null, 2));

		//
		//if (offer.TransactionType == "OfferCreate")
		//{
		let OfferCreate = {};
		OfferCreate.baseValue = offer.TakerGets / 1000000;
		OfferCreate.pair = offer.TakerPays.currency;
		OfferCreate.pairValue = offer.TakerPays.value;
		OfferCreate.basePerPair = OfferCreate.baseValue / OfferCreate.pairValue;

		log.debug("Offer: " + JSON.stringify(OfferCreate, null, 2));

		io.emit('orderBook', OfferCreate);
		// Do something useful with `event`//
		//log.debug(JSON.stringify(offer, null, 2));
		//}
	}

	//log.debug(result);



};

exports.getAssets = (address) =>
{
	log.debug("exports.getAssets");
	return api.getBalances(address).then(async (balances) => 
	{
		log.debug(JSON.stringify(balances));
		let assets = [];

		for (var i = 0; i < balances.length; i++)
		{
			let assetRaw = balances[i];
			log.debug(JSON.stringify(assetRaw));
			log.debug(JSON.stringify(assetRaw.currency));

			let asset = {};
			asset.currencyCode = balances[i].currency;
			asset.balance = balances[i].value;
			asset.counterparty = balances[i].counterparty;

			//await exports.subscribeToOrderBook(balances[i]);
			try
			{
				await exports.getOrderBook(balances[i]);
			}
			catch (error)
			{
				log.error("Error reading order books");
				log.error(error);
			}


			assets.push(asset);
		}
		//log.debug(assets);
		return assets;
	}).catch((error) => 
	{
		log.error("Error reading wallet assets: " + error.toString());
		return null;
	});
};


/*
function connect(table)
{
	return new Promise((resolve, reject) =>
	{
		log.debug(`DB: Reading entire table: ${table}`);

		let query = `SELECT * FROM "${table}"`;

		database.all(query, [], (err, rows) =>
		{
			if (err)
			{
				reject(err);
				throw err;
			}

			//log.debug("Rows: " + JSON.stringify(rows));
			resolve(rows);	//	array
		});
	});
}

*///


// //******************************** */

// function setDomain()
// {
// 	let gateway =
// 	{
// 		"domain": "computercowboy.tech"
// 	};

// 	return gateway;
// }

// function createGateway()
// {
// 	let gateway =
// 	{
// 		"defaultRipple": true
// 	};

// 	return gateway;
// }



// exports.enableGateway = function (wallet)
// {
// 	let gateway = createGateway();

// 	api.prepareSettings(wallet.address, gateway, myInstructions).then(prepared => 
// 	{
// 		console.log('Order Prepared');
// 		return api.getLedger().then(ledger => 
// 		{
// 			console.log('Current Ledger', ledger.ledgerVersion);
// 			return submitTransaction(ledger.ledgerVersion, prepared, wallet.secret);
// 		});
// 	}).then(() => 
// 	{


// 	}).catch(console.error);
// };

// function createPaymentOrder(paymentAmount, addressSource, destinationAddress, memo)
// {
// 	let payment = paymentAmount.toFixed(6);

// 	let paymentOrder =
// 	{
// 		"source":
// 		{
// 			"address": addressSource,
// 			"maxAmount":
// 			{
// 				"value": payment,
// 				"currency": "XBW",
// 				"counterparty": "rBCA75NX9SGo3sawJQaQNX1ujEY9xZsYBj"
// 			}
// 		},
// 		"destination":
// 		{
// 			"address": destinationAddress,
// 			"amount":
// 			{
// 				"value": payment,
// 				"currency": "XBW",
// 				"counterparty": "rBCA75NX9SGo3sawJQaQNX1ujEY9xZsYBj"
// 			}
// 		},
// 		"memos": [{ "data": "BSA" }, { "data": memo }]
// 	};

// 	return paymentOrder;
// }





// exports.issuePayment = function (paymentInformation)
// {

// 	api.preparePayment(paymentInformation.sourceAddress, createPaymentOrder(paymentInformation.paymentValue, paymentInformation.sourceAddress, paymentInformation.destinationAddress, paymentInformation.memo), myInstructions).then(prepared => 
// 	{
// 		console.log('preparePayment');
// 		return api.getLedger().then(ledger => 
// 		{
// 			console.log('Current Ledger', ledger.ledgerVersion);
// 			return submitTransaction(ledger.ledgerVersion, prepared, commandData.secret);
// 		});
// 	}).then(() => 
// 	{


// 	}).catch(console.error);
// };


// exports.getTransactions = function (address)
// {
// 	console.log(api.getTransactions(address, { "limit": 10 }).then(transaction => 
// 	{
// 		//console.log(transaction);

// 		var arrayLength = transaction.length;
// 		for (var i = 0; i < arrayLength; i++) 
// 		{
// 			//console.log(transaction[i].specification.memos);

// 			if (transaction[i].specification.hasOwnProperty("memos"))
// 			{
// 				//console.log(transaction[i].specification.memos);

// 				if (transaction[i].specification.memos[0].data == "BSA")
// 				{
// 					logging.log(transaction[i].specification.memos[1].data);
// 					webPageModule.sendTransactions(transaction[i].specification.memos[1].data);
// 				}
// 			}


// 		}


// 	}));

// };


// //****************************** */






// function getPricePerShare()
// {
// 	let url = "https://data.ripple.com/v2/exchanges/XRP/" + currencySymbol + "+" + currencyCode + "?descending=true&limit=1";

// 	console.log("Reading from: " + url);
// 	console.log("Getting price");

// 	request
// 	({
// 		url: url,
// 		json: true
// 	}, function (error, response, body) 
// 	{
// 		console.log("...");
// 		if (!error && response.statusCode === 200) 
// 		{
// 			pricePerShare = parseFloat(body.exchanges[0].rate);
// 			console.log('Reading price: ', pricePerShare);
// 			webPageModule.emit('pricePerShare', pricePerShare);
// 		}
// 		else
// 		{
// 			log("Error getting price");
// 			log("Status code: " + (response.statusCode).toString());

// 		}
// 		console.log(body);
// 	});
// }


// function buy()
// {
// 	let buyPoint = tradingModule.fixedPoint - tradingModule.range;	//	Point at which we buy
// 	let buyPrice = (buyPoint / tradingModule.XRP);	//	Price of shares when we buy

// 	orderPriceBuy = buyPrice;

// 	let shares = Number((tradingModule.range / buyPrice).toFixed(6));	//	Shares to trade

// 	let cost = Number((shares * buyPrice).toFixed(6));	//	Cost for transaction

// 	buyCost = cost;

// 	if ((cost + 1.00) >= cash)
// 	{
// 		logging.log("We don't have enough USD to trade.");

// 		api.disconnect().then(() => 
// 		{
// 			logging.log('API disconnected.');
// 			connection = "Not connected";
// 			webPageModule.emit('connectionStatus', connection);
// 		}).catch(console.error);

// 		setTimeout(shutDown, 100);
// 	}

// 	//XRP has 6 significant digits past the decimal point. In other words, XRP cannot be divided into positive values smaller than 0.000001 (1e-6). XRP has a maximum value of 100000000000 (1e11).

// 	//Non-XRP values have 16 decimal digits of precision, with a maximum value of 9999999999999999e80. The smallest positive non-XRP value is 1e-81

// 	let buyPriceClean = buyPrice.toFixed(4);	//	For text output only
// 	let costClean = cost.toFixed(4);	//	For text output only

// 	logging.log(" ");
// 	logging.log("Placing an order to buy " + shares.toFixed(4) + " XRP at $" + buyPriceClean + " for $" + costClean);

// 	console.log('Creating a new order');

// 	let buyOrder = createBuyOrder(shares, cost);
// 	api.prepareOrder(address, buyOrder, myInstructions).then(prepared => 
// 	{
// 		console.log('Order Prepared');
// 		return api.getLedger().then(ledger => 
// 		{
// 			console.log('Current Ledger', ledger.ledgerVersion);
// 			return submitTransaction(ledger.ledgerVersion, prepared, exports.secret);
// 		});
// 	}).then(() => 
// 	{


// 	}).catch(console.error);
// }

// function sell()
// {
// 	let sellPoint = tradingModule.fixedPoint + tradingModule.range;	//	Point at which we sell
// 	let sellPrice = (sellPoint / XRP);	//	Price of shares when we sell
// 	orderPriceSell = sellPrice;
// 	lastTradeRangePercentage = rangePercentage;

// 	let shares = Number((range / sellPrice).toFixed(6));	//	Shares to trade

// 	let cost = Number((shares * sellPrice).toFixed(6));	//	Cost for transaction
// 	sellCost = cost;
// 	tradeValue = parseFloat(cost) * (rangePercentage - 0.002);	//	0.002 is gatehub fee

// 	let sellPriceClean = sellPrice.toFixed(4);	//	For text output only
// 	let costClean = cost.toFixed(4);	//	For text output only

// 	logging.log("Placing an order to sell " + shares.toFixed(4) + " XRP at $" + sellPriceClean + " for $" + costClean);

// 	//let orderSuccess = api.prepareOrder(address, createSellOrder(shares, cost), myInstructions).then(prepared => 
// 	api.prepareOrder(address, createSellOrder(shares.toFixed(6), cost.toFixed(6)), myInstructions).then(prepared => 
// 	{
// 		console.log('Order Prepared');
// 		return api.getLedger().then(ledger => 
// 		{
// 			repeatPrevention = 0;
// 			console.log('Current Ledger', ledger.ledgerVersion);
// 			return submitTransaction(ledger.ledgerVersion, prepared, exports.secret);
// 		});
// 	}).catch(console.error);
// }

// //Buy XRP
// function createBuyOrder(shares, cost)
// {
// 	let stringShare = shares.toFixed(6);
// 	let stringCost = cost.toFixed(6);
// 	log(stringShare);
// 	log(stringCost);
// 	let buyOrder =
// 	{
// 		"direction": "buy",

// 		"quantity":
// 		{
// 			"currency": "XRP",
// 			"value": stringShare
// 		},

// 		"totalPrice":
// 		{
// 			"currency": currencySymbol,
// 			"counterparty": currencyCode,
// 			"value": stringCost
// 		},

// 		"passive": true,

// 		"fillOrKill": false
// 	};

// 	return buyOrder;
// }

// //Sell XRP
// function createSellOrder(shares, cost)
// {
// 	let stringShare = shares.toString();
// 	let stringCost = cost.toString();


// 	let sellOrder =
// 	{
// 		"direction": "sell",

// 		"quantity":
// 		{
// 			"currency": "XRP",
// 			"value": stringShare
// 		},

// 		"totalPrice":
// 		{
// 			"currency": currencySymbol,
// 			"counterparty": currencyCode,
// 			"value": stringCost
// 		},

// 		"passive": true,

// 		"fillOrKill": false
// 	};

// 	return sellOrder;
// }

// function verifyTransaction(hash, options) 
// {
// 	console.log('Verifing Transaction');
// 	return api.getTransaction(hash, options).then(data => 
// 	{
// 		console.log('Final Result: ', data.outcome.result);
// 		console.log('Validated in Ledger: ', data.outcome.ledgerVersion);
// 		console.log('Sequence: ', data.sequence);
// 		return data.outcome.result === 'tesSUCCESS';
// 	}).catch(error => 
// 	{
// 		/* If transaction not in latest validated ledger,
// 		   try again until max ledger hit */
// 		if (error instanceof api.errors.PendingLedgerVersionError) 
// 		{
// 			return new Promise((resolve, reject) => 
// 			{
// 				setTimeout(() => verifyTransaction(hash, options)
// 					.then(resolve, reject), INTERVAL);
// 			});
// 		}
// 		return error;
// 	});
// }

// /* Function to prepare, sign, and submit a transaction to the XRP Ledger. */
// function submitTransaction(lastClosedLedgerVersion, prepared, secret) 
// {
// 	const signedData = api.sign(prepared.txJSON, secret);
// 	return api.submit(signedData.signedTransaction).then(data => 
// 	{
// 		console.log('Tentative Result: ', data.resultCode);
// 		console.log('Tentative Message: ', data.resultMessage);
// 		/* If transaction was not successfully submitted throw error */
// 		assert.strictEqual(data.resultCode, 'tesSUCCESS');
// 		/* 'tesSUCCESS' means the transaction is being considered for the next ledger, and requires validation. */

// 		/* If successfully submitted, begin validation workflow */
// 		const options =
// 		{
// 			minLedgerVersion: lastClosedLedgerVersion,
// 			maxLedgerVersion: prepared.instructions.maxLedgerVersion
// 		};
// 		return new Promise((resolve, reject) => 
// 		{
// 			setTimeout(() => verifyTransaction(signedData.id, options).then(resolve, reject), INTERVAL);
// 		});
// 	});
// }