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
