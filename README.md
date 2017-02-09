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