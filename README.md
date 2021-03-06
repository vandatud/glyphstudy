# Glyph Study Project

Comparing tabular data and glyphs. 

Place git projects 

* [glyphs](https://gitlab.mg.inf.tu-dresden.de/vanda/glyphs)
* [glyphstudy](https://gitlab.mg.inf.tu-dresden.de/vanda/glyphstudy) 

next to each other to work. Resulting in a directory structure like this:

```
projects/
├── glyphs/
│   ├── css/
│   └── js/
└── glyphstudy/
    ├── css/
    ├── data/  --> study data
    └── js/
```

## JavaScript Libraries

### RequireJS zum Laden von Skripten und JSON

Loading local files with http://requirejs.org/ via Text plugin http://requirejs.org/docs/api.html#text

```JavaScript
require(['text!../data/events.json'], function (events) {
 var json = JSON.parse(events);
 alert (json[0]._source.foundEventNamesAsString);
});
```

### tabulate.js

Tabellen mit D3 plotten: http://bl.ocks.org/jfreels/6814721

Table Styles: http://codepen.io/alassetter/pen/cyrfB

## Data Cleaning

### Mit JQ aus JSON JSONLines machen

```
jq-win64.exe -c ".[]" events.json > events.jsonlines
```

Link: https://stedolan.github.io/jq/download/

### Mit Visual Code

Online Regex-Tester: https://regex101.com/

#### Ein Anführungszeichen innerhalb einer """{Zeichenkette}""" finden und ersetzen.

* Finden (Regex): `(""")([^"]+)(")+([^"]+)(""")`
* Ersetzen: `$1$2$4$5`

#### Zwei Anführungszeichen innerhalb einer """{Zeichenkette}""" finden und ersetzen.

* Finden (Regex): `(""")([^"]+)(")+(.*)(")+([^"]+)(""")`
* Ersetzen: `$1$2$4$6$7`