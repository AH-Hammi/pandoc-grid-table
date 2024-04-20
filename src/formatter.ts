/**
 * This file contains the function to format the table
 *
 * @author Alexander Hammans
 * @version 0.0.1
 * @license GNU-GPL-3.0
 */

import * as vscode from "vscode";

export function format_table(
	editor: vscode.TextEditor,
	doc: vscode.TextDocument,
	cur_selection: vscode.Selection,
	table_range: vscode.Range,
	text_change: string,
) {
	console.log(
		`Formatting table from ${table_range.start.line + 1} to ${
			table_range.end.line + 1
		}`,
	);
	// This command needs to be called after every keystroke, and the table needs to be formatted before

	// check if the next two characters are " " then remove one and return
	// get the next two characters after the selection position
	const next_two_chars = doc.getText(
		new vscode.Range(
			cur_selection.active.line,
			cur_selection.active.character + 1,
			cur_selection.active.line,
			cur_selection.active.character + 3,
		),
	);

	console.log(`Next two chars: "${next_two_chars}"`);

	// check if the next two characters are " " then remove one and return
	if (next_two_chars === "  ") {
		console.log("Removing one and returning");
		editor.edit((editBuilder) => {
			editBuilder.delete(
				new vscode.Range(
					cur_selection.active.line,
					cur_selection.active.character + 1,
					cur_selection.active.line,
					cur_selection.active.character + 2,
				),
			);
		});
		return;
	}

	// get index of next "|" in the current line after the selection position
	// let line_text = doc.lineAt(cur_selection.active.line).text;
	// const index_of_next_vertical_bar = line_text.indexOf(
	// 	"|",
	// 	cur_selection.active.character,
	// );
	// // get the closest "+" in the row separator above the cursor
	// // search the row separator above the cursor
	// let row_separator_above_cursor = "";
	// for (let i = cur_selection.active.line - 1; i >= 0; i--) {
	// 	const line_text = doc.lineAt(i).text;
	// 	// check if the line starts with "+"
	// 	if (line_text.charAt(0) === "+") {
	// 		row_separator_above_cursor = line_text;
	// 		break;
	// 	}
	// }
	// // find the index of the closest "+" in the row separator
	// const index_of_next_plus = row_separator_above_cursor.indexOf(
	// 	"+",
	// 	cur_selection.active.character,
	// );
	// // check if the index of the next "+" is less then the index of "|"
	// if (
	// 	index_of_next_plus < index_of_next_vertical_bar
	// ) {
	// 	// we have the case that a character was added to the cell

	// 	// check the second to last characters before the "|"
	// 	// if the second to last is " " remove it and exit the function
	// 	if (line_text.charAt(cur_selection.active.character - 2) === " ") {
	// 		// remove the second to last character
	// 		line_text =
	// 			line_text.substring(0, cur_selection.active.character - 2) +
	// 			line_text.substring(cur_selection.active.character);
	// 		// update the line
	// 		editor.edit((edit) =>
	// 			edit.replace(doc.lineAt(cur_selection.active.line).range, line_text),
	// 		);
	// 		// exit the function
	// 		return;
	// 	}
	// 	console.error("Not yet implemented");
	// 	throw new Error("Not yet implemented");
	// }
}
