// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as commands from "./commands";
import * as formatter from "./table";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pandoc-grid-table" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand("pandoc-grid-table.nextCell", () => commands.next_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.previousCell", () => commands.previous_cell()),
		vscode.commands.registerCommand("pandoc-grid-table.formatTable", () => commands.format_table()),
		vscode.commands.registerCommand("pandoc-grid-table.insertNewTable", () => commands.insert_new_table()),
		// vscode.workspace.onDidChangeTextDocument((event) => {
		// 	commands.format_table(event);
		// }),
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
