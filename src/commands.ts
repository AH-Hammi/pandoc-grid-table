import * as vscode from "vscode";
import * as text from "./text_utility";
import * as formatter from "./formatter";

// A function to navigate to the next cell
export function next_cell(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;

	const doc = editor.document;

	const cur_selection = editor.selection;

	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get the next cell range
	const next_cell_range = text.get_next_cell_range(
		doc,
		cur_selection,
		table_range,
	);

	// check if a next cell exists
	if (!next_cell_range) {
		return;
	}

	// select the next cell
	editor.selection = new vscode.Selection(
		next_cell_range.start,
		next_cell_range.end,
	);
}

// A function to navigate to the previous cell
export function previous_cell(): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;

	const doc = editor.document;

	const cur_selection = editor.selection;

	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get the previous cell range
	const previous_cell_range = text.get_previous_cell_range(
		doc,
		cur_selection,
		table_range,
	);

	// check if a previous cell exists
	if (!previous_cell_range) {
		return;
	}

	// select the previous cell
	editor.selection = new vscode.Selection(
		previous_cell_range.start,
		previous_cell_range.end,
	);
}

// A function to format the table
export function format_table(event: vscode.TextDocumentChangeEvent): void {
	const editor = vscode.window.activeTextEditor as vscode.TextEditor;

	const doc = editor.document;

	const cur_selection = editor.selection;

	const table_range = text.get_table_range(doc, cur_selection);

	// check if the cursor is in a table
	if (!table_range) {
		return;
	}

	// get the text change
	const text_change = event.contentChanges[0].text;

	// format the table
	// formatter.format_table(editor, doc, cur_selection, table_range, text_change);
}
