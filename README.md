# Glyph Study Project

Comparing tabular data and glyphs. Place git project "glyphs" next to project "glyphstudy" to work.

## JavaScript Libraries

Loading local files with http://requirejs.org/ via Text plugin http://requirejs.org/docs/api.html#text

## Data Cleaning

### Mit JQ aus JSON JSONLines machen

```
jq-win64.exe -c ".[]" events.json > events.jsonlines
```

Link: https://stedolan.github.io/jq/download/

### Mit Visual Code

Online Regex-Tester: https://regex101.com/

#### Ein Anführungszeichen innerhalb einer """{Zeichenkette}""" finden und ersetzen.
Finden (Regex): `(""")([^"]+)(")+([^"]+)(""")`
Ersetzen: `$1$2$4$5`

#### Zwei Anführungszeichen innerhalb einer """{Zeichenkette}""" finden und ersetzen.
Finden (Regex): `(""")([^"]+)(")+(.*)(")+([^"]+)(""")`
Ersetzen: `$1$2$4$6$7`