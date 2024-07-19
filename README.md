# pandoc-grid-table README

## Features

This Extension aims to help in handling [pandoc grid tables](https://pandoc.org/MANUAL.html#extension-grid_tables).

Grid Tables can look something like this:

```plain
+-----------------------+----------+
| Properties            | Earth    |
+=============+=========+==========+
|             | min     | -89.2 °C |
| Temperature +---------+----------+
| 1961-1990   | mean    | 14 °C    |
|             +---------+----------+
|             | max     | 56.7 °C  |
+-------------+---------+----------+
```

As we can see, in comparison to classical pipe tables, grid tables are a bit complexer but more powerful due to the following features:

- Grid Tables can contain concatenated columns
- Grid Tables can contain concatenated rows
- Grid Tables can contain multiple rows per cell
- Furthermore a header and footer can be added

This extension enables you to quickly jump from one cell to the next as well as auto formatting the table. It should work as a general helper for working with pandoc grid tables.

## Requirements

For this extension to make any sense you need to have pandoc installed.

## Extension Settings

This extension contributes the following settings:

- `pandoc-grid-table.autoInsertNewRow`: Enables whether to add a new row after going to next cell in last cell of the table.

## Release Notes

### 0.0.2

- Changed Behavior of Formatter to allow for multiple space in front of the cell content.
  This is necessary to be able to use lists inside of a cell.

### 0.0.1

Initial Release with the following features:

- [x] Jump to next cell
- [x] Jump to previous cell
- [x] Format table
- [x] Add a snippet to add a new table
- [x] [Create multiline cell](#create-multiline-cell)
- [x] Insert Row (Behavior will change in the future)
- [x] Add a new row after tabing from the last cell
  - [x] Make it an option

#### Create multiline cell

On pressing "enter" key in a cell,
create a new line for that cell and start at the beginning of the cell.

## Upcoming Features

- [ ] Delete Row
- [ ] Insert Column
- [ ] Delete Column
- [ ] Paste from Excel
- [ ] Paste from CSV
- [ ] Concatenation of Cells
- [ ] Add alignment to cells depending on the header row
- [ ] Make functions available to click on while in a cell
  - [ ] Insert Row Above
  - [ ] Insert Row Below
  - [ ] Insert Column Left
  - [ ] Insert Column Right
  - [ ] Delete Row
  - [ ] Delete Column
