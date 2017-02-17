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
  var explainLabelMargin = 26;

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
    tasks: 12,
    blocks: 3,
    tasksText: [
      "Finde die Veranstaltung mit dem höchsten Preis!",
      "Finde die Veranstaltung, die am nächsten zum aktuellen Zeitpunkt liegt!",
      "Finde die Veranstaltung aus der Kategorie Health/Beauty, die mit höchster Wahrscheinlichkeit eine Musikveranstaltung ist!",
      "Finde die Veranstaltung aus der Kategorie Entertainment, die den niedrigsten Wert bei Popularität hat.",
      "Welche Veranstaltung hat in jeder Eigenschaft die niedrigsten Werte?",
      "Welche Veranstaltung hat in jeder Eigenschaft die höchsten Werte?",
      "Finde die Veranstaltung,die am ähnlichsten zu der angegebenen ist.",
      "Finde die Veranstaltung,die am ähnlichsten zu der angegebenen ist.",
      "Finde die Veranstaltung,die am ähnlichsten zu der angegebenen ist.",
      "Finde die ähnlichste Veranstaltung zu der angegebenen aber mit einem günstigeren Preis!",
      "Finde die ähnlichste Veranstaltung zu der angegebenen aber mehr in deiner Nähe!",
      "Finde die ähnlichste Veranstaltung zu der angegebenen, die aber populärer ist!"
    ]
  };
});
