import * as text from "../text_utility";
import * as vscode from "vscode";

import * as assert from "node:assert";

suite("Text Utility - Get Table Range", () => {
	test("not in table", async () => {
		// Create a new text document
		const content = "\n+------+\n| test |\n+------+";
		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(0).range.start, doc.lineAt(0).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		assert.strictEqual(return_val, undefined);
	});
	test("in table", async () => {
		// Create a new text document
		const content = "+------+\n| test |\n+------+";
		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(1).range.start, doc.lineAt(1).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		const table_range = new vscode.Range(0, 0, 2, 8);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("start of document", async () => {
		// Create a new text document
		let content = "";
		content += "| test |\n";
		content += "+------+";
		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(1).range.start, doc.lineAt(1).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
	test("valid table", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(4).range.start, doc.lineAt(4).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		const table_range = new vscode.Range(1, 0, 5, 8);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("not a valid table, no top border", async () => {
		// Create a new text document
		let content = "\n";
		content += "| test |\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(4).range.start, doc.lineAt(4).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
	test("not a valid table, no bottom border", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+\n";
		content += "| test |";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(4).range.start, doc.lineAt(4).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});

	test("valid table, ending newline", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+\n";
		content += "| test |\n";
		content += "+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(doc.lineAt(4).range.start, doc.lineAt(4).range.end);
		const return_val = text.get_table_range(doc, cur_selection);
		const table_range = new vscode.Range(1, 0, 5, 8);
		assert.deepStrictEqual(return_val, table_range);
	});
});
