'use strict';

//import Element from '../element.js'; // or './module'
export default class Card
{
	constructor(cardData)
	{
		this.events = cardData.events;
		//	TODO: Two-way binding
		this.element = document.createElement("div");
		this.element.id = cardData.id;
		this.element.className = "card text-center mb-3 border border-dark";

		this.header = document.createElement("div");
		this.header.className = "card-header";
		this.element.append(this.header);

		this.title = document.createElement("h6");
		this.title.className = "card-title m-0";
		this.title.innerHTML = cardData.title;
		this.header.append(this.title);

		this.subTitle = document.createElement("p");
		this.subTitle.className = "card-text";
		this.subTitle.innerHTML = cardData.subTitle;
		this.header.append(this.subTitle);

		this.body = document.createElement("div");
		this.body.className = "card-body";

		this.address = document.createElement("p");
		this.address.className = "card-text";
		this.address.innerHTML = cardData.body;

		if (cardData.body != null && cardData.body != "")
		{
			this.element.append(this.body);
			this.body.append(this.address);
		}

		if (cardData.onClick != null)
		{
			this.element.style.cursor = "pointer";
			this.element.onclick = () => 
			{
				cardData.onClick(this);
			};
		}
	}

	left()
	{
		this.element.classList.remove("text-center");
	}

	set Body(body)
	{
		this.body.innerHTML = (body);
	}

	appendBody(body)
	{
		this.body.append(body);
	}

	append(body)
	{
		this.body.append(body);
	}

	show()
	{
		this.element.style.display = "block";
	}

	select()
	{
		this.element.classList.add("text-white", "bg-primary");
	}

	deselect()
	{
		this.element.classList.remove("text-white", "bg-primary");
	}
	hide()
	{
		this.element.style.display = "none";
	}


}