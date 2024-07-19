enum TableSeparator {
	TABLE_EDGE = "|",
	TABLE_CORNER = "+",
}

function is_row_separator(line_text: string): boolean {
	// check if the first char is a valid char
	if (line_text.charAt(0) !== ":" && line_text.charAt(0) !== "=" && line_text.charAt(0) !== "-") {
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
	// check if second char is valid
	if (second_char !== "-" && second_char !== "=") {
		return false;
	}
	for (let i = 2; i < line_text.length - 1; i++) {
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
	is_row_separator: boolean;
	front_separator: TableSeparator;
	back_separator: TableSeparator;
	initial_cell_length: number;

	constructor(raw_cell: string) {
		this._cell = "";
		this.front_separator = TableSeparator.TABLE_EDGE;
		this.back_separator = TableSeparator.TABLE_EDGE;
		this.is_row_separator = false;
		this.initial_cell_length = 0;
		this.cell = raw_cell;
	}

	set cell(raw_cell: string) {
		// check if first and last char are Table Edge or Table Corner
		const first_char = raw_cell.charAt(0);
		const last_char = raw_cell.charAt(raw_cell.length - 1);

		// check if the first and last char are a valid enum value
		if (!Object.values(TableSeparator).includes(first_char as TableSeparator)) {
			throw new Error("The first character of the cell is not a valid separator.");
		}
		if (!Object.values(TableSeparator).includes(last_char as TableSeparator)) {
			throw new Error("The last character of the cell is not a valid separator.");
		}

		// The first and last character determine what separator is used
		this.front_separator = raw_cell.charAt(0) as TableSeparator;
		this.back_separator = raw_cell.charAt(raw_cell.length - 1) as TableSeparator;
		// The rest of the cell is the inner text

		// save the initial length
		this.initial_cell_length = raw_cell.length - 2;

		// Check if the cell is a row separator
		if (
			this.front_separator === TableSeparator.TABLE_CORNER &&
			this.back_separator === TableSeparator.TABLE_CORNER &&
			is_row_separator(raw_cell.substring(1, raw_cell.length - 1))
		) {
			// If it is, remove all but one and add the first and last char
			const first_char = raw_cell.charAt(1);
			const last_char = raw_cell.charAt(raw_cell.length - 2);
			this._cell = `${first_char}${raw_cell.charAt(2)}${last_char}`;
			this.is_row_separator = true;
		} else {
			// allow spaces in front but remove them in the back
			this._cell = `${raw_cell.substring(1, raw_cell.length - 1).trimEnd()} `;
			// check if the first char is a " "
			if (this._cell.charAt(0) !== " ") {
				// if not, add a space
				this._cell = ` ${this._cell}`;
			}
		}
	}

	get cell(): string {
		return this._cell;
	}

	get minimum_cell_length(): number {
		return this._cell.length;
	}

	get_formatted_cell(length: number, add_back_separator: boolean): string {
		// check if the length is more than the minimum length
		if (length < this.minimum_cell_length) {
			throw new Error(`The length of the cell is too short. The minimum length is ${this.minimum_cell_length}.`);
		}

		// this returns the formatted cell with the given length
		// it returns a string with the length of the cell
		// the Length is only the length of the inner text
		// if any of the separator is TableSeparator.TABLE_EDGE
		let formatted: string = this.front_separator;

		// check if both separator are TableSeparator.TABLE_CORNER
		if (this.is_row_separator) {
			const last_char = this._cell.charAt(this._cell.length - 1);
			// check if we need to shorten or extend the cell
			formatted += this._cell.charAt(0);
			formatted += this._cell.charAt(1).repeat(length - (this._cell.length - 1));
			// add the last char back
			formatted += `${last_char}`;
		} else {
			formatted += this._cell;
			formatted += " ".repeat(length - this._cell.length);
		}

		if (add_back_separator) {
			formatted += this.back_separator;
		}

		return formatted;
	}
}
