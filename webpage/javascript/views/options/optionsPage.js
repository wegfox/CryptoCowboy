'use strict';

import { table } from '../components/basic/table.js'; // or './module'

export class OptionsPage
{
	constructor()
	{
		this.element = document.createElement("div");
		this.element.id = "OptionsPage";
		this.element.style.display = "none";

		let wallets = { title: "Options1", width: 3 };
		let manage = { title: "Options2", width: 6 };
		let newWallet = { title: "Options3", width: 3 };

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