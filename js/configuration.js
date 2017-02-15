define(function() {
  var margin = {
    top: 26,
    right: 30,
    bottom: 10,
    left: 30
  };

  var width = 150 - margin.left - margin.right;
  var height = 150 - margin.top - margin.bottom;
  var labelMargin = 8;

  var scale = d3.scaleLinear().domain([0, 10]).range([0, 100]);

  var plotWidth = width + margin.left + margin.right;
  var plotHeight = width + margin.top + margin.bottom;

  return {
    margin: margin,
    width: width,
    labelMargin: labelMargin,
    scale: scale,
    plotWidth: plotWidth,
    plotHeight: plotHeight
  };
});
