'use strict';

export default class Data
{
	constructor(data)
	{
		//	TODO: Two-way binding
		this.element = document.createElement("div");
		this.element.id = card.id;
		this.element.className = "card text-center mb-3 border border-dark";

		this.header = document.createElement("div");
		this.header.className = "card-header";

		this.title = document.createElement("h6");
		this.title.className = "card-title m-0";
		this.title.innerHTML = card.title;

		this.subTitle = document.createElement("p");
		this.subTitle.className = "card-text";
		this.subTitle.innerHTML = card.subTitle;

		this.body = document.createElement("div");
		this.body.className = "card-body";

		this.address = document.createElement("p");
		this.address.className = "card-text";
		this.address.innerHTML = card.body;

		this.element.append(this.header);
		this.header.append(this.title);
		this.header.append(this.subTitle);

		if (card.body != "")
		{
			this.element.append(this.body);
			this.body.append(this.address);
		}

		if (card.onClick != null)
		{
			this.element.style.cursor = "pointer";
			this.element.onclick = () => 
			{
				card.onClick(this);
			};
		}
	}

	set Body(body)
	{
		this.body.innerHTML = (body);
	}

	appendBody(body)
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