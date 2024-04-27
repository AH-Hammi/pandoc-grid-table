# pandoc-grid-table README


Grid Table

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

Berechne die Summe von Spalte 1 und 2 der vorherigen Tabelle und vergleiche diese mit der Summe der aktuellen

Vergleiche Breite Zelle 1 der Tabelle 1 mit Zelle 1 Tabelle 2
Wenn die Breite == so gehe weiter zur 

Ist die aktuelle Zelle gleich der nachfolgenden Tabelle, wenn nicht so vergleiche:
    wenn nachfolgende Zelle > als aktuelle ist, so addiere die nachfolgende Zelle +1 zu der aktuelle und vergleiche die Summe.
      mache dies bis die Summe == ist

+--------------+
| Header 1     |
+======+=======+
| test | Row 2 |
+------+-------+


This is the README for your extension "pandoc-grid-table". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
