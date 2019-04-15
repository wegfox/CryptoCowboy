'use strict';

import Events from '../../library/events.js';
import Card from '../components/basic/card.js'; // or './module'
import { table } from '../components/basic/table.js'; // or './module'
import WalletCard from './components/walletCard.js'; // or './module'
import NewWalletCard from './components/newManageWalletCard.js'; // or './module'
import AssetsCard from './components/assetsCard.js'; // or './module'
import ExchangeCard from './components/exchangeCard.js'; // or './module'
import ManageWalletCard from './components/manageWalletCard.js'; // or './module'

export class WalletsPage
{
	constructor(socket)
	{
		this.socket = socket;
		this.events = new Events();

		this.element = document.createElement("div");
		this.element.id = "WalletsPage";
		this.element.style.display = "none";

		let wallets = { title: "Wallets", width: 3 };
		let manage = { title: "Manage", width: 6 };
		let newWallet = { title: "NewWallet", width: 3 };

		this.table = table(wallets, manage, newWallet);

		this.wallets = this.table.querySelector("#Wallets");
		this.manage = this.table.querySelector("#Manage");
		this.newWallet = this.table.querySelector("#NewWallet");

		this.events.subscribe('walletSelected', (wallet) => 
		{
			this.onWalletSelected(wallet);
		});

		this.element.append(this.table);
	}

	async onWalletSelected(wallet)
	{
		if (wallet.address == null)
		{
			this.manage.innerHTML = '';
			let newWalletCard = new NewWalletCard();
			this.manage.append(newWalletCard.element);
			this.selectedWalletTitle = this.element.querySelector("#Manage-Header");

			this.newWalletButton = this.manage.querySelector("#addWalletButton");
			this.newWalletButton.onclick = () => 
			{
				let walletData = {};
				walletData.nickname = this.manage.querySelector("#nickname").value;
				walletData.address = this.manage.querySelector("#address").value;
				walletData.secret = this.manage.querySelector("#secret").value;

				this.socket.emit('addWallet', walletData);
			};
		}
		else
		{
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
		}

	}

	set OrderBook(orderBook)
	{
		if(this.exchangeCard != null && this.exchangeCard.OrderBook != null)
		{
			this.exchangeCard.OrderBook = orderBook;
		}
		
	}

	set Wallets(wallets)
	{
		//this.exchangeCard.Wallets = wallets;

		this.manage.innerHTML = '';
		this.selectedWalletTitle = this.element.querySelector("#Manage-Header");
		this.selectedWalletTitle.innerHTML = "";

		if (wallets != null)
		{
			let walletsPage = this;
			let events = this.events;

			walletsPage.wallets.innerHTML = "";

			for (var key in wallets) 
			{
				let wallet = wallets[key];
				let walletCard = new WalletCard(events, wallet);

				walletCard.events.subscribe('walletSelected', () => 
				{
					walletCard.card.deselect();
				});

				walletsPage.wallets.append(walletCard.element);
			}

			let newWalletCardData =
			{
				id: "newWalletCard",
				title: "Add New Wallet",
				subTitle: " ",
				body: "",
				events: events,
				onClick: (card) => 
				{
					card.events.publish('walletSelected', null);
					card.select();
				}
			};

			let newWalletCard = new Card(newWalletCardData);

			newWalletCard.events.subscribe('walletSelected', () => 
			{
				newWalletCard.deselect();
			});

			walletsPage.wallets.append(newWalletCard.element);
		}
	}

	set Assets(assets)
	{
		if (this.assetsCard != null)
		{
			this.assetsCard.displayAssets(assets);

			this.exchangeCard.Assets = assets;

			this.manageWalletCard.displayWalletOptions();
		}
	}
}