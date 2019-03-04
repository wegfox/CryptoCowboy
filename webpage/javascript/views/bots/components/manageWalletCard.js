'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class ManageWalletCard
{
	constructor(socket, wallet)
	{
		this.socket = socket;
		this.wallet = wallet;
		this.manageWalletCard =
			{
				id: "manageWalletCard-" + wallet.address,
				title: "Manage",
				subTitle: "",
				body: " ",
				onClick: null
			};

		this.card = new Card(this.manageWalletCard);

		this.element = (this.card).element;
	}

	displayWalletOptions()
	{
		this.card.Body = "";

		let root = this.card;
		let wallet = this.wallet;
		{
			let deleteButton = document.createElement("button");
			deleteButton.id = "delete-" + this.wallet;
			deleteButton.type = "button";
			deleteButton.className = "btn btn-danger";
			deleteButton.innerHTML = "Delete Wallet";
			deleteButton.onclick = () => 
			{
				this.socket.emit('deleteWallet', wallet.address);
			};

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