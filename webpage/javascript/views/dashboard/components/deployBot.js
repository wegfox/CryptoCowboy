'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class DeployBot
{
	constructor(wallet)
	{
		this.deployBot =
			{
				id: "deployBot-" + wallet.address,
				title: "Assets",
				subTitle: "",
				body: " ",
				onClick: null
			};

		this.card = new Card(this.deployBot);
		this.card.left();

		this.element = (this.card).element;
	}

	displayAssets(assets)
	{
		let manageWalletCard = this;

		manageWalletCard.card.Body = "";

		if (assets == null)
		{
			return;
		}

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
}