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
import { TableColumn } from "./table_column";

class TableColumnsConnector {
	// This class servers as a way to connect one column with multiple others
	// This class should give the ability to return the needed column widths
	spanning_column: TableColumn;
	spanned_columns: Array<TableColumn>;

	constructor(spanning_column: TableColumn) {
		this.spanning_column = spanning_column;
		this.spanned_columns = [];
	}

	// add a spanned column
	add_spanned_column(column: TableColumn) {
		this.spanned_columns.push(column);
	}

	get spanned_columns_widths(): Array<number> {
		return this.spanned_columns.map((column) => column.get_minimum_width());
	}

	get spanned_columns_combined_width(): number {
		// calculate the combined width of the spanned columns
		let spanned_columns_width = -1;
		for (const column of this.spanned_columns) {
			spanned_columns_width += column.get_minimum_width();
			spanned_columns_width++;
		}
		return spanned_columns_width;
	}

	// calculate the needed column widths
	calculate_widths(): {
		spanning_column_width: number;
		spanned_columns_widths: Array<number>;
	} {
		const combined_width = this.spanned_columns_combined_width;
		const spanning_width = this.spanning_column.get_minimum_width();
		// compare the width of the spanning column with the combined width of the spanned columns
		if (combined_width === spanning_width) {
			return {
				spanning_column_width: this.spanning_column.get_minimum_width(),
				spanned_columns_widths: this.spanned_columns_widths,
			};
		}

		// case the combined is larger than the spanning column
		if (combined_width > spanning_width) {
			return {
				spanning_column_width: combined_width,
				spanned_columns_widths: this.spanned_columns_widths,
			};
		}

		// case the combined is smaller than the spanning column
		if (combined_width < spanning_width) {
			// calculate the needed column widths
			const needed_column_widths: Array<number> = this.spanned_columns_widths;
			// calculate the needed added width
			const difference = spanning_width - combined_width;
			// add the needed width to the last column
			needed_column_widths[needed_column_widths.length - 1] += difference;
			return {
				spanning_column_width: this.spanning_column.get_minimum_width(),
				spanned_columns_widths: needed_column_widths,
			};
		}

		throw new Error("Error in Programm, This should never be reached");
	}
}

export class ComplexTable {
	// The Complex Table consists of multiple tables which don't have the same number of columns
	_tables: Array<Table>;

	constructor() {
		this._tables = [];
	}

	get last_table(): Table {
		return this._tables[this._tables.length - 1];
	}

	add_row_raw(row: string) {
		this.add_row(new TableRow(row));
	}

	add_row(row: TableRow) {
		// check if the _tables is empty
		if (this._tables.length === 0) {
			this._tables.push(new Table(row));
			return;
		}

		// try adding the row to the last table
		try {
			this.last_table.add_row(row);
		} catch (error) {
			// if the row cannot be added to the last table, create a new table
			this._tables.push(new Table(row));
			return;
		}
	}

	get_formatted_table(): Array<string> {
		const formatted_tables: Array<string> = [];
		return formatted_tables;
	}
}

export class Table {
	// This class only stores rows and columns that all have the same number of cells
	// The Table class stores a whole table with all the rows and cells
	_rows: Array<TableRow>;
	_columns: Array<TableColumn>;

	constructor(initial_row: TableRow) {
		this._rows = [initial_row];
		// create the number of columns of the table
		this._columns = [];
		for (let i = 0; i < initial_row.number_of_cells; i++) {
			this._columns.push(new TableColumn());
			// add the individual cells to the columns
			this._columns[i].add_cell(initial_row.get_cell(i));
		}
	}

	get number_of_columns(): number {
		return this._columns.length;
	}

	add_row(row: TableRow) {
		// check if the row has the correct number of cells
		if (row.number_of_cells !== this.number_of_columns) {
			throw new Error("The row does not have the same number of cells as the table.");
		}
		// add the row to the table
		this._rows.push(row);
		// add the individual cells to the columns
		for (let i = 0; i < row.number_of_cells; i++) {
			this._columns[i].add_cell(row.get_cell(i));
		}
	}

	get_min_column_widths(): Array<number> {
		// check if the table is empty
		if (this._rows.length === 0) {
			return [];
		}
		const column_widths = [];
		// search min width of each column
		for (const column of this._columns) {
			column_widths.push(column.get_minimum_width());
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

		// get the formatted rows
		for (const row of this._rows) {
			formatted_rows.push(row.get_formatted_row(this.get_min_column_widths()));
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
