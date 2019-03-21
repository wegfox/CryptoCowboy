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

		//	Create orderbook body
		this.orderBook = document.createElement("div");
		this.card.appendBody(this.orderBook);
		this.orderBook.style.flexFlow = "row wrap";

		//	Create currency selection row
		this.selectCurrency = document.createElement("div");
		this.selectCurrency.style.display = "flex";
		this.selectCurrency.style.flexDirection = "row";
		this.orderBook.append(this.selectCurrency);

		this.baseCurrency = new ComboBox("currencyCode");
		this.baseCurrency.element.onchange = () => 
		{
			this.baseCurrencyChange();
		};
		this.baseCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.baseCurrency.element);

		this.pairCurrency = new ComboBox("currencyCode");
		this.pairCurrency.element.onchange = () => 
		{
			this.purchaseText2.innerHTML = this.pairCurrency.Value.currencyCode + " for ";
			this.pairCurrencyChange();
		};

		this.pairCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.pairCurrency.element);

		this.orderBook.append(document.createElement("hr"));

		//	Create spread row
		this.spread = document.createElement("div");
		this.spread.style.display = "flex";
		this.spread.style.flexDirection = "row";
		this.orderBook.append(this.spread);

		this.bid = document.createElement("h6");
		this.bid.style.flex = 1;
		this.spread.append(this.bid);

		this.ask = document.createElement("h6");
		this.ask.style.flex = 1;
		this.spread.append(this.ask);

		this.orderBook.append(document.createElement("br"));


		//	Create purchase row
		this.purchase = document.createElement("div");
		this.purchase.style.display = "flex";
		this.purchase.style.flexDirection = "row";
		this.orderBook.append(this.purchase);

		let purchaseText = document.createElement("div");
		purchaseText.innerHTML = "Purchase ";
		purchaseText.style.flex = 1;
		this.purchase.append(purchaseText);

		this.buyCount = document.createElement("input");
		this.buyCount.style.flex = 1;
		this.buyCount.type = "number";
		this.buyCount.name = "buyCount";
		this.buyCount.min = 0;
		this.buyCount.max = 5;
		this.buyCount.step = 0.05;
		this.buyCount.value = 1.00;
		this.purchase.append(this.buyCount);

		this.purchaseText2 = document.createElement("div");
		this.purchaseText2.innerHTML = this.pairCurrency.Text + " for ";
		this.purchaseText2.style.flex = 1;
		this.purchase.append(this.purchaseText2);

		this.orderBook.append(document.createElement("br"));



		this.sellCount = document.createElement("input");
		this.sellCount.type = "number";
		this.sellCount.name = "sellCount";
		this.sellCount.min = 0;
		this.sellCount.max = 5;
		this.sellCount.step = 0.05;
		this.sellCount.value = 0.00;
		this.purchase.append(this.sellCount);





		/*
		
		
				this.header = document.createElement("span");
				//header.style.flexFlow = "column";
				this.header.style.display = "flex";
				this.header.style.flexDirection = "row";
				this.header.append(this.selectCurrency);
				this.spread.append(this.header);
		
				//this.selectCurrency.appendBody(this.baseCurrency.element);
		

				this.buy =
					{
						id: "buyCard",
						title: "Purchase",
						subTitle: "",
						body: "",
						onClick: null
					};
		
				this.buyCard = new Card(this.buy);
				this.header.append(this.buyCard.element);

				*/
	}

	generateCurrencySelection()
	{
		this.selectCurrency = document.createElement("div");
		this.selectCurrency.style.display = "flex";
		this.selectCurrency.style.flexDirection = "row";

		this.baseCurrency = new ComboBox("currencyCode");
		this.baseCurrency.element.onchange = () => 
		{
			this.baseCurrencyChange();
		};
		this.baseCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.baseCurrency.element);

		this.pairCurrency = new ComboBox("currencyCode");
		this.pairCurrency.element.onchange = () => 
		{
			this.purchaseText2.innerHTML = this.pairCurrency.Value.currencyCode + " for ";
			this.pairCurrencyChange();
		};

		this.pairCurrency.element.style.flex = 1;
		this.selectCurrency.append(this.pairCurrency.element);

		return this.selectCurrency;
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





