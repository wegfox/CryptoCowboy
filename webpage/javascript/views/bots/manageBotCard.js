'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class ManageBotCard
{
	constructor(events, wallet)
	{
		this.events = events;

		let walletCardData =
		{
			id: "manageBotCard" + wallet.address,
			title: wallet.nickname,
			subTitle: wallet.address,
			body: "",

			onClick: (card) => 
			{
				//events.publish('walletSelected', wallet);
				//card.select();
			}
		};
		this.card = new Card(walletCardData);


		this.element = (this.card).element;
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