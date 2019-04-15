'use strict';

import Events from '../../library/events.js';
import Card from '../components/basic/card.js'; // or './module'
import { table } from '../components/basic/table.js'; // or './module'
import BotCard from './components/botCard.js'; // or './module'
import NewBotCard from './components/newBotCard.js'; // or './module'
import BotConfig from './botConfig.js'; // or './module'
import ExchangeCard from './components/exchangeCard.js'; // or './module'
import ManageWalletCard from './components/manageWalletCard.js'; // or './module'

export class BotsPage
{
	constructor(socket)
	{
		this.socket = socket;
		this.events = new Events();

		this.element = document.createElement("div");
		this.element.id = "BotsPage";
		this.element.style.display = "none";

		let bots = { title: "Bots", width: 3 };
		let build = { title: "Build", width: 6 };
		//let tweak = { title: "Tweak", width: 3 };
		let play = { title: "Play", width: 3 };

		this.table = table(bots, build, play);

		this.bots = this.table.querySelector("#Bots");
		this.build = this.table.querySelector("#Build");
		//this.manage = this.table.querySelector("#Tweak");
		this.play = this.table.querySelector("#Play");
		

		this.events.subscribe('botSelected', (bot) => 
		{
			this.onBotSelected(bot);
		});

		this.element.append(this.table);

		let newBotCardData =
			{
				id: "newBotCard",
				title: "Add New Bot",
				subTitle: " ",
				body: "",
				events: this.events,
				onClick: (card) => 
				{
					card.events.publish('botSelected', null);
					card.select();

					
				}
			};

			let newBotCard = new Card(newBotCardData);

			newBotCard.events.subscribe('botSelected', () => 
			{
				newBotCard.deselect();



			});

			this.bots.append(newBotCard.element);

			//this.bots.append(newBotCard.element);

		this.socket.emit("getBots", "");
	}


	async onBotSelected(bot)
	{
		if (bot.id == null)
		{
			this.build.innerHTML = '';
			let newBotCard = new NewBotCard(this.socket);
			this.build.append(newBotCard.element);
			//this.selectedWalletTitle = this.element.querySelector("#Manage-Header");

			this.newBotCard = newBotCard;
		}
		else
		{
			this.build.innerHTML = '';
			let newBotCard = new BotConfig(bot, this.socket);
			this.build.append(newBotCard.element);
			//this.selectedWalletTitle = this.element.querySelector("#Manage-Header");

			this.newBotCard = newBotCard;
			/*
			this.manage.innerHTML = '';

			this.selectedWalletTitle = this.element.querySelector("#Manage-Header");
			this.selectedWalletTitle.innerHTML = wallet.nickname + "<br>" + wallet.address;

			this.assetsCard = new AssetsCard(this.socket, wallet);
			this.manage.append(this.assetsCard.element);

			this.exchangeCard = new ExchangeCard(this.socket, wallet);
			this.manage.append(this.exchangeCard.element);

			this.manageWalletCard = new ManageWalletCard(this.socket, wallet);
			this.manage.append(this.manageWalletCard.element);

			await this.socket.emit("getAssets", wallet);
			*/
		}
	}

	set Bots(bots)
	{
		if(bots == null)
		{
			console.log("No bots found");
		}

		for (var key in bots) 
		{
			let bot = bots[key];
			let botCard = new BotCard(this.events, bot);

			botCard.events.subscribe('botSelected', () => 
			{
				botCard.card.deselect();
			});

			this.bots.append(botCard.element);
		}

	}

	set Wallets(wallets)
	{
		if(this.newBotCard != null)
		{
			this.newBotCard.Wallets = wallets;
		}

	}

	set Assets(assets)
	{
		if(this.newBotCard != null)
		{
			this.newBotCard.Assets = assets;
		}


		if (this.assetsCard != null)
		{
			this.assetsCard.displayAssets(assets);

			this.exchangeCard.displayExchange(assets);
			this.manageWalletCard.displayWalletOptions();


		}
	}
}