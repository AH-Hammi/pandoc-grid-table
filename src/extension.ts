import * as vscode from "vscode";
import * as commands from "./commands";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pandoc-grid-table" is now active!');

	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(() => {
			vscode.commands.executeCommand("setContext", "pandoc-grid-table.isInTable", commands.isInTable());
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("pandoc-grid-table.nextCell", () => commands.next_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.previousCell", () => commands.previous_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.formatTable", () => commands.format_table()),
		vscode.commands.registerCommand("pandoc-grid-table.insertNewTable", () => commands.insert_new_table()),
		vscode.commands.registerCommand("pandoc-grid-table.addLineToCell", () => commands.add_line_to_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.addRowAbove", () => commands.add_row_above()),
		vscode.commands.registerCommand("pandoc-grid-table.addRowBelow", () => commands.add_row_below()),
	);
}

export function deactivate() {}
