/**
 * This file contains the function to format the table
 *
 * @author Alexander Hammans
 * @version 0.0.1
 * @license GNU-GPL-3.0
 */

import type * as vscode from "vscode";

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
		// test if the column is undefined
		// if (column === undefined) {
		// 	throw new Error("Column is undefined");
		// }
		this.spanned_columns.push(column);
		// remove any undefined items in the list
		// this.spanned_columns = this.spanned_columns.filter((column) => column !== undefined);
	}

	get last_spanned_column(): TableColumn {
		return this.spanned_columns[this.spanned_columns.length - 1];
	}

	get spanned_columns_widths(): Array<number> {
		return this.spanned_columns.map((column) => column.get_minimum_width());
	}

	get_spanned_columns_combined_width(): number {
		// calculate the combined width of the spanned columns
		let spanned_columns_width = -1;
		for (const column of this.spanned_columns) {
			spanned_columns_width += column.get_minimum_width();
			spanned_columns_width++;
		}
		return spanned_columns_width;
	}

	// calculate the needed column widths
	// The calculated will be saved in the columns
	calculate_widths() {
		const combined_width = this.get_spanned_columns_combined_width();
		const spanning_width = this.spanning_column.get_minimum_width();
		// compare the width of the spanning column with the combined width of the spanned columns
		if (combined_width === spanning_width) {
			// when getting the minimum width the correct value is already set in the columns
			return;
		}

		// case the combined is larger than the spanning column
		if (combined_width > spanning_width) {
			this.spanning_column.set_minimum_width(combined_width);
			return;
		}

		// case the combined is smaller than the spanning column
		if (combined_width < spanning_width) {
			// calculate the needed column widths
			const needed_column_widths: Array<number> = this.spanned_columns_widths;
			// calculate the needed added width
			const difference = spanning_width - combined_width;
			// set the minimum width of the last spanned column to the needed width
			this.last_spanned_column.set_minimum_width(needed_column_widths[needed_column_widths.length - 1] + difference);
			return;
		}
	}
}

class ColumnConnectors {
	list_of_connectors: Array<TableColumnsConnector>;

	private calculate_connectors(
		last_table: Table,
		new_table: Table,
		last_line_widths: Array<number>,
		new_line_widths: Array<number>,
	): Array<TableColumnsConnector> {
		// calculate the column connectors

		let remaining_cells_old = last_line_widths.length;
		let remaining_cells_new = new_line_widths.length;

		// create a new list of column connectors
		const list_of_connectors = new Array<TableColumnsConnector>();

		// go through the
		while (remaining_cells_new > 0 && remaining_cells_old > 0) {
			const last_line_last_cell = last_line_widths[remaining_cells_old - 1];
			const new_line_last_cell = new_line_widths[remaining_cells_new - 1];
			// case both lengths are the same
			if (last_line_last_cell === new_line_last_cell) {
				// create a new simple connector
				const new_connector = new TableColumnsConnector(new_table.columns[remaining_cells_new - 1]);
				new_connector.add_spanned_column(last_table.columns[remaining_cells_old - 1]);
				list_of_connectors.push(new_connector);
				remaining_cells_old--;
				remaining_cells_new--;
				continue;
			}
			// case the last line last cell is smaller than the current line last cell
			let combined = last_line_last_cell;
			let counter = 2;
			while (combined < new_line_last_cell) {
				combined += last_line_widths[remaining_cells_old - counter] + 1;
				counter++;
			}
			// check if combined is the same as the new line last cell
			if (combined === new_line_last_cell) {
				const new_connector = new TableColumnsConnector(new_table.columns[remaining_cells_new - 1]);
				counter--;
				while (counter > 0) {
					new_connector.add_spanned_column(last_table.columns[remaining_cells_old - counter]);
					counter--;
				}
				list_of_connectors.push(new_connector);
				remaining_cells_old -= counter;
				remaining_cells_new--;
				continue;
			}
			if (counter > 2 && combined > new_line_last_cell) {
				throw new Error("Case not handled yet");
			}

			combined = new_line_last_cell;
			counter = 2;
			while (combined < last_line_last_cell) {
				combined += new_line_widths[remaining_cells_new - counter] + 1;
				counter++;
			}

			if (combined === last_line_last_cell) {
				const new_connector = new TableColumnsConnector(last_table.columns[remaining_cells_old - 1]);
				counter--;
				while (counter > 0) {
					new_connector.add_spanned_column(new_table.columns[remaining_cells_new - counter]);
					counter--;
				}
				list_of_connectors.push(new_connector);
				remaining_cells_new -= counter;
				remaining_cells_old--;
				continue;
			}

			if (combined > last_line_last_cell) {
				throw new Error("Case not handled yet");
			}
		}

		return list_of_connectors;
	}
	constructor(last_table: Table, new_table: Table) {
		this.list_of_connectors = [];

		// get initial cell widths of the last line and get the current cell widths
		const last_line_widths = last_table.last_row.initial_cell_lengths;

		const offset = new_table.first_row.initial_width - last_table.last_row.initial_width;

		// Iterate as often as there are number of cells in the new table
		for (let i = 0; i < new_table.first_row.number_of_cells; i++) {
			const new_line_widths = new_table.first_row.initial_cell_lengths;
			// Change the perceived width of the column to be initial width - offset
			new_line_widths[i] -= offset;
			// Test if we can create a connector
			try {
				this.list_of_connectors = this.calculate_connectors(last_table, new_table, last_line_widths, new_line_widths);
				return;
			} catch (error) {}
		}
		throw new Error("Couldn't create table columns connectors");
	}

	calculate_widths() {
		for (const connector of this.list_of_connectors) {
			connector.calculate_widths();
		}
	}
}

export class ComplexTable {
	// The Complex Table consists of multiple tables which don't have the same number of columns
	private _tables: Array<Table>;
	private _column_connectors: Array<ColumnConnectors>;

	constructor() {
		this._tables = [];
		this._column_connectors = [];
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
			const last_table = this.last_table;
			const new_table = new Table(row);
			// if the row cannot be added to the last table, create a new table
			this._tables.push(new_table);
			// create a new list of column connectors
			this._column_connectors.push(new ColumnConnectors(last_table, new_table));
			return;
		}
	}

	get_formatted_table(): Array<string> {
		const formatted_tables: Array<string> = [];
		// Iterate over the column connectors and calculate the minimum widths
		for (const connector of this._column_connectors) {
			connector.calculate_widths();
		}
		// iterate over the column connectors in reverse
		for (let i = this._column_connectors.length - 1; i >= 0; i--) {
			// calculate the widths again
			this._column_connectors[i].calculate_widths();
		}

		for (const table of this._tables) {
			// append the formatted table to the formatted tables
			formatted_tables.push(...table.get_formatted_table());
		}
		return formatted_tables;
	}
}

export class Table {
	// This class only stores rows and columns that all have the same number of cells
	// The Table class stores a whole table with all the rows and cells
	private _rows: Array<TableRow>;
	private _columns: Array<TableColumn>;

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

	get columns(): Array<TableColumn> {
		return this._columns;
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
		const column_widths = [];
		// search min width of each column
		for (const column of this._columns) {
			column_widths.push(column.get_minimum_width());
		}
		return column_widths;
	}

	get first_row(): TableRow {
		return this._rows[0];
	}

	get last_row(): TableRow {
		return this._rows[this._rows.length - 1];
	}

	/**
	 * @returns An array of formatted rows
	 */
	get_formatted_table(): Array<string> {
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
