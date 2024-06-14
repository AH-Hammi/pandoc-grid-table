import * as commands from "../commands";

import * as assert from "node:assert";
import { resolve } from "node:path";

import * as vscode from "vscode";

const current_dir = resolve(__dirname);

suite("Is in Table", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.isInTable();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("In a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(3, 2, 3, 7);
		// execute the command
		commands.isInTable();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Format Table", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.format_table();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("No editor given", async () => {
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		// open a test document
		commands.format_table();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Format Table", async () => {
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(9, 5, 9, 5);
		// execute the command
		commands.format_table(editor);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Insert New Table", () => {
	test("Undefined arguments", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(13, 0, 13, 0);
		// execute the command
		commands.insert_new_table();
		assert.deepStrictEqual(editor.selection, new vscode.Selection(13, 0, 13, 0));
		// assert.equal(doc.lineAt(14).text, "|   |   |");
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("No valid arguments", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(13, 0, 13, 0);
		// execute the command
		commands.insert_new_table(";", ";");
		assert.deepStrictEqual(editor.selection, new vscode.Selection(13, 0, 13, 0));
		// assert.equal(doc.lineAt(14).text, "|   |   |");
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("2x2 table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(13, 0, 13, 0);
		// execute the command
		commands.insert_new_table("2", "2");
		assert.deepStrictEqual(editor.selection, new vscode.Selection(14, 2, 14, 3));
		// assert.equal(doc.lineAt(14).text, "|   |   |");
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Add Line to Cell", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.add_line_to_cell();
		assert.deepStrictEqual(editor.selection, new vscode.Selection(1, 0, 1, 0));
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});

	test("Add a line to the cell", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(3, 2, 3, 2);
		// execute the command
		commands.add_line_to_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(4, 2, 4, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Add Row Above", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.add_row_above();
		// close the test document
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Add a row above first row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(18, 2, 18, 2);
		// execute the command
		commands.add_row_above();
		// test that the cursor is in the selected cell
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(17, 2, 17, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		// close the test document
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Add Row Below", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.add_row_below();
		// close the test document
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Add a row below first row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(17, 2, 17, 2);
		// execute the command
		commands.add_row_below();
		// test that the cursor is in the selected cell
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(21, 2, 21, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		// close the test document
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Next Cell", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.next_cell();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Go to next cell in current row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(3, 2, 3, 2);
		// execute the command
		commands.next_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(3, 9, 3, 14);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Go to next cell in next row without creating a new row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(3, 9, 3, 14);
		// execute the command
		commands.next_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(5, 2, 5, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Go to next cell in next row with creating a new row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(5, 9, 5, 14);
		// execute the command
		commands.next_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(7, 2, 7, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});

suite("Previous Cell", () => {
	test("Not in a table", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(1, 0, 1, 0);
		// execute the command
		commands.previous_cell();
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Go to previous cell in current row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(3, 9, 3, 14);
		// execute the command
		commands.previous_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(3, 2, 3, 6);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
	test("Go to previous cell in previous row", async () => {
		// open a test document
		const editor = await vscode.workspace
			.openTextDocument(`${current_dir}/../../src/test/NextCell.test.md`)
			.then(async (doc) => {
				return await vscode.window.showTextDocument(doc);
			});
		const doc = editor.document;
		editor.selection = new vscode.Selection(5, 2, 5, 6);
		// execute the command
		commands.previous_cell();
		const cur_selection = editor.selection;
		const expected_selection = new vscode.Selection(3, 9, 3, 14);
		assert.deepStrictEqual(cur_selection, expected_selection);
		vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});
});
