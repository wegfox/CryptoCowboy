'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class Grid
{
	constructor(title)
	{
		//	TODO: Two-way binding

		this.element = document.createElement("div");
		this.rows = [];
		this.rowIndex = 0;


			this.element.style.flexFlow = "row wrap";
			{
				let header = document.createElement("span");
				//header.style.flexFlow = "column";
				header.style.display = "flex";
				header.style.flexDirection = "row";
				this.element.append(header);
				
					this.titleElement = document.createElement("h6");
					//title.className = "card-title m-0";
					this.titleElement.innerHTML = title;
					this.titleElement.style.flex = 1;
					header.append(this.titleElement);

					/*
					let cp = document.createElement("h6");
					cp.innerHTML = asset.counterparty;
					cp.style.flex = 1;
					header.append(cp);

					let balance = document.createElement("h6");
					balance.innerHTML = asset.balance;
					balance.style.flex = 1;
					header.append(balance);
					*/
				

				//let separator = document.createElement("hr");
				//element.append(separator);
			}
	}

	push(element, weight)
	{
		if(typeof(element))

		this.element[this.rowIndex].append(element);
	}

	insertRow()
	{
		let row = document.createElement("div");

		row.style.flexFlow = "row wrap";

		this.element.append(row);
	}
}