'use strict';

export default class ComboBox
{
	constructor(label)
	{
		this.element = document.createElement("select");
		this.label = label;
		this.options = [];
		this.text = this.Text;
	}
	setOptions(options)
	{
		this.options = options;
		this.createList();
		//for (var i = 0; i < this.options.length; i++)
		//{
		//	this.values.push(item);
		//}
	}
	createList()
	{
		this.index = this.element.selectedIndex;

		this.element.innerHTML = "";

		for (var i = 0; i < this.options.length; i++)
		{
			let item = document.createElement("option");
			item.value = this.options[i][this.label];
			item.innerHTML = this.options[i][this.label];
			this.element.append(item);
		}

		if (this.index != -1 && this.options[this.index][this.label] != "")
		{
			this.value = this.options[this.index][this.label];
		}
		else if (this.options.length > 0)
		{
			this.index = this.element.selectedIndex;
			this.value = this.options[this.index][this.label];
		}
	}

	get Index()
	{
		return this.element.selectedIndex;
	}

	get Value()
	{
		return this.options[this.element.selectedIndex];
	}

	get Text()
	{
		return this.value;
	}

	set Text(text)
	{
		for (var i = 0; i < this.options.length; i++)
		{
			if (this.options[i][this.label] == text)
			{
				this.value = text;
				this.element.selectedIndex = i;
			}
		}
	}
}
