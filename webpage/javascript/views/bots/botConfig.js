'use strict';

import Card from '../components/basic/card.js'; // or './module'
import ComboBox from '../components/elements/ComboBox.js';
import Element from '../components/element.js';

export default class BotConfigCard
{
	constructor(bot, socket)
	{
		this.bot = bot;
		this.socket = socket;
		
		let bodyHTML = ``;

		this.botConfigData =
			{
				id: "botConfig",
				title: "Bot Config",
				subTitle: "",
				body: bodyHTML,
				onClick: null
			};

		this.card = new Card(this.botConfigData);
		this.card.left();
		this.element = (this.card).body;

		this.appendText(this.element, "Nickname: ");

		this.nickname_textBox = document.createElement("input");
		this.nickname_textBox.id = "botID";
		this.nickname_textBox.type = "text";
		this.nickname_textBox.placeholder = "Nickname";
		this.element.append(this.nickname_textBox);

		this.appendText(this.element, "Base currency Fixed point: ");
		
		this.fixedPoint_textBox = document.createElement("input");
		this.fixedPoint_textBox.id = "botFixedPoint";
		this.element.append(this.fixedPoint_textBox);

		this.appendText(this.element, "Pair currency funding: ");
		
		this.botFunding_textBox = document.createElement("input");
		this.botFunding_textBox.id = "botFunding";
		this.element.append(this.botFunding_textBox);

		this.appendText(this.element, "Pair max funding: ");
		
		this.botMaxFunding_textBox = document.createElement("input");
		this.botMaxFunding_textBox.id = "botMaxFunding";
		this.element.append(this.botMaxFunding_textBox);

		this.appendText(this.element, "Minimum Range: ");

		this.botRangeMin_textBox = document.createElement("input");
		this.botRangeMin_textBox.id = "botRangeMin";
		this.element.append(this.botRangeMin_textBox);

		this.appendText(this.element, "Maximum range: ");

		this.botRangeMax_textBox = document.createElement("input");
		this.botRangeMax_textBox.id = "botRangeMax";
		this.element.append(this.botRangeMax_textBox);

		this.appendText(this.element, "Starting range: ");

		this.botRangeStart_textBox = document.createElement("input");
		this.botRangeStart_textBox.id = "botRangeStart";
		this.element.append(this.botRangeStart_textBox);

		this.appendText(this.element, "Range growth rate: ");

		this.botGrowthRate_textBox = document.createElement("input");
		this.botGrowthRate_textBox.id = "botGrowthRate";
		this.element.append(this.botGrowthRate_textBox);

		this.appendText(this.element, "Range decay rate: ");

		this.botDecayRate_textBox = document.createElement("input");
		this.botDecayRate_textBox.id = "botDecayRate";
		this.element.append(this.botDecayRate_textBox);

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

		this.element.append(this.selectCurrency);


		this.socket.emit('getWallets', null);

		this.addBotButton = document.createElement("button");
		this.addBotButton.innerHTML = "Add Bot";


		if(bot != null)
		{
			this.populateData(bot);
		}


		this.addBotButton.onclick = () => 
		{
			let bot = {};
			bot.id = botID.value;

			bot.wallet = JSON.stringify(this.selectWallet.Value);
			bot.baseCurrency = JSON.stringify(this.baseCurrency.Value);
			bot.pairCurrency = JSON.stringify(this.pairCurrency.Value);

			bot.fixedPoint = botFixedPoint.value;
			bot.funding = botFunding.value;
			bot.maxFunding = botMaxFunding.value;
			bot.rangeMin = botRangeMin.value;
			bot.rangeMax = botRangeMax.value;
			bot.range = botRangeStart.value;
			bot.growthRate = botGrowthRate.value;
			bot.decayRate = botDecayRate.value;

			//alert(JSON.stringify(bot));
			this.socket.emit('updateBot', bot);
		};

		this.card.append(this.addBotButton);
	}
	

	populateData(bot)
	{
		if(bot.id != null)
		{
			this.nickname_textBox.value = bot.id;
		}

		if(bot.wallet != null)
		{
			this.selectWallet.value = bot.wallet.address;
		}

		if(bot.fixedPoint != null)
		{
			this.fixedPoint_textBox.value = bot.fixedPoint;
		}

		if(bot.funding)
		{
			this.botFunding_textBox.value = bot.funding;
		}

		if(bot.maxFunding)
		{
			this.botMaxFunding_textBox.value = bot.maxFunding;
		}

		if(bot.rangeMin)
		{
			this.botRangeMin_textBox.value = bot.rangeMin;
		}

		if(bot.rangeMax)
		{
			this.botRangeMax_textBox.value = bot.rangeMax;
		}

		if(bot.range)
		{
			this.botRangeStart_textBox.value = bot.range;
		}

		if(bot.growthRate)
		{
			this.botGrowthRate_textBox.value = bot.growthRate;
		}

		if(bot.decayRate)
		{
			this.botDecayRate_textBox.value = bot.decayRate;
		}

		if(bot.baseCurrency.currencyCode)
		{
			this.baseCurrency.Text = bot.baseCurrency.currencyCode;
		}

		if(bot.pairCurrency.currencyCode)
		{
			this.pairCurrency.Text = bot.pairCurrency.currencyCode;
		}


		/*

			bot.baseCurrency = JSON.stringify(this.baseCurrency.Value);
			bot.pairCurrency = JSON.stringify(this.pairCurrency.Value);

			bot.rangeMax = botRangeMax.value;
			bot.range = botRangeStart.value;
			bot.growthRate = botGrowthRate.value;
			bot.decayRate = botDecayRate.value;

			*/
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

		if(this.bot != null)
		{
			this.populateData(this.bot);
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