import { TableCell } from "../formatter";

import * as assert from "node:assert";

suite("Test Suite", () => {
	test("No change in length", () => {
		const input_cell = "| test |";
		const input_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(input_length, true);
		assert.strictEqual(output, input_cell);
	});
});
// describe("TableCell get_formatted_cell", () => {
// 	it("Should return the same string as the input", () => {
// 		const input_cell = "| test |";
// 		const input_length = 6;
// 		const cell = new TableCell(input_cell);
// 		const output = cell.get_formatted_cell(input_length, true);
// 		assert.strictEqual(output, input_cell);
// 	});
// 	it("Should return the string without the | at the end", () => {
// 		const input_cell = "| test |";
// 		const input_length = 6;
// 		const cell = new TableCell(input_cell);
// 		const output = cell.get_formatted_cell(input_length, true);
// 		assert.strictEqual(output, "| test");
// 	});
// 	it('Should return a string with 1 " " added to the back of the input cell with back separator', () => {
// 		const input_cell = "| test |";
// 		const input_length = 7;
// 		const cell = new TableCell(input_cell);
// 		const output = cell.get_formatted_cell(input_length, true);
// 		assert.strictEqual(output, "| test  |");
// 	});
// });
