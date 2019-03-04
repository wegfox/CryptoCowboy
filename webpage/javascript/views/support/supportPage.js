'use strict';

import { table } from '../components/basic/table.js'; // or './module'

export class SupportPage
{
	constructor()
	{
		this.element = document.createElement("div");
		this.element.id = "SupportPage";
		this.element.style.display = "none";

		let wallets = { title: "Support1", width: 3 };
		let manage = { title: "Support2", width: 6 };
		let newWallet = { title: "Support3", width: 3 };

		this.table = table(wallets, manage, newWallet);

		this.wallets = this.table.querySelector("#Wallets");
		this.manage = this.table.querySelector("#Manage");
		this.newWallet = this.table.querySelector("#NewWallet");

		this.element.append(this.table);
	}

	show()
	{
		this.element.style.display = "block";
	}
	hide()
	{
		this.element.style.display = "none";
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