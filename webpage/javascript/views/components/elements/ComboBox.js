'use strict';

export default class ComboBox
{
	constructor(label)
	{
		this.element = document.createElement("select");

		this.label = label;

		this.options = [];

		this.bindElements = [];
		this.onUpdate = [];

		this.element.onchange = () => 
		{
			//console.log(this.Value, this.oldIndex, this.nextIndex, this.Index);
			this.oldIndex = this.nextIndex;
			this.nextIndex = this.Index;
			//console.log(this.Value, this.oldIndex, this.nextIndex, this.Index);
			this.update();
		};
	}
	setOptions(options)
	{
		this.options = options;
		this.createList();
	}

	createList()
	{
		this.index = this.element.selectedIndex;

		this.element.innerHTML = "";

		if(typeof(this.options) == 'object')
		{
			for (var property1 in this.options) 
			{
				let item = document.createElement("option");
				item.value = this.options[property1][this.label];
				item.innerHTML = this.options[property1][this.label];
				this.element.append(item);

			  }
		}
		else if (typeof(this.options) == 'array')
		{
			for (var i = 0; i < this.options.length; i++)
			{
				
				let item = document.createElement("option");
				item.value = this.options[i][this.label];
				item.innerHTML = this.options[i][this.label];
				this.element.append(item);
			}
		}


		if (this.index != -1 && this.options[this.index][this.label] != "")
		{
			this.value = this.options[this.index][this.label];
		}
		if (this.options != null && this.options.length > 0)
		{
			this.index = this.element.selectedIndex;
			this.value = this.options[this.index][this.label];
		}
		this.nextIndex = this.Index;
		this.oldIndex = this.Index;

		this.update();
		//alert(this.value);
	}

	update()
	{
		for (let i = 0; i < this.bindElements.length; i++)
		{
			this.bindElements[i].element[this.bindElements[i].property] = this.element.value;
		}

		for (let i = 0; i < this.onUpdate.length; i++)
		{
			this.onUpdate[i]();
		}
	}

	BindElement(element, propery)
	{
		this.bindElements.push({ "element": element, "property": propery });
	}

	OnUpdate(action)
	{
		this.onUpdate.push(action);
	}



	Next()
	{
		if (this.options.length > 1)
		{
			this.nextIndex = this.element.selectedIndex;
			this.oldIndex = this.element.selectedIndex;
			this.element.selectedIndex = (this.element.selectedIndex + 1);
			this.element.onchange();
		}
	}

	get Index()
	{
		return this.element.selectedIndex;
	}

	set Index(index)
	{
		this.nextIndex = index;
		this.oldIndex = this.element.selectedIndex;
		this.element.selectedIndex = index;
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
