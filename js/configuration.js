define(function() {
  var margin = {
    top: 15,
    right: 17,
    bottom: 15,
    left: 17
  };

  // var width = 80 - margin.left - margin.right;
  // var height = 80 - margin.top - margin.bottom;
  var width = 75;
  var height = 75;
  var labelMargin = 8;

  var plotWidth = width + margin.left + margin.right;
  var plotHeight = width + margin.top + margin.bottom;

  var explainMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var explainWidth = 320 - explainMargin.left - explainMargin.right;
  var explainHeight = 320 - explainMargin.top - explainMargin.bottom;
  var explainLabelMargin = 30;

  var explainPlotWidth = explainWidth +
    explainMargin.left +
    explainMargin.right;
  var explainPlotHeight = explainHeight +
    explainMargin.top +
    explainMargin.bottom;

  var scale = d3.scaleLinear().domain([0, 10]).range([0, 100]);

  return {
    margin: margin,
    width: width,
    labelMargin: labelMargin,
    scale: scale,
    plotWidth: plotWidth,
    plotHeight: plotHeight,
    explainMargin: explainMargin,
    explainWidth: explainWidth,
    explainHeight: explainHeight,
    explainLabelMargin: explainLabelMargin,
    explainPlotWidth: explainPlotWidth,
    explainPlotHeight: explainPlotHeight,
    maxItems: 226,
    conditions: 3,
    tasks: 25,
    blocks: 3,
    rehearsalTaskText: "Finde eine Veranstaltung aus der Kategorie Entertainment, deren Preis möglichst hoch ist!",
    tasksText: [
      "Finde eine Veranstaltung, die einen möglichst hohen Preis hat!",
      "Finde eine Veranstaltung, deren Popularität möglichst hoch ist!",
      "Finde eine Veranstaltung, die zu einem möglichst weit entfernten Zeitpunkt stattfindet!",
      "Finde eine Veranstaltung, die mit möglichst hoher Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde eine Veranstaltung, deren Ort möglichst weit entfernt von Dresden ist!",

      "Finde eine Veranstaltung, die einen möglichst niedrigen Preis hat!",
      "Finde eine Veranstaltung, deren Popularität sehr niedrig ist!",
      "Finde eine Veranstaltung, die zu einem möglichst nahen Zeitpunkt stattfindet!",
      "Finde eine Veranstaltung, die mit möglichst niedriger Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde eine Veranstaltung, die in möglichst naher Entfernung zu Dresden liegt!",

      "Finde eine Veranstaltung aus der Kategorie Beauty, die mit höchster Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde eine Veranstaltung aus der Kategorie Entertainment, deren Popularität möglichst hoch ist!",
      "Finde eine Veranstaltung aus der Kategorie Band, die zu einem möglichst weit entfernten Zeitpunkt stattfindet!",
      "Finde eine Veranstaltung aus der Kategorie Sport, die mit möglichst hoher Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde eine Veranstaltung aus der Kategorie Tourismus, deren Ort möglichst weit entfernt von Dresden ist!",

      "Finde eine Veranstaltung aus der Kategorie Beauty mit einen möglichst niedrigen Preis!",
      "Finde eine Veranstaltung aus der Kategorie Entertainment, deren Popularität möglichst niedrig ist!",
      "Finde eine Veranstaltung aus der Kategorie Band, die zu einem möglichst nahen Zeitpunkt stattfindet!",
      "Finde eine Veranstaltung aus der Kategorie Sport, die mit möglichst niedriger Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde eine Veranstaltung aus der Kategorie Tourismus, deren Ort möglichst nah an Dresden ist!",

      "Finde eine Veranstaltung, die möglichst ähnlich zu der angegebenen ist.",
      "Finde eine Veranstaltung, die möglichst ähnlich zu der angegebenen ist.",
      "Finde eine Veranstaltung, die möglichst ähnlich zu der angegebenen ist.",
      "Finde eine Veranstaltung, die möglichst ähnlich zu der angegebenen ist.",
      "Finde eine Veranstaltung, die möglichst ähnlich zu der angegebenen ist.",
    ]
  };
});
