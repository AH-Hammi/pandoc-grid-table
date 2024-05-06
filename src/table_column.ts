/**
 * A class definition to store a column of a table
 */

import type { TableCell } from "./table_cell";

export class TableColumn {
	// List of reference to the table cells
	private _cells: Array<TableCell>;
	private _minimum_width: number;

	constructor() {
		this._cells = [];
		this._minimum_width = 0;
	}
	add_cell(cell: TableCell) {
		this._cells.push(cell);
	}
	// get minimum cell length
	get_minimum_width(): number {
		// go through the cells and search for the highest cell length
		let max_cell_length = 0;
		for (const cell of this._cells) {
			max_cell_length = Math.max(max_cell_length, cell.minimum_cell_length);
		}
		// check if the maximum length is more than the minimum length given through the property
		if (max_cell_length < this._minimum_width) {
			max_cell_length = this._minimum_width;
		} else {
			this._minimum_width = max_cell_length;
		}
		return max_cell_length;
	}

	set_minimum_width(width: number) {
		this._minimum_width = width;
	}
}
