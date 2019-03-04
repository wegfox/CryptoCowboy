'use strict';

import Card from '../../components/basic/card.js'; // or './module'
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

		this.baseCurrency = document.createElement("select");
		this.pairCurrency = document.createElement("select");

		this.orderBook = document.createElement("div");
		this.ask = document.createElement("div");
		this.bid = document.createElement("div");
		this.orderBook.append(this.ask);
		this.orderBook.append(this.bid);
		this.card.appendBody(this.orderBook);
		this.ask.innerHTML = "ask";
		this.bid.innerHTML = "bid";
	}


	displayExchange(assets)
	{
		let baseCurrency = this.baseCurrency;
		let pairCurrency = this.pairCurrency;

		baseCurrency.innerHTML = "";
		assets.forEach(function (asset)
		{
			if (asset.currencyCode != null)
			{
				let option = document.createElement("option");
				option.value = asset.currencyCode;
				option.innerHTML = asset.currencyCode;
				baseCurrency.append(option);
			}
		});

		pairCurrency.innerHTML = "";
		assets.forEach(function (asset)
		{
			if (asset.currencyCode != null)
			{
				let option = document.createElement("option");
				option.value = asset.currencyCode;
				option.innerHTML = asset.currencyCode;
				pairCurrency.append(option);
			}

		});

		this.card.appendBody("Buy ");

		let buyCount = document.createElement("input");
		buyCount.type = "number";
		buyCount.name = "buyCount";
		buyCount.min = 0;
		buyCount.max = 5;
		buyCount.step = 0.05;
		buyCount.value = 0.00;
		this.card.appendBody(buyCount);

		this.card.appendBody(baseCurrency);
		this.card.appendBody(" for ");

		let sellCount = document.createElement("input");
		sellCount.type = "number";
		sellCount.name = "sellCount";
		sellCount.min = 0;
		sellCount.max = 5;
		sellCount.step = 0.05;
		sellCount.value = 0.00;
		this.card.appendBody(sellCount);


		this.card.appendBody(pairCurrency);
		this.card.appendBody(document.createElement("br"));
	}

	set Ask(ask)
	{
		this.ask.innerHTML = ask;
	}

	set Bid(bidObject)
	{
		let bid = JSON.stringify(bidObject);
		this.bid.innerHTML = bid;
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