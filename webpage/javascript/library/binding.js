'use strict';

//import { table } from '../components/basic/table.js'; // or './module'
//import WalletCard from './components/walletCard.js'; // or './module'


export default class Binding
{
	constructor(object, property, element, attribute)
	{
		//get this()




		/*
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
				*/
	}
}
