# pandoc-grid-table README

Grid Table

```plain
+-------------+---------+----------+
|             | max     | 56.7 °C  |

+-----------------------+----------+
| Properties            | Earth    |
+=============+=========+==========+
|             | min     | -89.2 °C |
| Temperature +---------+----------+
| 1961-1990   | mean    | 14 °C    |
|             +---------+----------+
|             | max     | 56.7 °C  |
+-------------+---------+----------+

 13            6
+-------------+------+ Table
| verbunden | test |
 6      6      6
+------+------+------+ Table
 6      13
| test | verbunden   | Table
 6      6      6
+------+------+------+ Table
 13            6
| verbunden   | test | Table
+-------------+------+

 6      6      6      6
+------+------+------+------+ Row
| test | test | test | test | row Table
+------+------+------+------+ row

 13             28
| verbunden   | verbunden und verlängert   | Row Table

 6      6      6      6
+------+------+------+------+ Row
| test | test | test | test | row Table
+------+------+------+------+ row
```

Berechne die Summe von Spalte 1 und 2 der vorherigen Tabelle und vergleiche diese mit der Summe der aktuellen

Vergleiche Breite Zelle 1 der Tabelle 1 mit Zelle 1 Tabelle 2  
Wenn die Breite == so gehe weiter zur

Ist die aktuelle Zelle gleich der nachfolgenden Tabelle, wenn nicht so vergleiche:  
    wenn nachfolgende Zelle > als aktuelle ist, so addiere die nachfolgende Zelle +1 zu der aktuelle und vergleiche die Summe.  
      mache dies bis die Summe == ist  

```plain
+--------------+
| Header 1     |
+======+=======+
| test | Row 2 |
+------+-------+
```

## Features

This Extension aims to help in handling [pandoc grid tables](https://pandoc.org/MANUAL.html#extension-grid_tables).

This extension enables you to quickly jump from one cell to the next as well as auto formatting the table.

## Requirements

For this extension to make any sense you need to have pandoc installed.

## Extension Settings

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Release Notes

No release notes yet.

### 0.0.1

Initial Release with the following features:

* [x] Jump to next cell
* [x] Jump to previous cell
* [x] Format table
* [x] Add a snippet to add a new table
* [x] [Create multiline cell](#create-multiline-cell)
* [x] Insert Row (Behavior will change in the future)
* [x] Add a new row after tabing from the last cell
  * [x] Make it an option

#### Create multiline cell

On pressing "enter" key in a cell,  
create a new line for that cell and start at the beginning of the cell.

## Upcoming Features

* [ ] Delete Row
* [ ] Insert Column
* [ ] Delete Column
* [ ] Paste from Excel
* [ ] Paste from CSV
* [ ] Concatenation of Cells
* [ ] Add alignment to cells depending on the header row
* [ ] Make functions available to click on while in a cell
  * [ ] Insert Row Above
  * [ ] Insert Row Below
  * [ ] Insert Column Left
  * [ ] Insert Column Right
  * [ ] Delete Row
  * [ ] Delete Column
