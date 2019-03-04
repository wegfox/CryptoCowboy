'use strict';
//	Is this a dumb idea? maybe.
export default class Element
{
	constructor(root, attributes, children)
	{
		this.root = document.createElement(root);

		if (attributes != null)
		{
			Object.keys(attributes).forEach(key =>
			{
				let value = attributes[key].element;
				this.root[key] = value;
			});
		}

		if (children != null)
		{
			Object.keys(children).forEach(key =>
			{
				let value = children[key].element;
				this.element.append(value);
			});
		}
	}

	get element()
	{
		return this.root;
	}

	show()
	{
		this.root.style.display = "block";
	}
	hide()
	{
		this.root.style.display = "none";
	}
}

/*
		var dashboard = document.createElement("div");
		dashboard.id = "navigationHome";
		dashboard.onclick = () =>
		{
			this.router.route("Dashboard");
		};
		element.append(dashboard);

		var logo = document.createElement("img");
		logo.src = "files/CryptoCowboyRobot.png";
		logo.alt = "CryptoCowboy";
		logo.style = "height:4em;";
		logo.className = "btn btn-dark";
		dashboard.append(logo);

		var title = document.createElement("div");
		title.id = "title";
		title.className = "navbar-brand btn btn-dark";
		title.innerHTML = "CryptoCowboy";
		dashboard.append(title);

		var button = document.createElement("button");
		button.className = "navbar-toggler";
		button.type = "button";
		button.dataToggle = "collapse";
		button.dataTarget = "#navbarCollapse";
		button.ariaControls = "navbarCollapse";
		button.ariaExpanded = "false";
		button.ariaLabel = "Toggle navigation";
		element.append(button);
		*/