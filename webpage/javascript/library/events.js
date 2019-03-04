'use strict';

export default class Events
{
	constructor()
	{
		this.topics = {};
		this.hasOwnProperty = this.topics.hasOwnProperty;
	}

	subscribe(topic, listener)
	{
		// Create the topic's object if not yet created
		if (!this.hasOwnProperty.call(this.topics, topic))
		{
			this.topics[topic] = [];
		}

		// Add the listener to queue
		var index = this.topics[topic].push(listener) - 1;

		// Provide handle back for removal of topic

		return {
			remove: function ()
			{
				delete this.topics[topic][index];
			}
		};
	}

	publish(topic, info)
	{
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if (!this.hasOwnProperty.call(this.topics, topic))
		{
			return;
		}

		// Cycle through topics queue, fire!
		this.topics[topic].forEach((item) =>
		{
			let result = info;
			if (info == undefined)
			{
				result = {};
			}

			item(result);
		});
	}
}

/*
The hasOwnProperty() method returns a boolean indicating whether the object has the specified property as its own property (as opposed to inheriting it).

https://davidwalsh.name/pubsub-javascript

	Usage:

	var subscription = events.subscribe('url', function (url)
	{
		// Do something now that the event has occurred
	});

	events.publish('/page/load', {
	url: '/some/url/path' // any argument
	});

	subscription.remove();
*/