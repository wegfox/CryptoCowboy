'use strict';

import Card from '../../components/basic/card.js'; // or './module'
import Binding from '../../../library/binding.js';
import ComboBox from '../../components/elements/ComboBox.js';
//import { isBuffer } from 'util';

export default class ExchangeCard
{
	constructor(socket, wallet)
	{
		this.socket = socket;
		this.wallet = wallet;

		//	Create Card
		this.card = new Card({
			id: "exchangeCard-" + wallet.address,
			title: "Exchange",
			subTitle: "",
			body: " ",
			onClick: null
		});

		this.element = (this.card).element;

		//	Create exchangeCard body
		this.exchangeCard = document.createElement("div");
		this.card.appendBody(this.exchangeCard);
		this.exchangeCard.style.flexFlow = "row wrap";

		//	Create currency selection row
		this.selectCurrency = this.generateCurrencySelection();
		this.exchangeCard.append(this.selectCurrency);

		this.exchangeCard.append(document.createElement("hr"));

		//	Create orderBook row
		this.orderBook = this.generateBidAsk();
		this.exchangeCard.append(this.orderBook);

		this.exchangeCard.append(document.createElement("br"));

		//	Create purchase row
		this.generateExchange(this.exchangeCard);
	}

	generateCurrencySelection()
	{
		this.selectCurrency = document.createElement("div");
		this.selectCurrency.style.display = "flex";
		this.selectCurrency.style.flexDirection = "row";

		this.pairCurrency = new ComboBox("currencyCode");
		this.pairCurrency.OnUpdate(() => 
		{
			this.pairCurrencyChange();
		});

		this.pairCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.pairCurrency.element);

		this.baseCurrency = new ComboBox("currencyCode");
		this.baseCurrency.OnUpdate(() => 
		{
			this.baseCurrencyChange();
		});

		this.baseCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.baseCurrency.element);

		return this.selectCurrency;
	}

	generateExchange(parent)
	{
		//	Purchase amount
		let amount = document.createElement("div");
		amount.style.display = "flex";
		amount.style.flexDirection = "row";
		parent.append(amount);

		this.appendText(amount, "Amount: ");

		this.buyCount = document.createElement("input");
		this.buyCount.style.flex = 1;
		this.buyCount.type = "number";
		this.buyCount.name = "buyCount";
		this.buyCount.min = 0;
		//this.buyCount.max = 5;
		this.buyCount.step = 0.05;
		this.buyCount.value = 1.00;
		this.buyCount.style.flex = 1;
		amount.append(this.buyCount);

		this.pairText = document.createElement("div");
		this.pairCurrency.BindElement(this.pairText, "innerHTML");
		this.pairText.style.flex = 1;
		amount.append(this.pairText);

		//	Purchase for price
		let price = document.createElement("div");
		price.style.display = "flex";
		price.style.flexDirection = "row";
		parent.append(price);

		this.appendText(price, "Price: ");

		this.price = document.createElement("input");
		this.price.type = "number";
		this.price.name = "sellCount";
		this.price.min = 0;
		//this.price.max = 5;
		this.price.step = 0.05;
		this.price.value = 0.00;
		this.price.style.flex = 1;
		price.append(this.price);

		this.priceText = document.createElement("div");
		this.priceText.style.flex = 1;
		price.append(this.priceText);

		Object.defineProperty(this.priceText, 'pair',
			{
				value: "-",
				writable: true
			});

		Object.defineProperty(this.priceText, 'base',
			{
				value: "-",
				writable: true
			});

		this.baseCurrency.BindElement(this.priceText, "base");
		this.pairCurrency.BindElement(this.priceText, "pair");

		this.pairCurrency.OnUpdate(() => 
		{
			this.priceText.innerHTML = this.priceText.base + " per " + this.priceText.pair;
		});

		this.baseCurrency.OnUpdate(() => 
		{
			this.priceText.innerHTML = this.priceText.base + " per " + this.priceText.pair;
		});

		//	Purchase cost
		let cost = document.createElement("div");
		cost.style.display = "flex";
		cost.style.flexDirection = "row";
		parent.append(cost);

		this.appendText(cost, "Cost: ");

		this.sellCount = document.createElement("input");
		this.sellCount.type = "number";
		this.sellCount.name = "sellCount";
		this.sellCount.min = 0;
		//this.sellCount.max = 5;
		this.sellCount.step = 0.05;
		this.sellCount.value = 0.00;
		this.sellCount.style.flex = 1;
		cost.append(this.sellCount);

		this.baseText = document.createElement("div");
		this.baseCurrency.BindElement(this.baseText, "innerHTML");
		this.baseText.style.flex = 1;
		cost.append(this.baseText);

		this.exchangeCard.append(document.createElement("br"));

		this.button = document.createElement("button");
		this.button.innerHTML = " " + "Submit";
		this.button.style.flex = 1;
		parent.append(this.button);

		this.price.oninput = () => 
		{
			this.sellCount.value = (this.buyCount.value * this.price.value).toFixed(4);
		};

		this.sellCount.oninput = () => 
		{
			this.price.value = (this.sellCount.value / this.buyCount.value).toFixed(4);
		};

		this.buyCount.oninput = () => 
		{
			this.sellCount.value = (this.buyCount.value * this.price.value).toFixed(4);
		};
	}

	appendText(element, text)
	{
		let newText = document.createElement("div");
		newText.innerHTML = text;
		newText.style.flex = 1;
		element.append(newText);
	}
	generateBidAsk()
	{
		//	Create orderBook row
		let orderBook = document.createElement("div");
		orderBook.style.display = "flex";
		orderBook.style.flexDirection = "row";

		this.bid = document.createElement("h6");
		this.bid.style.flex = 1;
		orderBook.append(this.bid);

		this.ask = document.createElement("h6");
		this.ask.style.flex = 1;
		orderBook.append(this.ask);

		return orderBook;
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

		this.card.appendBody(document.createElement("br"));
	}

	populateBasePair()
	{
		this.baseCurrency.setOptions(this.assets);
		this.pairCurrency.setOptions(this.assets);
	}

	set Ask(askObject)
	{
		let ask = askObject.basePerPair;
		this.askValue = ask;
		ask = 1.00 / ask;
		ask = parseFloat(ask.toFixed(4));
		this.ask.innerHTML = "Ask<br>" + ask;

		if (this.price.value == 0.00)
		{
			this.price.value = ask;
			this.sellCount.value = this.buyCount.value * this.price.value;
		}
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





