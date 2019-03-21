'use strict';

//import { table } from '../components/basic/table.js'; // or './module'
//import WalletCard from './components/walletCard.js'; // or './module'


/*
export default class Binding
{
	constructor(object, property, element, attribute)
	{
		this.object = object;
		this.property = property;
		this.element = element;
		this.attribute = attribute;

	}
}
*/

export default function Binding(object, property, element, attribute)
{
	this.element = element;
	this.value = object[property];
	this.attribute = attribute;
	this.valueGetter = function ()
	{
		return this.value;
	};
	this.valueSetter = function (val)
	{
		this.value = val;
		this.element[this.attribute] = val;
	};

	Object.defineProperty(object, property, {
		get: this.valueGetter,
		set: this.valueSetter
	});
	object[property] = this.value;

	this.element[this.attribute] = this.value;

}


/*


		var obj = { a: 123 };
		new Binding(obj, "a", this.purchase, "innerHTML");
		obj.a = 457;

export default class Binding
{
	constructor(object, property, element, attribute)
	{
		//get this()

		alert(JSON.stringify(this));
		this.this = this;
		this.element = element;
		this.value = object[property];
		this.attribute = attribute;
		this.valueGetter = function ()
		{
			return this.this.value;
		};
		this.valueSetter = function (val)
		{
			console.log("Setting'", val, "'");
			alert(this);
			this.value = val;
			this.element[this.attribute] = val;
		};
		Object.defineProperty(object, property, {
			get: this.valueGetter,
			set: this.valueSetter
		});

		object[property] = this.value;

		this.element[this.attribute] = this.value;

	}
}
*/
/*
export default class Binding
{

	constructor(value)
	{
		this.value = value;
		this.n = 5;
		this.listeners = [];

		console.log(this.getN()); // 5
		this.setN(10);
		console.log(this.getN()); // 10

		this.accessor.subscribe = (listener) =>
		{
			this.listeners.push(listener);
		};
	}

	notify(newValue)
	{
		this.listeners.forEach(function (listener) { listener(newValue); });
	}

	accessor(newValue)
	{
		if (arguments.length && newValue !== this.value)
		{
			this.value = newValue;
			this.notify(newValue);
		}
		return this.value;
	}


}

*/

/*
export default class Binding
{
	constructor(b, property)
	{
		this.b = b;
		this.property = property;

		this.elementBindings = [];
		this.value = this.b[this.property];
		this.b[this.property] = this.value;

		alert(JSON.stringify(b));
		alert(property);
		alert(this.b[this.property]);
	}

	get valueGetter()
	{
		return this.value;
	}

	set valueSetter(val)
	{
		this.value = val;
		for (var i = 0; i < this.elementBindings.length; i++)
		{
			var binding = this.elementBindings[i];
			binding.element[binding.attribute] = val;
		}
	}

	addBinding(element, attribute, event)
	{
		var binding = {
			element: element,
			attribute: attribute
		};
		if (event)
		{
			element.addEventListener(event, function (event)
			{
				this.valueSetter(element[attribute]);
			});
			binding.event = event;
		}
		this.elementBindings.push(binding);
		element[attribute] = this.value;
		return this;
	}
	/*
		Object.defineProperty(b.object, b.property, {
			get: this.valueGetter,
			set: this.valueSetter
		});
	*/

//}
