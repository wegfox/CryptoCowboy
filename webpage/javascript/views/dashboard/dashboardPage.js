'use strict';

import Events from '../../library/events.js';
import { table } from '../components/basic/table.js';
import Binding from '../../library/binding.js';
import WalletCard from '../wallets/components/walletCard.js';
import DeployBot from './components/deployBot.js';
import BotCard from '../bots/components/botCard.js'; // or './module'
import Grid from '../components/basic/grid.js';


export default class DashboardPage
{
	constructor(socket)
	{
		this.socket = socket;
		this.events = new Events();
		this.element = document.createElement("div");
		this.element.id = "DashboardPage";
		this.element.style.display = "none";

		let summary = { title: "Summary", width: 3 };
		let dashboard = { title: "Dashboard", width: 6 };
		let history = { title: "History", width: 3 };

		this.table = table(summary, dashboard, history);

		this.summary = this.table.querySelector("#Summary");
		this.dashboard = this.table.querySelector("#Dashboard");
		this.history = this.table.querySelector("#History");

		let logs = document.createElement("ul");
		logs.id = "logs";
		logs.style = "height:500px; overflow-y:scroll;";

		this.history.append(logs);

		this.element.append(this.table);

		this.events.subscribe('walletSelected', (wallet) => 
		{
			this.onWalletSelected(wallet);
		});

		//let b = {};
		//let bind = new Binding(b);
		//alert(bind);
	}


	set Wallets(wallets)
	{
		let dashboardPage = this;
		let events = this.events;
		if (dashboardPage.summary != null)
		{
			dashboardPage.summary.innerHTML = "";

			for (var key in wallets) 
			{
				let wallet = wallets[key];
				dashboardPage.summary.append(new WalletCard(events, wallet).element);
			}
		}
	}

	set Assets(assets)
	{
		if (this.deployBot != null)
		{
			this.deployBot.displayAssets(assets);
		}
	}

	get Bots()
	{
		return this.bots;
	}

	set Bots(value)
	{
		let bots = value;

		if(bots == null)
		{
			console.log("No bots found");
		}

		this.bots = bots;

		for (var key in bots) 
		{
			let bot = bots[key];
			let botCard = new BotCard(this.events, bot);

			botCard.events.subscribe('botSelected', () => 
			{
				botCard.card.deselect();
			});

			this.dashboard.append(botCard.element);
		}

		let gridTest = new Grid("My Grid");
		this.dashboard.append(gridTest.element);

	
	}

	show()
	{
		this.element.style.display = "block";

	}
	hide()
	{
		this.element.style.display = "none";
	}

	onWalletSelected(wallet)
	{
		this.dashboard.innerHTML = '';
		this.deployBot = new DeployBot(wallet);
		this.dashboard.append(this.deployBot.element);
		//this.selectedWalletTitle = this.element.querySelector("#Deploy-Header");
		//this.selectedWalletTitle.innerHTML = wallet.nickname + "<br>" + wallet.address;
		this.socket.emit("getAssets", wallet);
	}

	// Getter
	// get area() {
	//   return this.calcArea();
	// }
	// // Method
	// calcArea() {
	//   return this.height * this.width;
	// }
}