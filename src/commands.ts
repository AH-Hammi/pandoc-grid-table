import * as vscode from "vscode";
import * as text from "./text_utility";
import * as formatter from "./table";

// A function to navigate to the next cell
export function next_cell(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;

	const doc = editor.document;

	const cur_selection = editor.selection;

	// get the next cell range
	const next_cell_range = text.get_next_cell_range(doc, cur_selection);

	// check if a next cell exists
	if (!next_cell_range) {
		return;
	}

	// select the next cell
	editor.selection = new vscode.Selection(next_cell_range.start, next_cell_range.end);

	// Format the table
	format_table();
}

// A function to navigate to the previous cell
export function previous_cell(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;

	const doc = editor.document;

	const cur_selection = editor.selection;

	// get the previous cell range
	const previous_cell_range = text.get_previous_cell_range(doc, cur_selection);

	// check if a previous cell exists
	if (!previous_cell_range) {
		return;
	}

	// select the previous cell
	editor.selection = new vscode.Selection(previous_cell_range.start, previous_cell_range.end);
	// Format the table
	format_table();
}

// A function to format the table
export function format_table(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const doc = editor.document;
	const cur_selection = editor.selection;
	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// count the number of "|" before the cursor
	const cell_index = text.get_cell_index_in_line(
		doc.lineAt(cur_selection.active.line).text,
		cur_selection.active.character,
	);

	const current_row_index = cur_selection.active.line - table_range.start.line;

	const table = new formatter.ComplexTable();
	// get current selection and check in what cell we are

	// Iterate over the lines in the table
	for (let i = table_range.start.line; i <= table_range.end.line; i++) {
		const line = doc.lineAt(i);
		table.add_row_raw(line.text);
	}

	// format the table
	const formatted_table = table.get_formatted_table();
	// replace the table with the formatted table
	editor.edit((editBuilder) => {
		editBuilder.replace(table_range, formatted_table.join("\n"));
	});

	const current_row = formatted_table[current_row_index];
	const [first_char, last_char] = text.get_selection_range(current_row, cell_index);

	// select the cell
	editor.selection = new vscode.Selection(cur_selection.active.line, first_char, cur_selection.active.line, last_char);
}

export function insert_new_table(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const cur_selection = editor.selection;

	// open a new input field to enter number of columns
	let number_of_columns: number;
	let number_of_rows: number;

	const input_columns = vscode.window.showInputBox({ prompt: "Enter number of columns" });

	const input_rows = Promise.all([input_columns]).then(() => {
		return vscode.window.showInputBox({ prompt: "Enter number of rows" });
	});

	Promise.all([input_columns, input_rows])
		.then(([columns, rows]) => {
			if (columns === undefined || rows === undefined) {
				return;
			}
			number_of_columns = Number.parseInt(columns);
			number_of_rows = Number.parseInt(rows);
		})
		.then(() => {
			if (
				number_of_columns === undefined ||
				number_of_rows === undefined ||
				number_of_columns <= 0 ||
				number_of_rows <= 0
			) {
				return;
			}

			const row_separator = `${"+---".repeat(number_of_columns)}+\n`;

			const row = `${row_separator}${"|   ".repeat(number_of_columns)}|\n`;

			const table = `${row.repeat(number_of_rows)}${row_separator}`;

			editor.edit((editBuilder) => {
				editBuilder.insert(cur_selection.active, `${table}`);
			});

			// select first cell
			editor.selection = new vscode.Selection(cur_selection.active.line + 1, 2, cur_selection.active.line + 1, 3);
		});
}

export function add_line_to_cell(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const doc = editor.document;
	const cur_selection = editor.selection;

	// get the table range
	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get current line text
	const line = doc.lineAt(cur_selection.active.line).text;

	// get the cell index
	const cell_index = text.get_cell_index_in_line(line, cur_selection.active.character);

	// check if we need to create a new line or if we already have one
	if (doc.lineAt(cur_selection.active.line + 1).text.charAt(0) !== "|") {
		// a new line already exists
		// replace all characters with " " except "|"
		const new_line = line
			.split("")
			.map((char) => (char === "|" ? char : " "))
			.join("");

		editor.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(cur_selection.active.line + 1, 0), `${new_line}\n`);
		});
	}

	// get the selection range
	const [first_char, last_char] = text.get_selection_range(line, cell_index);

	// select the cell
	editor.selection = new vscode.Selection(
		cur_selection.active.line + 1,
		first_char,
		cur_selection.active.line + 1,
		last_char,
	);
}

export function add_row_above(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const doc = editor.document;
	const cur_selection = editor.selection;

	// get the table range
	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get current line text
	const line = doc.lineAt(cur_selection.active.line).text;

	// get the cell index
	const cell_index = text.get_cell_index_in_line(line, cur_selection.active.character);

	// replace all characters with " " except "|"
	const new_line = line
		.split("")
		.map((char) => (char === "|" ? char : " "))
		.join("");
	// create a row separator by replacing all " " with "-" and "|" with "+"
	const row_separator = new_line.replaceAll(" ", "-").replaceAll("|", "+");

	// search the previous row separator
	let upmost_line_in_cell = cur_selection.active.line;
	while (upmost_line_in_cell - 1 >= table_range.start.line) {
		const line_text = doc.lineAt(upmost_line_in_cell - 1).text;
		if (line_text.charAt(0) === "+") {
			// Found the horizontal line to the top of the cell
			// Search next horizontal line
			break;
		}
		upmost_line_in_cell--;
	}

	editor.edit((editBuilder) => {
		editBuilder.insert(new vscode.Position(upmost_line_in_cell, 0), `${new_line}\n${row_separator}\n`);
	});

	// get the selection range
	const [first_char, last_char] = text.get_selection_range(line, cell_index);

	// select the cell
	editor.selection = new vscode.Selection(upmost_line_in_cell, first_char, upmost_line_in_cell, last_char);
}

export function add_row_below(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const doc = editor.document;
	const cur_selection = editor.selection;

	// get the table range
	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get current line text
	const line = doc.lineAt(cur_selection.active.line).text;

	// get the cell index
	const cell_index = text.get_cell_index_in_line(line, cur_selection.active.character);

	// replace all characters with " " except "|"
	const new_line = line
		.split("")
		.map((char) => (char === "|" ? char : " "))
		.join("");
	// create a row separator by replacing all " " with "-" and "|" with "+"
	const row_separator = new_line.replaceAll(" ", "-").replaceAll("|", "+");

	// search the previous row separator
	let down_most_line_in_cell = cur_selection.active.line;
	while (down_most_line_in_cell + 1 < table_range.end.line) {
		const line_text = doc.lineAt(down_most_line_in_cell + 1).text;
		if (line_text.charAt(0) === "+") {
			// Found the horizontal line to the top of the cell
			// Search next horizontal line
			break;
		}
		down_most_line_in_cell++;
	}

	editor.edit((editBuilder) => {
		editBuilder.insert(new vscode.Position(down_most_line_in_cell + 1, 0), `${row_separator}\n${new_line}\n`);
	});

	// get the selection range
	const [first_char, last_char] = text.get_selection_range(line, cell_index);

	// select the cell
	editor.selection = new vscode.Selection(
		down_most_line_in_cell + 2,
		first_char,
		down_most_line_in_cell + 2,
		last_char,
	);
}
