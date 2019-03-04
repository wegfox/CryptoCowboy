'use strict';

import Events from '../../library/events.js';
import { table } from '../components/basic/table.js';
import Binding from '../../library/binding.js';
import WalletCard from '../wallets/components/walletCard.js';
import DeployBot from './components/deployBot.js';
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
		let deploy = { title: "Deploy", width: 3 };
		let monitor = { title: "Monitor", width: 3 };
		let history = { title: "History", width: 3 };

		this.table = table(summary, deploy, monitor, history);

		this.summary = this.table.querySelector("#Summary");
		this.deploy = this.table.querySelector("#Deploy");
		this.monitor = this.table.querySelector("#Monitor");
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
		this.deploy.innerHTML = '';
		this.deployBot = new DeployBot(wallet);
		this.deploy.append(this.deployBot.element);
		this.selectedWalletTitle = this.element.querySelector("#Deploy-Header");
		this.selectedWalletTitle.innerHTML = wallet.nickname + "<br>" + wallet.address;
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