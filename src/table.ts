/**
 * This file contains the function to format the table
 *
 * @author Alexander Hammans
 * @version 0.0.1
 * @license GNU-GPL-3.0
 */

import type * as vscode from "vscode";

import { TableCell } from "./table_cell";
import { TableRow } from "./table_row";

export class Table {
	// The Table class stores a whole table with all the rows and cells
	_rows: Array<TableRow>;

	constructor() {
		this._rows = [];
	}

	add_row_raw(raw_row: string) {
		this._rows.push(new TableRow(raw_row));
	}

	add_row(row: TableRow) {
		this._rows.push(row);
	}

	has_concatenated_columns(): boolean {
		for (const row of this._rows) {
			if (row.number_of_cells !== this._rows[0].number_of_cells) {
				return true;
			}
		}
		return false;
	}

	get_min_column_width(index: number): number {
		// check if the table is empty
		if (this._rows.length === 0) {
			return 0;
		}
		// get the column width
		let column_width = 0;
		for (const row of this._rows) {
			column_width = Math.max(column_width, row.get_cell(index).minimum_cell_length);
		}
		return column_width;
	}

	get_min_column_widths(): Array<number> {
		// check if the table is empty
		if (this._rows.length === 0) {
			return [];
		}
		const column_widths = [];
		// search min width of each column
		for (let i = 0; i < this._rows[0].number_of_cells; i++) {
			column_widths.push(this.get_min_column_width(i));
		}
		return column_widths;
	}

	/// This function return the width of the table excluding the table edge left and right
	get_min_width(): number {
		// check if the table is empty
		if (this._rows.length === 0) {
			return 0;
		}
		let min_width = -1;
		// sum up the min width of each column
		for (const column_width of this.get_min_column_widths()) {
			min_width += column_width;
			min_width++;
		}
		return min_width;
	}

	/**
	 *
	 * @param cursor The cursor position in the table
	 * @returns An array of formatted rows
	 */
	format_table(): Array<string> {
		// check if there the table is empty
		if (this._rows.length === 0) {
			return [];
		}

		// check if we have any concatenated rows
		const formatted_rows: Array<string> = [];

		if (this.has_concatenated_columns()) {
			// throw new Error("The table has concatenated columns.");
			// split the table up at the point where there are concatenated columns
			const list_of_tables: Array<Table> = [];
			list_of_tables.push(new Table());
			list_of_tables[0].add_row(this._rows[0]);
			// get the width of the first row of the table and save it
			for (let current_index = 1; current_index < this._rows.length; current_index++) {
				if (
					this._rows[current_index].number_of_cells !==
					list_of_tables[list_of_tables.length - 1]._rows[0].number_of_cells
				) {
					list_of_tables.push(new Table());
				}
				list_of_tables[list_of_tables.length - 1].add_row(this._rows[current_index]);
			}

			// get separator positions for each tables first row
			const list_of_separator_positions: Array<Array<number>> = [];
			for (const table of list_of_tables) {
				list_of_separator_positions.push(table._rows[0].get_list_of_separator_positions());
			}

			// check matching separator positions from front
			const matching_separator_positions_front = [];
			// search the number of the first separator positions in the second table
			// for (let i = 0; i < list_of_separator_positions.length - 1; i++) {
			// 	// go through the list of separator positions
			// 	for (let j = 0; j < list_of_separator_positions[i].length; j++) {
			// 		// check if we find a matching separator position
			// 		for (let k = 0; k < list_of_separator_positions[i + 1].length; k++) {
			// 			if (
			// 				list_of_separator_positions[i][j] ===
			// 				list_of_separator_positions[i + 1][k]
			// 			) {
			// 				matching_separator_positions_front.push(j);
			// 				break;
			// 			}
			// 		}
			// 	}
			// }
			for (let i = 0; i < list_of_separator_positions[0].length - 1; i++) {
				for (let j = 0; j < list_of_separator_positions[1].length; j++) {
					if (list_of_separator_positions[0][i] === list_of_separator_positions[1][j]) {
						matching_separator_positions_front.push(i);
						break;
					}
				}
			}
			console.log(matching_separator_positions_front);

			// calculate the inverted separator positions
			// subtract every position from the last in each list
			for (let i = 0; i < list_of_separator_positions.length; i++) {
				for (let j = 0; j < list_of_separator_positions[i].length; j++) {
					list_of_separator_positions[i][j] =
						list_of_separator_positions[i][list_of_separator_positions[i].length - 1] -
						list_of_separator_positions[i][j];
				}
			}
		} else {
			// get the formatted rows
			for (const row of this._rows) {
				formatted_rows.push(row.get_formatted_row(this.get_min_column_widths()));
			}
		}
		return formatted_rows;
	}
}

// export function format_table(
// 	editor: vscode.TextEditor,
// 	doc: vscode.TextDocument,
// 	table_range: vscode.Range,
// ) {
// 	throw new Error("Method not implemented.");
// 	// replace the table with the formatted table
// }
