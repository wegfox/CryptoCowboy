'use strict';

export function log(logData)
{
	let color = "black";
	switch (logData.level) 
	{
	case 'error':
		color = "red";
		break;
	case 'info':
		color = "black";
		break;
	case 'success':
		color = "green";
		break;
	case 'verbose':
		color = "blue";
		break;
	case 'debug':
		color = "CornflowerBlue";
		break;
	case 'history':
		color = "LightGray";
		break;
	default:
		color = "black";
		break;
	}

	let parent = document.getElementById("logs");
	let element = document.createElement("li");
	let strong = document.createElement("b");
	let font = document.createElement("font");
	font.style.color = color;

	let span = document.createElement("span");
	//
	span.innerHTML = logData.message;

	font.append(span);
	strong.append(font);
	element.append(strong);
	parent.append(element);
}

/*
scroll: () =>
{
	var container = this.$el.querySelector("#messages");
	container.scrollTop = container.scrollHeight;
}}
*/