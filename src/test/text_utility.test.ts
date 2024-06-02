import * as text from "../text_utility";
import * as vscode from "vscode";

import * as assert from "node:assert";

suite("Get Table Range", () => {
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

suite("Get Next Cell Range", () => {
	test("not in a table", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(0, 0, 0, 0);
		const return_val = text.get_next_cell_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
	test("next cell in current row", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(3, 1, 3, 1);
		const return_val = text.get_next_cell_range(doc, cur_selection);
		const table_range = new vscode.Range(2, 9, 2, 13);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("next cell in next row", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |  \n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(2, 9, 2, 9);
		const return_val = text.get_next_cell_range(doc, cur_selection);
		const table_range = new vscode.Range(5, 2, 5, 6);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("next cell in next row, not possible", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(5, 9, 5, 9);
		const return_val = text.get_next_cell_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
});

suite("Get Previous Cell Range", () => {
	test("not in a table", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(0, 0, 0, 0);
		const return_val = text.get_previous_cell_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
	test("previous cell in current row", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(3, 9, 3, 9);
		const return_val = text.get_previous_cell_range(doc, cur_selection);
		const table_range = new vscode.Range(2, 2, 2, 6);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("previous cell in previous row", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(5, 2, 5, 6);
		const table_range = new vscode.Range(2, 9, 2, 13);
		const return_val = text.get_previous_cell_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, table_range);
	});
	test("previous cell in previous row, not possible", async () => {
		// Create a new text document
		let content = "\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "|      |      |\n";
		content += "+------+------+\n";
		content += "| test | test |\n";
		content += "+------+------+\n";

		const doc = await vscode.workspace.openTextDocument({
			content: content,
		});
		const cur_selection = new vscode.Selection(2, 4, 2, 4);
		const return_val = text.get_previous_cell_range(doc, cur_selection);
		assert.deepStrictEqual(return_val, undefined);
	});
});

suite("Get Cell Index in Line", () => {
	test("not a line with a cell", () => {
		const line = "+------+------+\n";
		const return_val = text.get_cell_index_in_line(line, 5);
		assert.deepStrictEqual(return_val, -1);
	});
	test("cell in line", () => {
		const line = "| test | test |\n";
		const return_val = text.get_cell_index_in_line(line, 2);
		assert.deepStrictEqual(return_val, 0);
	});
});

suite("Get Selection Range", () => {
	test("not a valid index", () => {
		const line = "| test | test |\n";
		const return_val = text.get_selection_range(line, -1);
		assert.deepStrictEqual(return_val, [0, -1]);
	});
	test("valid index", () => {
		const line = "| test | test |\n";
		const return_val = text.get_selection_range(line, 0);
		assert.deepStrictEqual(return_val, [2, 6]);
	});
});
