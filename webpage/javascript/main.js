'use strict';
// @ts-check

import NavigationBar from './views/components/navigationBar.js';
import { log } from './library/logs.js';
import Router from './library/router.js';
import DashboardPage from './views/dashboard/dashboardPage.js';
import { WalletsPage } from './views/wallets/walletsPage.js';
import { BotsPage } from './views/bots/botsPage.js';
import { OptionsPage } from './views/options/optionsPage.js';
import { SupportPage } from './views/support/supportPage.js';

export default class App
{
	constructor(socket)
	{
		this.socket = socket;
		this.views =
			{
				Dashboard: new DashboardPage(socket),
				Wallets: new WalletsPage(socket),
				Bots: new BotsPage(socket),
				Options: new OptionsPage(socket),
				Support: new SupportPage()
			};

		this.MainView = document.getElementById("app");
	}

	initialize()
	{
		this.router = new Router(this);
		this.router.route();

		this.navigationBar = new NavigationBar(this.router);
		document.getElementById("header").append(this.navigationBar.element);

		this.socket.emit("getWallets", "");
		//socket.emit("getSettings", "");
	}

	start()
	{
		let socket = this.socket;
		let views = this.views;

		let Wallets = this.Wallets;
		let Bots = this.Bots;

		//	This is mostly for development
		socket.on('reset', () =>
		{
			location.reload();
		});

		socket.on('log', (logs) =>
		{
			log(logs);
		});

		socket.on('version', (version) =>
		{
			this.navigationBar.Version = version;
		});

		socket.on('wallets', (wallets) =>
		{
			Wallets = wallets;

			views.Dashboard.Wallets = wallets;
			views.Wallets.Wallets = wallets;
			views.Bots.Wallets = wallets;
		});

		socket.on('bots', (bots) =>
		{
			Bots = bots;

			views.Bots.Bots = bots;
		});

		socket.on('assets', (assets) =>
		{
			if (assets == null)
			{
				alert("There was an error reading wallet assets");
			}
			views.Dashboard.Assets = assets;
			views.Wallets.Assets = assets;
			views.Bots.Assets = assets;
		});

		socket.on('orderBook', (orderBook) =>
		{
			if (orderBook == null)
			{
				alert("There was an error reading order book");
			}
			else
			{
				//alert(orderBook);
				this.views.Wallets.OrderBook = orderBook;
			}
			//views.Dashboard.Assets = assets;
			//views.Wallets.OrderBook = orderBook;
		});
	}
}