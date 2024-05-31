import * as vscode from "vscode";
import * as commands from "./commands";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pandoc-grid-table" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand("pandoc-grid-table.nextCell", () => commands.next_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.previousCell", () => commands.previous_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.formatTable", () => commands.format_table()),
		vscode.commands.registerCommand("pandoc-grid-table.insertNewTable", () => commands.insert_new_table()),
		vscode.commands.registerCommand("pandoc-grid-table.addLineToCell", () => commands.add_line_to_cell()),
	);
}

export function deactivate() {}
