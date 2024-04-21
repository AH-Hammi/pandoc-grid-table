/**
 * This file contains the function to format the table
 *
 * @author Alexander Hammans
 * @version 0.0.1
 * @license GNU-GPL-3.0
 */

import type * as vscode from "vscode";

enum TableSeparator {
	TABLE_EDGE = "|",
	TABLE_CORNER = "+",
}

function is_row_separator(line_text: string): boolean {
	// check if the first char is a valid char
	if (
		line_text.charAt(0) !== ":" &&
		line_text.charAt(0) !== "=" &&
		line_text.charAt(0) !== "-"
	) {
		// if not, the line is not a row separator
		return false;
	}

	// check if the last char is a valid char
	if (
		line_text.charAt(line_text.length - 1) !== ":" &&
		line_text.charAt(line_text.length - 1) !== "=" &&
		line_text.charAt(line_text.length - 1) !== "-"
	) {
		// if not, the line is not a row separator
		return false;
	}
	// save first and last char
	const first_char = line_text.charAt(0);
	const last_char = line_text.charAt(line_text.length - 1);

	// check if we have only "-" or "="
	const second_char = line_text.charAt(1);
	for (let i = 2; i < line_text.length - 2; i++) {
		// compare the char to the second char
		if (line_text.charAt(i) !== second_char) {
			// if not, the line is not a row separator
			return false;
		}
	}

	// All conditions are met
	return true;
}

export class TableCell {
	// Every cell is surrounded by either a "+" or "|"
	// The surrounding characters determine how the inner text is formatted

	// A cell is build up from a string
	_cell: string;
	front_separator: TableSeparator;
	back_separator: TableSeparator;

	constructor(raw_cell: string) {
		this._cell = "";
		this.front_separator = TableSeparator.TABLE_EDGE;
		this.back_separator = TableSeparator.TABLE_EDGE;
	}

	set cell(raw_cell: string) {
		// The first and last character determine what separator is used
		this.front_separator = raw_cell.charAt(0) as TableSeparator;
		this.back_separator = raw_cell.charAt(
			raw_cell.length - 1,
		) as TableSeparator;
		// The rest of the cell is the inner text
		this._cell = raw_cell.substring(1, raw_cell.length - 1);
	}

	get_formatted_cell(length: number, add_back_separator: boolean): string {
		// this returns the formatted cell with the given length
		// it returns a string with the length of the cell
		// the Length is only the length of the inner text
		// if any of the separator is TableSeparator.TABLE_EDGE
		let formatted: string = this.front_separator;

		// check if both separator are TableSeparator.TABLE_CORNER
		if (
			this.front_separator === TableSeparator.TABLE_CORNER &&
			this.back_separator === TableSeparator.TABLE_CORNER &&
			is_row_separator(this._cell)
		) {
			const last_char = this._cell.charAt(this._cell.length - 1);
			// check if we need to shorten or extend the cell
			if (this._cell.length < length) {
				formatted += this._cell.substring(0, length - 1);
				formatted += this._cell
					.charAt(1)
					.repeat(length - this._cell.length - 1);
			} else {
				formatted += this._cell.substring(0, length - 1);
			}
			// add the last char back
			formatted += last_char;
		} else {
			if (this._cell.length < length) {
				formatted += this._cell;
				formatted += " ".repeat(length - this._cell.length);
			} else {
				formatted += this._cell.substring(0, length);
			}
		}

		if (add_back_separator) {
			formatted += this.back_separator;
		}

		return formatted;
	}
}

class TableRow {
	// Every row contains a list of cells
	_cells: Array<TableCell>;

	constructor(raw_row: string) {
		// Deconstruct the row into its cells
		// go through the row and split it into cells
		// The split happens at either a table edge or a table corner
		this._cells = [];
		let current_cell_str = raw_row.charAt(0);
		for (let i = 1; i < raw_row.length; i++) {
			// get the current char
			const char = raw_row.charAt(i);
			// add the char to the current cell
			current_cell_str += char;
			// check if the char is a table edge or a table corner
			if (char === "|" || char === "+") {
				// create a new cell with the current cell string
				this._cells.push(new TableCell(current_cell_str));
				// reset the current cell string
				current_cell_str = char;
			}
		}
	}

	get number_of_cells(): number {
		return this._cells.length;
	}

	get_length_of_cell(index: number): number {
		return this._cells[index].cell.length;
	}

	get_cell(index: number): string {
		return this._cells[index].cell;
	}
}

// class Table {
// 	// The Table class stores a whole table with all the rows and cells
// }

export function format_table(
	editor: vscode.TextEditor,
	doc: vscode.TextDocument,
	cur_selection: vscode.Selection,
	table_range: vscode.Range,
	text_change: string,
) {
	throw new Error("Method not implemented.");
	// const table = new Table(doc, table_range);
	// table.format_table(text_change);
}
