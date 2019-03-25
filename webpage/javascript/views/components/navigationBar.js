'use strict';

export default class NavigationBar 
{
	constructor(router)
	{
		this.router = router;

		var element = document.createElement("nav");
		element.className = "navbar navbar-expand-md navbar-dark fixed-top bg-dark";

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

		this.title = document.createElement("div");
		this.title.id = "title";
		this.title.className = "navbar-brand btn btn-dark";
		this.title.innerHTML = "CryptoCowboy";
		dashboard.append(this.title);

		var button = document.createElement("button");
		button.className = "navbar-toggler";
		button.type = "button";
		button.dataToggle = "collapse";
		button.dataTarget = "#navbarCollapse";
		button.ariaControls = "navbarCollapse";
		button.ariaExpanded = "false";
		button.ariaLabel = "Toggle navigation";
		element.append(button);

		var buttonSpan = document.createElement("span");
		buttonSpan.className = "navbar-toggler-icon";
		button.append(buttonSpan);

		var buttons = document.createElement("div");
		buttons.className = "collapse navbar-collapse";
		buttons.id = "navbarCollapse";
		element.append(buttons);

		buttons.append(this.generateNavigationButtons('Wallets', 'Bots', 'Options', 'Support'));
		this.element = element;
	}

	set Version(version)
	{
		this.title.innerHTML = "CryptoCowboy " + version;
	}
	generateNavigationButtons(...buttons)
	{
		var navigationButtons = document.createElement("ul");
		navigationButtons.id = "navigationButtons";
		navigationButtons.className = "navbar-nav mr-auto";


		for (var i = 0; i < buttons.length; i++)
		{
			let title = buttons[i];

			let element = document.createElement("li"); //  <li class="nav-item">

			let button = document.createElement("button");
			button.id = title;
			button.innerHTML = title;
			button.classList.add("btn", "btn-dark");
			button.onclick = () =>
			{
				this.router.route(title);
			};

			element.append(button);

			navigationButtons.append(element);
		}
		return navigationButtons;
	}
}
