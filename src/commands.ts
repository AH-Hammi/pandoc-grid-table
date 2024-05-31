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
	let cell_index = 0;
	for (let i = 0; i < cur_selection.active.character; i++) {
		if (doc.lineAt(cur_selection.active.line).text.charAt(i) === "|") {
			cell_index++;
		}
	}
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
	let first_char = 0;
	let last_char = 0;

	let count = 0;
	// go through the line and count the number of "|"
	for (let i = 0; i < current_row.length; i++) {
		if (current_row.charAt(i) === "|") {
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

	// select the cell
	editor.selection = new vscode.Selection(cur_selection.active.line, first_char, cur_selection.active.line, last_char);
}

export function insert_new_table(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;
	const doc = editor.document;
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

	// open a new input field to enter number of rows

	// insert the table
}
