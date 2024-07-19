import * as vscode from "vscode";

// Get the table range
export function get_table_range(doc: vscode.TextDocument, cur_selection: vscode.Selection): vscode.Range | undefined {
	// Search top of the table
	// Go up the first column until we do not find a "|" or a "+"
	// The start corner will be if above the "+" is not a "|"
	let start_line = cur_selection.active.line;
	while (start_line >= 0) {
		const line_text = doc.lineAt(start_line).text;
		if (line_text.charAt(0) === "+") {
			// console.log(`Found a + at line ${start_line}`);
			// check if we are at the start of the document
			if (start_line === 0) {
				break;
			}
			// check if the line above does not start with "|"
			const prev_line_text = doc.lineAt(start_line - 1).text;
			if (prev_line_text.charAt(0) !== "|") {
				break;
			}
			start_line--;
			continue;
		}
		if (line_text.charAt(0) !== "|") {
			// console.log(`Not a | or + at line ${start_line + 1}, Not a valid table`);
			return undefined;
		}

		// on 0 exit the loop
		if (start_line === 0) {
			// console.log(`Top of document didn't find start of table`);
			return undefined;
		}
		start_line--;
	}

	// console.log(`Found start of table at ${start_line + 1}`);

	// Search bottom of the table
	// table needs to end with "+" otherwise it is not a valid table
	// go down until we get to a "+" followed by not a "|" in the next line
	let end_line = cur_selection.active.line;
	while (end_line < doc.lineCount) {
		const line_text = doc.lineAt(end_line).text;
		// check if the current line start with "+"
		if (line_text.charAt(0) === "+") {
			// check if we are at the end of the document
			if (end_line === doc.lineCount - 1) {
				// console.log(`Found end of table at ${end_line}`);
				break;
			}
			// check if the next line does not start with "|"
			const next_line = doc.lineAt(end_line + 1).text;
			if (next_line.charAt(0) !== "|") {
				// console.log(`Found end of table at ${end_line}`);
				break;
			}
		}
		// on the last line exit the loop and return undefined
		// because we are at the end of the document
		if (end_line === doc.lineCount - 1) {
			// console.log(`Bottom of document didn't find end of table`);
			return undefined;
		}
		end_line++;
	}
	// console.log(`Found end of table at ${end_line + 1}`);
	// return the range
	return new vscode.Range(
		new vscode.Position(start_line, 0),
		new vscode.Position(end_line, doc.lineAt(end_line).text.length),
	);
}

/// Goes to the next row in the table and returns the next first line of the row
function get_next_row(doc: vscode.TextDocument, table_range: vscode.Range, current_line: number): number | undefined {
	let next_row_line = current_line + 1;
	while (next_row_line < table_range.end.line) {
		const line_text = doc.lineAt(next_row_line).text;
		if (line_text.charAt(0) === "+") {
			return next_row_line + 1;
		}
		next_row_line++;
	}
	return undefined;
}

function get_previous_row(
	doc: vscode.TextDocument,
	table_range: vscode.Range,
	current_line: number,
): number | undefined {
	let found_last_row = false;
	let previous_row_line = current_line - 1;
	while (previous_row_line >= table_range.start.line) {
		const line_text = doc.lineAt(previous_row_line).text;
		if (found_last_row && line_text.charAt(0) === "+") {
			return previous_row_line + 1;
		}
		if (line_text.charAt(0) === "+") {
			// Found the horizontal line to the top of the cell
			// Search next horizontal line
			found_last_row = true;
		}
		previous_row_line--;
	}
	return undefined;
}

function find_next_cell_in_current_line(line_text: string, current_col: number): [number, number] | undefined {
	// check char for char until we find a "|"
	let start_col = current_col;
	while (start_col < line_text.length) {
		if (line_text.charAt(start_col) === "|") {
			// console.log(`Found | at column ${start_col}`);
			break;
		}
		start_col++;
	}
	// exit function if we reach the end of the line
	if (start_col + 1 >= line_text.length) {
		// console.log(`Reached end of line at column ${start_col}`);
		return undefined;
	}
	// check if we find another "|" after the first "|"
	let end_col = start_col + 1;
	while (end_col < line_text.length) {
		if (line_text.charAt(end_col) === "|") {
			// console.log(`Found | at column ${end_col}`);
			break;
		}
		end_col++;
		// exit function if we reach the end of the line
		if (end_col === line_text.length) {
			// console.log("Reached end of line couldn't find next cell");
			return undefined;
		}
	}
	// console.log(`Found | at columns ${start_col} and ${end_col}`);
	return [start_col, end_col];
}

function find_previous_cell_in_current_line(line_text: string, current_col: number): [number, number] | undefined {
	// check char for char until we find a "|"
	let end_col = current_col;
	while (end_col >= 0) {
		if (line_text.charAt(end_col) === "|") {
			// console.log(`Found | at column ${end_col}`);
			break;
		}
		end_col--;
	}
	// exit function if we reach the end of the line
	if (end_col === 0) {
		// console.log(`Couldn't find previous cell in current line`);
		return undefined;
	}
	// check if we find another "|" after the first "|"
	let start_col = end_col - 1;
	while (start_col >= 0) {
		if (line_text.charAt(start_col) === "|") {
			// console.log(`Found | at column ${start_col}`);
			break;
		}
		start_col--;
	}
	// console.log(`Found | at columns ${start_col} and ${end_col}`);
	return [start_col, end_col];
}

// find next cell , returns the range for the next cell
export function get_next_cell_range(
	doc: vscode.TextDocument,
	cur_selection: vscode.Selection,
): vscode.Range | undefined {
	// console.log("Searching for next cell");

	// get the table range
	const table_range = get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return undefined;
	}

	// search the next cell
	let start_end: [number, number] | undefined = undefined;
	let current_line: number | undefined = cur_selection.active.line;
	let first_char = cur_selection.active.character;
	while (true) {
		// check if we are at the top most line of the current row
		// move up until we find a row separator
		while (current_line >= table_range.start.line) {
			const line_text = doc.lineAt(current_line - 1).text;
			if (line_text.charAt(0) === "+") {
				// Found the horizontal line to the top of the cell
				// Search next horizontal line
				break;
			}
			current_line--;
		}
		// check if there is another cell in the current line
		start_end = find_next_cell_in_current_line(doc.lineAt(current_line).text, first_char);
		// if there is another cell in the current line
		if (start_end) {
			// exit the loop
			break;
		}
		// otherwise go to next row
		current_line = get_next_row(doc, table_range, current_line);
		// if we reached the end of the table
		if (!current_line) {
			// exit the function and return undefined
			return undefined;
		}
		first_char = 0;
	}
	const [start_col, end_col] = start_end;

	// return the range without the "|"
	return new vscode.Range(
		new vscode.Position(current_line, start_col + 2),
		new vscode.Position(current_line, end_col - 1),
	);
}

// find previous cell , returns the range for the previous cell
export function get_previous_cell_range(
	doc: vscode.TextDocument,
	cur_selection: vscode.Selection,
): vscode.Range | undefined {
	// console.log("Searching for previous cell");

	const table_range = get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return undefined;
	}

	// search the previous cell
	let start_end: [number, number] | undefined = undefined;
	let current_line: number | undefined = cur_selection.active.line;
	let first_char = cur_selection.active.character;
	while (true) {
		// check if we are at the top most line of the current row
		// move up until we find a row separator
		while (current_line >= table_range.start.line) {
			const line_text = doc.lineAt(current_line - 1).text;
			if (line_text.charAt(0) === "+") {
				// Found the horizontal line to the top of the cell
				// Search next horizontal line
				break;
			}
			current_line--;
		}
		// check if there is another cell in the current line
		start_end = find_previous_cell_in_current_line(doc.lineAt(current_line).text, first_char);
		// if there is another cell in the current line
		if (start_end) {
			// exit the loop
			break;
		}
		// otherwise go to previous row
		current_line = get_previous_row(doc, table_range, current_line);
		// if we reached the end of the table
		if (!current_line) {
			// exit the function and return undefined
			return undefined;
		}
		// set first char to end of current line
		first_char = doc.lineAt(current_line).text.length;
	}
	const [start_col, end_col] = start_end;

	// return the range without the "|"
	return new vscode.Range(
		new vscode.Position(current_line, start_col + 2),
		new vscode.Position(current_line, end_col - 1),
	);
}

export function get_cell_index_in_line(line_text: string, cur_char: number): number {
	let cell_index = -1;
	for (let i = 0; i < cur_char; i++) {
		if (line_text.charAt(i) === "|") {
			cell_index++;
		}
	}
	return cell_index;
}

export function get_selection_range(line_text: string, cell_index: number): [number, number] {
	let first_char = 0;
	let last_char = 0;
	let count = -1;
	// go through the line and count the number of "|"
	for (let i = 0; i < line_text.length; i++) {
		if (line_text.charAt(i) === "|") {
			count++;
			if (count === cell_index) {
				first_char = i + 2;
			}
			if (count === cell_index + 1) {
				last_char = i - 1;
				break;
			}
		}
	}

	return [first_char, last_char];
}
