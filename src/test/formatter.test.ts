import { TableCell } from "../table_cell";
import { TableRow } from "../table_row";
import { ComplexTable, Table } from "../table";

import * as assert from "node:assert";

suite("Formatter", () => {
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
	test("Testing = separator", () => {
		const input_cell: string = "+==+";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+======+");
	});
	test("Testing too short cell", () => {
		const input_cell: string = "| test |";
		const output_length = 3;
		const cell = new TableCell(input_cell);
		assert.throws(() => cell.get_formatted_cell(output_length, true));
	});
	test("Missing front separator", () => {
		const input_cell: string = "+ --+";
		const output_length = 4;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ -- +");
	});
	test("Missing back separator", () => {
		const input_cell: string = "+-- +";
		const output_length = 4;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ -- +");
	});
	test("Missing one separator", () => {
		const input_cell: string = "+- -+";
		const output_length = 5;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ - - +");
	});
	test("Second char is not a separator", () => {
		const input_cell: string = "+- -+";
		const output_length = 5;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ - - +");
	});
	test("Third char is not a separator", () => {
		const input_cell: string = "+-- -+";
		const output_length = 6;
		const cell = new TableCell(input_cell);
		const output = cell.get_formatted_cell(output_length, true);
		assert.strictEqual(output, "+ -- - +");
	});
	test("First char is not a separator", () => {
		const input_cell: string = "  test |";
		assert.throws(() => new TableCell(input_cell));
	});
	test("Last char is not a separator", () => {
		const input_cell: string = "| test  ";
		assert.throws(() => new TableCell(input_cell));
	});
	test("Test Table Row Class", () => {
		const input_row = "| test | test2 |";
		const row = new TableRow(input_row);
		assert.strictEqual(row.number_of_cells, 2);
		assert.strictEqual(row.get_cell(0).cell, " test ");
		assert.strictEqual(row.get_cell(0).cell.length, 6);
		assert.strictEqual(row.get_formatted_row([6, 7]), "| test | test2 |");
		assert.throws(() => row.get_formatted_row([6, 7, 8]));
	});
	test("Test Simple Table", () => {
		const table = new ComplexTable();
		table.add_row_raw("+------+---+");
		table.add_row_raw("| Header |Column 2 |");
		table.add_row_raw("+====+====+");
		table.add_row_raw("| test | Row 2  |");
		table.add_row_raw("+------+---+");
		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table.length, 5);
		assert.strictEqual(formatted_table[0], "+--------+----------+");
		assert.strictEqual(formatted_table[1], "| Header | Column 2 |");
		assert.strictEqual(formatted_table[2], "+========+==========+");
		assert.strictEqual(formatted_table[3], "| test   | Row 2    |");
		assert.strictEqual(formatted_table[4], "+--------+----------+");
	});
	test("Concatenated Columns", () => {
		const table = new ComplexTable();
		table.add_row_raw("+-----------------+");
		table.add_row_raw("| Header 1        |");
		table.add_row_raw("+======+==========+");
		table.add_row_raw("| test | Row 2    |");
		table.add_row_raw("+------+----------+");

		const formatted_table = table.get_formatted_table();

		console.log(formatted_table);

		assert.strictEqual(formatted_table.length, 5);
		assert.strictEqual(formatted_table[0], "+--------------+");
		assert.strictEqual(formatted_table[1], "| Header 1     |");
		assert.strictEqual(formatted_table[2], "+======+=======+");
		assert.strictEqual(formatted_table[3], "| test | Row 2 |");
		assert.strictEqual(formatted_table[4], "+------+-------+");
	});
	test("Concatenated Columns 2", () => {
		const table = new ComplexTable();
		table.add_row_raw("+------+----------+");
		table.add_row_raw("| test | Row 1    |");
		table.add_row_raw("+======+==========+");
		table.add_row_raw("| Header 2        |");
		table.add_row_raw("+-----------------+");

		const formatted_table = table.get_formatted_table();

		console.log(formatted_table);

		assert.strictEqual(formatted_table.length, 5);
		assert.strictEqual(formatted_table[0], "+------+-------+");
		assert.strictEqual(formatted_table[1], "| test | Row 1 |");
		assert.strictEqual(formatted_table[2], "+======+=======+");
		assert.strictEqual(formatted_table[3], "| Header 2     |");
		assert.strictEqual(formatted_table[4], "+--------------+");
	});
	test("Concatenated Rows", () => {
		const table = new ComplexTable();
		table.add_row_raw("+------+--------+");
		table.add_row_raw("| test | Header |");
		table.add_row_raw("|      +--------+");
		table.add_row_raw("|      | Row 2  |");
		table.add_row_raw("+------+--------+");

		const formatted_table = table.get_formatted_table();

		assert.strictEqual(formatted_table[0], "+------+--------+");
		assert.strictEqual(formatted_table[1], "| test | Header |");
		assert.strictEqual(formatted_table[2], "|      +--------+");
		assert.strictEqual(formatted_table[3], "|      | Row 2  |");
		assert.strictEqual(formatted_table[4], "+------+--------+");
	});
	test("Multiple Row Cell", () => {
		const table = new ComplexTable();
		table.add_row_raw("+---------------+---------------+--------------------+");
		table.add_row_raw("| Fruit         | Price         | Advantages         |");
		table.add_row_raw("+===============+===============+====================+");
		table.add_row_raw("| Bananas       | $1.34         | - built-in wrapper |");
		table.add_row_raw("|               |               | - bright color     |");
		table.add_row_raw("+---------------+---------------+--------------------+");
		table.add_row_raw("| Oranges       | $2.10         | - cures scurvy     |");
		table.add_row_raw("|               |               | - tasty            |");
		table.add_row_raw("+---------------+---------------+--------------------+");

		const formatted_table = table.get_formatted_table();

		assert.strictEqual(formatted_table[0], "+---------+-------+--------------------+");
		assert.strictEqual(formatted_table[1], "| Fruit   | Price | Advantages         |");
		assert.strictEqual(formatted_table[2], "+=========+=======+====================+");
		assert.strictEqual(formatted_table[3], "| Bananas | $1.34 | - built-in wrapper |");
		assert.strictEqual(formatted_table[4], "|         |       | - bright color     |");
		assert.strictEqual(formatted_table[5], "+---------+-------+--------------------+");
		assert.strictEqual(formatted_table[6], "| Oranges | $2.10 | - cures scurvy     |");
		assert.strictEqual(formatted_table[7], "|         |       | - tasty            |");
		assert.strictEqual(formatted_table[8], "+---------+-------+--------------------+");
	});
	test("Concatenated Columns and Rows", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------------------+----------+");
		table.add_row_raw("| Properties          | Earth    |");
		table.add_row_raw("+=============+=======+==========+");
		table.add_row_raw("|             | min   | -89.2 °C |");
		table.add_row_raw("| Temperature +-------+----------+");
		table.add_row_raw("| 1961-1990   | mean  | 14 °C    |");
		table.add_row_raw("|             +-------+----------+");
		table.add_row_raw("|             | max   | 56.7 °C  |");
		table.add_row_raw("+-------------+-------+----------+");

		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table[0], "+--------------------+----------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+----------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+");
	});
	test("Alignment", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------+-------+--------------------+");
		table.add_row_raw("| Right   | Left  | Center             |");
		table.add_row_raw("+========:+:======+:==================:+");
		table.add_row_raw("| Bananas | $1.34 | - built-in wrapper |");
		table.add_row_raw("+---------+-------+--------------------+");

		const formatted_table = table.get_formatted_table();

		assert.strictEqual(formatted_table[0], "+---------+-------+--------------------+");
		assert.strictEqual(formatted_table[1], "| Right   | Left  | Center             |");
		assert.strictEqual(formatted_table[2], "+========:+:======+:==================:+");
		assert.strictEqual(formatted_table[3], "| Bananas | $1.34 | - built-in wrapper |");
		assert.strictEqual(formatted_table[4], "+---------+-------+--------------------+");
	});
	test("Changed Concatenated Columns, remove characters in first column", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------------------+----------+");
		table.add_row_raw("| Properties  | Earth    |");
		table.add_row_raw("+=============+=======+==========+");
		table.add_row_raw("|             | min   | -89.2 °C |");
		table.add_row_raw("| Temperature +-------+----------+");
		table.add_row_raw("| 1961-1990   | mean  | 14 °C    |");
		table.add_row_raw("|             +-------+----------+");
		table.add_row_raw("|             | max   | 56.7 °C  |");
		table.add_row_raw("+-------------+-------+----------+");

		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table[0], "+--------------------+----------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+----------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+");
	});
	test("Changed Concatenated Columns, add characters in first column", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------------------+----------+");
		table.add_row_raw("| Properties               | Earth    |");
		table.add_row_raw("+=============+=======+==========+");
		table.add_row_raw("|             | min   | -89.2 °C |");
		table.add_row_raw("| Temperature +-------+----------+");
		table.add_row_raw("| 1961-1990   | mean  | 14 °C    |");
		table.add_row_raw("|             +-------+----------+");
		table.add_row_raw("|             | max   | 56.7 °C  |");
		table.add_row_raw("+-------------+-------+----------+");

		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table[0], "+--------------------+----------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+----------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+");
	});
	test("Changed Concatenated Columns, remove characters in second column", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------------------+----------+");
		table.add_row_raw("| Properties          | Earth |");
		table.add_row_raw("+=============+=======+==========+");
		table.add_row_raw("|             | min   | -89.2 °C |");
		table.add_row_raw("| Temperature +-------+----------+");
		table.add_row_raw("| 1961-1990   | mean  | 14 °C    |");
		table.add_row_raw("|             +-------+----------+");
		table.add_row_raw("|             | max   | 56.7 °C  |");
		table.add_row_raw("+-------------+-------+----------+");

		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table[0], "+--------------------+----------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+----------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+");
	});
	test("Changed Concatenated Columns, change in two cells, not a valid change", () => {
		const table = new ComplexTable();

		table.add_row_raw("+---------------------+----------+");
		table.add_row_raw("| Properties         | Earth |");
		assert.throws(() => table.add_row_raw("+=============+=======+==========+"));
	});
	test("Concatenated Columns and Multiple Rows", () => {
		const table = new ComplexTable();
		table.add_row_raw("+---------------------+-----------------------+");
		table.add_row_raw("| Location            | Temperature 1961-1990 |");
		table.add_row_raw("|                     | in degree Celsius     |");
		table.add_row_raw("|                     +-------+-------+-------+");
		table.add_row_raw("|                     | min   | mean  | max   |");
		table.add_row_raw("+=====================+=======+=======+=======+");
		table.add_row_raw("| Argentina           | -89.2 | N/A   | 19.8  |");
		table.add_row_raw("+---------------------+-------+-------+-------+");
		table.add_row_raw("| Earth               | -89.2 | 14    | 56.7  |");
		table.add_row_raw("+---------------------+-------+-------+-------+");

		const formatted_table = table.get_formatted_table();
		console.log(formatted_table);
		assert.strictEqual(formatted_table[0], "+-----------+-----------------------+");
		assert.strictEqual(formatted_table[1], "| Location  | Temperature 1961-1990 |");
		assert.strictEqual(formatted_table[2], "|           | in degree Celsius     |");
		assert.strictEqual(formatted_table[3], "|           +---------+------+------+");
		assert.strictEqual(formatted_table[4], "|           | min     | mean | max  |");
		assert.strictEqual(formatted_table[5], "+===========+=========+======+======+");
		assert.strictEqual(formatted_table[6], "| Argentina | -89.2   | N/A  | 19.8 |");
		assert.strictEqual(formatted_table[7], "+-----------+---------+------+------+");
		assert.strictEqual(formatted_table[8], "| Earth     | -89.2   | 14   | 56.7 |");
		assert.strictEqual(formatted_table[9], "+-----------+---------+------+------+");
	});
	test("Concatenated Rows In Multiple Columns", () => {
		const table = new ComplexTable();
		table.add_row_raw("+--------------------+----------+--------------------+");
		table.add_row_raw("| Properties         | Earth    | Properties         |");
		table.add_row_raw("+=============+======+==========+=============+======+");
		table.add_row_raw("|             | min  | -89.2 °C |             | min  |");
		table.add_row_raw("| Temperature +------+          | Temperature +------+");
		table.add_row_raw("| 1961-1990   | mean | 14 °C    | 1961-1990   | mean |");
		table.add_row_raw("|             +------+----------+             |      |");
		table.add_row_raw("|             | max  | 56.7 °C  |             | max  |");
		table.add_row_raw("+-------------+------+----------+-------------+------+");
		const formatted_table = table.get_formatted_table();
		assert.strictEqual(formatted_table[0], "+--------------------+----------+--------------------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    | Properties         |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+=============+======+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |             | min  |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+          | Temperature +------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    | 1961-1990   | mean |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+             |      |");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |             | max  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+-------------+------+");
	});
	test("Changed Concatenated Rows In Multiple Columns", () => {
		const table = new ComplexTable();
		table.add_row_raw("+--------------------+----------+--------------------+");
		table.add_row_raw("| Properties         | Earth    | Properties             |");
		table.add_row_raw("+=============+======+==========+=============+======+");
		table.add_row_raw("|             | min  | -89.2 °C |               | min  |");
		table.add_row_raw("| Temperature +------+          | Temperature +------+");
		table.add_row_raw("| 1961-1990   | mean | 14 °C    | 1961-1990   | mean |");
		table.add_row_raw("|             +------+----------+             |      |");
		table.add_row_raw("|             | max  | 56.7 °C  |             | max  |");
		table.add_row_raw("+-------------+------+----------+-------------+------+");
		const formatted_table = table.get_formatted_table();
		assert.strictEqual(formatted_table[0], "+--------------------+----------+--------------------+");
		assert.strictEqual(formatted_table[1], "| Properties         | Earth    | Properties         |");
		assert.strictEqual(formatted_table[2], "+=============+======+==========+=============+======+");
		assert.strictEqual(formatted_table[3], "|             | min  | -89.2 °C |             | min  |");
		assert.strictEqual(formatted_table[4], "| Temperature +------+          | Temperature +------+");
		assert.strictEqual(formatted_table[5], "| 1961-1990   | mean | 14 °C    | 1961-1990   | mean |");
		assert.strictEqual(formatted_table[6], "|             +------+----------+             |      |");
		assert.strictEqual(formatted_table[7], "|             | max  | 56.7 °C  |             | max  |");
		assert.strictEqual(formatted_table[8], "+-------------+------+----------+-------------+------+");
	});
	test("Indented List in Cell", () => {
		const table = new ComplexTable();
		table.add_row_raw("+-----+-------------------------+");
		table.add_row_raw("| No. | Description             |");
		table.add_row_raw("+:===:+=========================+");
		table.add_row_raw("| 1   | - This is a long string |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("+-----+-------------------------+");
		const formatted_table = table.get_formatted_table();
		assert.strictEqual(formatted_table[0], "+-----+-------------------------+");
		assert.strictEqual(formatted_table[1], "| No. | Description             |");
		assert.strictEqual(formatted_table[2], "+:===:+=========================+");
		assert.strictEqual(formatted_table[3], "| 1   | - This is a long string |");
		assert.strictEqual(formatted_table[4], "|     |   - Short string        |");
		assert.strictEqual(formatted_table[5], "|     |   - Short string        |");
		assert.strictEqual(formatted_table[6], "|     |   - Short string        |");
		assert.strictEqual(formatted_table[7], "|     |   - Short string        |");
		assert.strictEqual(formatted_table[8], "|     |   - Short string        |");
		assert.strictEqual(formatted_table[9], "+-----+-------------------------+");
	});
	test("Indented List in Cell, Changed", () => {
		const table = new ComplexTable();
		table.add_row_raw("+-----+-------------------------+");
		table.add_row_raw("| No. | Description             |");
		table.add_row_raw("+:===:+=========================+");
		table.add_row_raw("| 1   | - This is a long string |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Long string again with words        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("|     |   - Short string        |");
		table.add_row_raw("+-----+-------------------------+");
		const formatted_table = table.get_formatted_table();
		assert.strictEqual(formatted_table[0], "+-----+----------------------------------+");
		assert.strictEqual(formatted_table[1], "| No. | Description                      |");
		assert.strictEqual(formatted_table[2], "+:===:+==================================+");
		assert.strictEqual(formatted_table[3], "| 1   | - This is a long string          |");
		assert.strictEqual(formatted_table[4], "|     |   - Short string                 |");
		assert.strictEqual(formatted_table[5], "|     |   - Short string                 |");
		assert.strictEqual(formatted_table[6], "|     |   - Long string again with words |");
		assert.strictEqual(formatted_table[7], "|     |   - Short string                 |");
		assert.strictEqual(formatted_table[8], "|     |   - Short string                 |");
		assert.strictEqual(formatted_table[9], "+-----+----------------------------------+");
	});
});
