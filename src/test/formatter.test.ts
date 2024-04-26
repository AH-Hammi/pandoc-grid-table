import { TableCell } from "../formatter";

import * as assert from "node:assert";

suite("Test Suite", () => {
	test("No change in length", () => {
		const input_cell: string = "| test |";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, input_cell);
	});
	test("Increase length", () => {
		const input_cell: string = "| test |";
		const output_length = 10;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "| test     |");
	});
	test("Remove Back Separator", () => {
		const input_cell: string = "| test |";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, false);
		assert.strictEqual(output, "| test ");
	});
	test("Shorten Cell, Valid", () => {
		const input_cell: string = "| test   |";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "| test |");
	});
	test("Same Length Row Separator", () => {
		const input_cell: string = "+---+";
		const output_length = 3;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+---+");
	});
	test("Change Length Row Separator", () => {
		const input_cell: string = "+---+";
		const output_length = 5;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+-----+");
	});
	test("Change Length Row Separator, with alignment", () => {
		const input_cell: string = "+:---:+";
		const output_length = 3;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+:-:+");
	});
	test("Check minimum length", () => {
		const input_cell: string = "| test |";
		const valid_length = 6;
		const cell = new TableCell(input_cell);
		assert.strictEqual(cell.minimum_cell_length, valid_length);
	});
	test("Check minimum length, long string", () => {
		const input_cell: string = "| test   |";
		const valid_length = 6;
		const cell = new TableCell(input_cell);
		assert.strictEqual(cell.minimum_cell_length, valid_length);
	});
	test("Check minimum length, row separator", () => {
		const input_cell: string = "+---+";
		const valid_length = 3;
		const cell = new TableCell(input_cell);
		assert.strictEqual(cell.minimum_cell_length, valid_length);
	});
	test("Check minimum length, row separator, too long", () => {
		const input_cell: string = "+----+";
		const valid_length = 3;
		const cell = new TableCell(input_cell);
		assert.strictEqual(cell.minimum_cell_length, valid_length);
	});
	test("Return cell", () => {
		const input_cell: string = "| test |";
		const cell = new TableCell(input_cell);
		assert.strictEqual(cell.cell, " test ");
	});
	test("Invalid length", () => {
		const input_cell: string = "| test |";
		const output_length = 3;
		const cell = new TableCell(input_cell);
		// Check if the formatter throws an error
		assert.throws(() => cell.get_formatted_cell(output_length, true));
	});
	test("Invalid row separator", () => {
		const input_cell: string = "+ test +";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ test +");
	});
	test("Missing one separator", () => {
		const input_cell: string = "+- -+";
		const output_length = 5;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ - - +");
	});
	test("Testing = separator", () => {
		const input_cell: string = "+==+";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+======+");
	});
});
