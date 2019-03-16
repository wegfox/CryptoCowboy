'use strict';

import Card from '../../components/basic/card.js'; // or './module'

import ComboBox from '../../components/elements/ComboBox.js';
//import { isBuffer } from 'util';

export default class ExchangeCard
{
	constructor(socket, wallet)
	{
		this.socket = socket;
		this.wallet = wallet;

		this.exchangeCard =
			{
				id: "exchangeCard-" + wallet.address,
				title: "Exchange",
				subTitle: "",
				body: " ",
				onClick: null
			};

		this.card = new Card(this.exchangeCard);

		this.element = (this.card).element;

		this.baseCurrency = new ComboBox("currencyCode");
		this.pairCurrency = new ComboBox("currencyCode");

		this.baseCurrency.element.onchange = () => 
		{
			this.baseCurrencyChange();
		};

		this.pairCurrency.element.onchange = () => 
		{
			this.pairCurrencyChange();
		};

		this.orderBook = document.createElement("div");
		this.card.appendBody(this.orderBook);

		this.spread = document.createElement("div");
		this.spread.style.flexFlow = "row wrap";

		this.header = document.createElement("span");
		//header.style.flexFlow = "column";
		this.header.style.display = "flex";
		this.header.style.flexDirection = "row";

		this.ask = document.createElement("h6");
		this.bid = document.createElement("h6");
		this.ask.style.flex = 1;
		this.bid.style.flex = 1;

		this.header.append(this.bid);
		this.header.append(this.ask);

		this.spread.append(this.header);

		this.orderBook.append(this.spread);

		this.ask.innerHTML = "ask";
		this.bid.innerHTML = "bid";
	}

	populateBasePair()
	{
		this.baseCurrency.setOptions(this.assets);
		this.pairCurrency.setOptions(this.assets);
	}

	baseCurrencyChange()
	{
		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;

		this.socket.emit('orderBook', currencyPair);
	}

	pairCurrencyChange()
	{
		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;

		this.socket.emit('orderBook', currencyPair);
	}

	displayExchange(assets)
	{
		this.assets = assets;

		this.populateBasePair();

		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;

		this.socket.emit('orderBook', currencyPair);

		this.card.appendBody("Purchase ");

		this.buyCount = document.createElement("input");
		this.buyCount.type = "number";
		this.buyCount.name = "buyCount";
		this.buyCount.min = 0;
		this.buyCount.max = 5;
		this.buyCount.step = 0.05;
		this.buyCount.value = 1.00;
		this.card.appendBody(this.buyCount);
		this.card.appendBody(this.pairCurrency.element);

		this.card.appendBody(" for ");

		this.sellCount = document.createElement("input");
		this.sellCount.type = "number";
		this.sellCount.name = "sellCount";
		this.sellCount.min = 0;
		this.sellCount.max = 5;
		this.sellCount.step = 0.05;
		this.sellCount.value = 0.00;
		this.card.appendBody(this.sellCount);
		this.card.appendBody(this.baseCurrency.element);

		/*
				this.buyCount.onchange = () => 
				{
					this.sellCount.value = this.buyCount.value * this.askValue;
				};
		
				this.sellCount.onchange = () => 
				{
					this.buyCount.value = this.sellCount.value / this.askValue;
				};
				*/

		this.card.appendBody(document.createElement("br"));
	}

	set Ask(askObject)
	{
		let ask = askObject.basePerPair;
		this.askValue = ask;
		ask = 1.00 / ask;
		ask = parseFloat(ask.toFixed(4));
		this.ask.innerHTML = "Ask<br>" + ask;

		//this.sellCount.value = this.buyCount.value * ask;
	}

	set Bid(bidObject)
	{
		let bid = bidObject.basePerPair;
		this.bidValue = bid;
		//bid = 1.00 / bid;
		bid = parseFloat(bid.toFixed(4));
		this.bid.innerHTML = "Bid<br>" + bid;
	}

	set OrderBook(orderBook)
	{
		if (orderBook.spread == "ask")
		{
			this.Ask = orderBook;
		}
		else if (orderBook.spread == "bid")
		{
			this.Bid = orderBook;
		}
	}

	set Assets(assets)
	{
		//alert(JSON.stringify(assets));
		//this.displayExchange(a);


	}

	set Wallets(wallets)
	{
		//this.displayExchange(wallets);


	}
}