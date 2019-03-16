'use strict';


export default class ComboBox extends HTMLElement
{
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() { return ['add']; }

	constructor()
	{
		// Always call super first in constructor
		super();


		//adoptedCallback: Invoked each time the custom element is moved to a new document.

		// Create a shadow root
		var shadow = this.attachShadow({ mode: 'open' });

		var comboBox = document.createElement("select");

		var style = document.createElement('style');
		/*
		style.
		
										style.textContent = '.wrapper {' +
										// CSS truncated for brevity
										*/

		shadow.appendChild(style);
		shadow.appendChild(comboBox);
	}

	connectedCallback()
	{
		updateStyle(this);
		console.log('Custom square element added to page.');
		this.innerHTML += "connected";
	}

	disconnectedCallback()
	{
		updateStyle(this);
	}
	attributeChangedCallback(attrName, oldVal, newVal)
	{
		updateStyle(this);
		console.log('Custom square element added to page.');
		this.innerHTML += attrName + oldVal + newVal;
	}

	get value()
	{
		return this.values[this.element.selectedIndex];
	}

	get text()
	{
		return this.values[this.element.selectedIndex][this.label];
	}
}
function updateStyle(elem)
{
	alert("H");
}

customElements.define('combo-box', ComboBox, { extends: 'select' });