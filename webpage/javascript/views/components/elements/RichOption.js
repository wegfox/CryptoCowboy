'use strict';

export default class RichOption
{
	constructor(label)
	{
		this.element = document.createElement("option");

		this.label = label;

		this.value = null;
	}

	set Value(value)
	{
		this.value = value;

		this.element.text = this.Value;
		this.element.innerHTML = this.Value;
	}

	get Value()
	{
		return this.value;
	}

	get Text()
	{
		return this.value[this.label];
	}

}