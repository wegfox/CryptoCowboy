'use strict';

import Card from '../../components/basic/card.js'; // or './module'

export default class BotCard
{
	constructor(events, bot)
	{
		//	TODO: Two-way binding
		//alert(JSON.stringify(wallet));
		this.events = events;
		//alert(JSON.stringify(bot));
		let botCardData =
		{
			id: "botCard" + bot.id,
			title: bot.id,
			subTitle: bot.wallet.address,
			body: "",

			onClick: (card) => 
			{
				events.publish('botSelected', bot);
				card.select();
			}
		};
		this.card = new Card(botCardData);


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