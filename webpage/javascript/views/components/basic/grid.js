'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class Grid
{
	constructor(events, wallet)
	{
		//	TODO: Two-way binding

		let walletCard =
		{
			id: "walletCard" + wallet.address,
			title: wallet.nickname,
			subTitle: "Address: " + wallet.address,
			body: "",
			onClick: (card) => 
			{
				card.select();
				//events.publish('walletSelected', wallet);
			}
		};

		this.element = (new Card(walletCard)).element;
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