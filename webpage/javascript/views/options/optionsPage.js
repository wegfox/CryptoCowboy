'use strict';

import { table } from '../components/basic/table.js'; // or './module'

export class OptionsPage
{
	constructor(socket)
	{
		this.socket = socket;

		this.element = document.createElement("div");
		this.element.id = "OptionsPage";
		this.element.style.display = "none";

		let wallets = { title: "Options1", width: 3 };
		let manage = { title: "Options2", width: 6 };
		let newWallet = { title: "Options3", width: 3 };

		this.table = table(wallets, manage, newWallet);

		this.wallets = this.table.querySelector("#Wallets");
		this.manage = this.table.querySelector("#Options2");
		this.newWallet = this.table.querySelector("#NewWallet");


		this.task = document.createElement("input");
		this.target = document.createElement("input");
		this.send = document.createElement("button");
		this.send.innerHTML = "Send";
		this.send.onclick = () => 
		{
			let command = {};
			command.task = this.task.value;
			command.target = this.target.value;
			this.socket.emit("command", command);
		};

		this.manage.append(this.task);
		this.manage.append(this.target);
		this.manage.append(this.send);




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