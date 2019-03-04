'use strict';

export function table(...columns)
{
	let row = document.createElement("div");
	row.classList.add("row");

	let counter = 0;
	for (var i = 0; i < columns.length; i++)
	{
		let column = document.createElement("div");
		column.classList.add(`col-md-${columns[i].width}`, "bg-light");

		let header = document.createElement("h5");
		header.id = columns[i].title + "-Header";
		header.innerHTML = columns[i].title;

		let spacer = document.createElement("hr");

		let body = document.createElement("div");
		body.id = columns[i].title;

		column.append(header, spacer, body);
		row.append(column);

		counter += columns[i].width;
	}
	if (counter > 12)
	{
		//	TODO: Error here
	}

	return row;
}