
export default class ElementMutator
{
	constructor(element)
	{
		this.element = element;
	}

	show()
	{
		this.element.style.display = "block";
	}
	hide()
	{
		this.element.style.display = "none";
	}

	appendText(text, element)
	{
		let newText = document.createElement("div");
		newText.innerHTML = text;
		newText.style.flex = 1;

		if(element == null)
		{
			this.element.append(newText);
		}
		else
		{
			element.append(newText);
		}
	}
}