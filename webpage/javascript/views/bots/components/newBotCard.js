'use strict';

import Card from '../../components/basic/card.js'; // or './module'
import ComboBox from '../../components/elements/ComboBox.js';

export default class NewBotCard
{
	constructor(socket)
	{
		this.socket = socket;
		
		let bodyHTML = `Nickname: <input type="text" id="botID" placeholder="Nickname"><br>
		Base currency Fixed point: <input id="botFixedPoint"></input><br>
		Pair currency funding: <input id="botFunding"></input><br>
		Pair max funding: <input id="botMaxFunding"></input><br>
		Minimum Range:<input id="botRangeMin"></input><br>
		Maximum range: <input id="botRangeMax"></input><br>
		Starting range: <input id="botRangeStart"></input><br>
		Range growth rate: <input id="botGrowthRate"></input><br>
		Range decay rate: <input id="botDecayRate"></input><br>`;


		this.selectCurrency = document.createElement("div");
		this.selectCurrency.style.display = "flex";
		this.selectCurrency.style.flexDirection = "row";

		this.selectWallet  = new ComboBox("address");
		this.selectWallet.OnUpdate(() => 
		{
			
		});
		this.appendText(this.selectCurrency, "Wallet: ");
		this.selectCurrency.append(this.selectWallet.element);

		this.pairCurrency = new ComboBox("currencyCode");
		this.pairCurrency.OnUpdate(() => 
		{
			this.pairCurrencyChange();
		});

		this.pairCurrency.element.style.flex = 1;
		this.appendText(this.selectCurrency, "Pair currency: ");
		this.selectCurrency.append(this.pairCurrency.element);

		this.baseCurrency = new ComboBox("currencyCode");
		this.baseCurrency.OnUpdate(() => 
		{
			this.baseCurrencyChange();
		});

		this.baseCurrency.element.style.flex = 1;
		this.appendText(this.selectCurrency, "Base currency: ");
		this.selectCurrency.append(this.baseCurrency.element);

		//document.getElementById("myText").value = "Johnny Bravo";
		this.newBotCard =
			{
				id: "newBotCard",
				title: "Generate new bot",
				subTitle: "",
				body: bodyHTML,
				onClick: null
			};

		this.card = new Card(this.newBotCard);
		this.card.append(this.selectCurrency);

		this.card.left();

		this.element = (this.card).element;

		this.socket.emit('getWallets', null);

		this.addBotButton = document.createElement("button");
		this.addBotButton.innerHTML = "Add Bot";

		this.addBotButton.onclick = () => 
		{
			let bot = {};
			bot.id = botID.value;

			bot.wallet = this.selectWallet.Value;
			bot.baseCurrency = this.baseCurrency.Value;
			bot.pairCurrency = this.pairCurrency.Value;

			bot.fixedPoint = botFixedPoint.value;
			bot.funding = botFunding.value;
			bot.maxFunding = botMaxFunding.value;
			bot.rangeMin = botRangeMin.value;
			bot.rangeMax = botRangeMax.value;
			bot.range = botRangeStart.value;
			bot.growthRate = botGrowthRate.value;
			bot.decayRate = botDecayRate.value;

			alert(JSON.stringify(bot));
			this.socket.emit('addBot', bot);
		};

		this.card.append(this.addBotButton);
		
	}

	appendText(element, text)
	{
		let newText = document.createElement("div");
		newText.innerHTML = text;
		newText.style.flex = 1;
		element.append(newText);
	}


	baseCurrencyChange()
	{

		if (this.baseCurrency.Value == this.pairCurrency.Value)
		{
			this.pairCurrency.Index = this.baseCurrency.oldIndex;
		}

		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;

		this.socket.emit('getOrderBook', currencyPair);
	}

	pairCurrencyChange()
	{

		if (this.baseCurrency.Value == this.pairCurrency.Value)
		{
			this.baseCurrency.Index = this.pairCurrency.oldIndex;
		}

		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;

		this.socket.emit('getOrderBook', currencyPair);
	}

	set Wallets(wallets)
	{
		this.wallets = wallets;
		this.selectWallet.setOptions(wallets);

		this.socket.emit('getAssets', this.selectWallet.Value);
	}

	populateBasePair()
	{
		this.baseCurrency.setOptions(this.assets);
		this.pairCurrency.setOptions(this.assets);

		if (this.baseCurrency.Value == this.pairCurrency.Value)
		{
			this.baseCurrency.Next();
		}
	}

	set Assets(assets)
	{
		this.assets = assets;

		this.populateBasePair();

		

		let currencyPair = {};
		currencyPair.baseCurrency = this.baseCurrency.Value;
		currencyPair.pairCurrency = this.pairCurrency.Value;



		this.socket.emit('getOrderBook', currencyPair);

		this.card.appendBody(document.createElement("br"));
	}
	
	displayAssets(assets)
	{
		let manageWalletCard = this;

		manageWalletCard.card.Body = "";
		assets.forEach(function (asset)
		{
			if (asset.counterparty == null)
			{
				asset.counterparty = "";
			}

			let element = document.createElement("hi");
			element.id = asset.currencyCode + "-" + asset.counterparty;
			element.style.flexFlow = "row wrap";

			let header = document.createElement("span");
			//header.style.flexFlow = "column";
			header.style.display = "flex";
			header.style.flexDirection = "row";

			let title = document.createElement("h6");
			//title.className = "card-title m-0";
			title.innerHTML = asset.currencyCode;
			title.style.flex = 1;

			let cp = document.createElement("h6");
			cp.innerHTML = asset.counterparty;
			cp.style.flex = 1;
			header.append(title);
			header.append(cp);


			let balance = document.createElement("p");
			balance.innerHTML = asset.balance;


			let separator = document.createElement("hr");

			element.append(header);
			element.append(balance);
			element.append(separator);

			manageWalletCard.card.appendBody(element);
		});
	}

	show()
	{
		this.element.style.display = "block";
	}
	hide()
	{
		this.element.style.display = "none";
	}

	select()
	{
		this.element.classList.add("text-white", "bg-primary");
	}

	deselect()
	{
		this.element.classList.remove("text-white", "bg-primary");
	}
}