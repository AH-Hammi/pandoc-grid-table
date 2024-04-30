/**
 * A class definition to store a column of a table
 */

import type { TableCell } from "./table_cell";

export class TableColumn {
	// List of reference to the table cells
	_cells: Array<TableCell>;
	constructor() {
		this._cells = [];
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
		return max_cell_length;
	}
}
