import { TableCell } from "./table_cell";

export class TableRow {
	// Every row contains a list of cells
	private _cells: Array<TableCell>;
	initial_width: number;

	constructor(raw_row: string) {
		// Deconstruct the row into its cells
		// go through the row and split it into cells
		// The split happens at either a table edge or a table corner
		this._cells = [];

		this.initial_width = raw_row.length;

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

	get_cell(index: number): TableCell {
		return this._cells[index];
	}

	// get_list_of_separator_positions(): Array<number> {
	// 	const separator_positions = [0];
	// 	for (const cell of this._cells) {
	// 		separator_positions.push(
	// 			separator_positions[separator_positions.length - 1] +
	// 			cell.initial_cell_length,
	// 		);
	// 	}
	// 	return separator_positions;
	// }

	// get initial cell lengths
	get initial_cell_lengths(): Array<number> {
		return this._cells.map((cell) => cell.initial_cell_length);
	}

	// get the formatted row
	get_formatted_row(lengths: Array<number>, add_back_separator = true): string {
		// check if the length of the lengths array isn't the same as the number of cells
		if (lengths.length !== this._cells.length) {
			throw new Error("The length of the lengths array is not the same as the number of cells.");
		}

		let formatted_row = "";
		// get the formatted cells, add the back separator to the last
		const last_index = this._cells.length - 1;
		for (let i = 0; i < this._cells.length - 1; i++) {
			formatted_row += this._cells[i].get_formatted_cell(lengths[i], false);
		}
		formatted_row += this._cells[last_index].get_formatted_cell(lengths[last_index], add_back_separator);
		return formatted_row;
	}
}
