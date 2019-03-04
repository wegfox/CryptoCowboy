'use strict';

export default class Router
{
	constructor(app)
	{
		this.app = app;
		//this.defaultView = app.views[0];

		for (var view in app.views) 
		{
			app.MainView.append(app.views[view].element);
		}

		let router = this;
		window.onpopstate = function (event)
		{
			router.updateViews(event.state.url);
		};
	}
	route(url)
	{
		var state =
		{
			url: url
		};

		if (url == null)
		{
			url = window.location.pathname.substr(1);
			state.url = window.location.pathname.substr(1);

			if (url == "")
			{
				url = "Dashboard";
				state.url = "Dashboard";
			}
		}

		history.pushState(state, "url", url);
		this.updateViews(url);
	}

	updateViews(url)
	{
		for (var view in this.app.views) 
		{
			if (view == url)
			{
				this.app.views[view].element.style.display = "block";
			}
			else
			{
				this.app.views[view].element.style.display = "none";
			}
		}
	}
}
