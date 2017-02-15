define(function() {
  var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

 // var width = 80 - margin.left - margin.right;
//  var height = 80 - margin.top - margin.bottom;
  var width = 50;
  var height = 50;
  var labelMargin = 8;

  var plotWidth = width + margin.left + margin.right;
  var plotHeight = width + margin.top + margin.bottom;

  var explainMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var explainWidth = 350 - explainMargin.left - explainMargin.right;
  var explainHeight = 350 - explainMargin.top - explainMargin.bottom;
  var explainLabelMargin = 26;

  var explainPlotWidth = explainWidth + explainMargin.left + explainMargin.right;
  var explainPlotHeight = explainHeight + explainMargin.top + explainMargin.bottom;  

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
    maxItems: 226
  };
});
