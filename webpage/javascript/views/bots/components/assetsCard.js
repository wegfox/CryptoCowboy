'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class AssetsCard
{
	constructor(socket, wallet)
	{
		this.socket = socket;
		this.wallet = wallet;
		this.manageWalletCard =
			{
				id: "assetsCard-" + wallet.address,
				title: "Assets",
				subTitle: "",
				body: " ",
				onClick: null
			};

		this.card = new Card(this.manageWalletCard);

		this.element = (this.card).element;
	}

	displayAssets(assets)
	{
		let manageWalletCard = this;

		if (assets == null)
		{
			return;
		}

		manageWalletCard.card.Body = "";

		assets.forEach(function (asset)
		{
			if (asset.counterparty == null)
			{
				asset.counterparty = "";
			}

			let element = document.createElement("div");
			element.id = asset.currencyCode + "-" + asset.counterparty;
			element.style.flexFlow = "row wrap";
			{
				let header = document.createElement("span");
				//header.style.flexFlow = "column";
				header.style.display = "flex";
				header.style.flexDirection = "row";
				element.append(header);
				{
					let title = document.createElement("h6");
					//title.className = "card-title m-0";
					title.innerHTML = asset.currencyCode;
					title.style.flex = 1;
					header.append(title);

					let cp = document.createElement("h6");
					cp.innerHTML = asset.counterparty;
					cp.style.flex = 1;
					header.append(cp);

					let balance = document.createElement("h6");
					balance.innerHTML = asset.balance;
					balance.style.flex = 1;
					header.append(balance);
				}

				let separator = document.createElement("hr");
				element.append(separator);
			}

			manageWalletCard.card.appendBody(element);
		});
	}


	displayWalletOptions()
	{
		let root = this.card;
		let wallet = this.wallet;
		{
			let exchange = document.createElement("div");
			root.appendBody(exchange);

			let exchangeTitle = document.createElement("h5");
			exchangeTitle.innerHTML = "Exchange";
			exchange.append(exchangeTitle);

			let deleteButton = document.createElement("button");
			deleteButton.id = "delete-" + this.wallet;
			deleteButton.type = "button";
			deleteButton.className = "btn btn-danger";
			deleteButton.innerHTML = "Delete Wallet";
			deleteButton.onclick = () => 
			{
				this.socket.emit('deleteWallet', wallet.address);
			};

			root.appendBody(document.createElement("hr"));

			root.appendBody(deleteButton);
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
}