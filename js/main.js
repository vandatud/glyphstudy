var margin = {
  top: 36,
  right: 50,
  bottom: 20,
  left: 50
};

var width = 240 - margin.left - margin.right;
var height = 240 - margin.top - margin.bottom;
var labelMargin = 8;

var scale = d3.scaleLinear()
  .domain([0, 999])
  .range([0, 100])

function drawFlowerplot(noOfRows) {
  d3.csv('data/events.csv')
    .row(function(d) { // all values are set to their absolutes Id,Title,Price,Distance,Time,EstimationMusic,Popularity,Category
        d.Price = +d.Price;
        d.Distance = +d.Distance;
        d.Time = +d.Time;
        d.EstimationMusic = +d.EstimationMusic;
        d.Popularity = +d.Popularity;
        return d;
    })
    .get(function(error, rows) {
      let labels = [];
      let accessors = [];
      let pp = 0;

      // get headers of the data-columns
      for (let x in rows[0]) {
        pp++;
        labels.push(x); // name of the column
        // a linear scale for the current data entry
        accessors.push(function(d) { return scale(d[x]); })
      }

      // setup the flower's attributes
      var flower = d3.flowerPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .includeLabels(false)
        .title(function(d) { return d.Distillery; }) // unique to whiskies.csv
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function(d, i) {

        if (i > 11) return;

        // draw the flower
        d3.select('#plots').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
            .datum(d)
            .call(flower)
      });
    });
}

function drawTable() {
      d3.csv('data/events.csv',function (data) {
      var columns = ['RowID','Title','Price','Distance','Time','EstimationMusic','Popularity','Category']
      tabulate(data,columns)
    })
}

function clear() {
  $("table").remove(".table-fill");
  $("#plots").empty();
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 49 || event.keyCode == 97) {
      clear();
      drawTable();
    }
    else if(event.keyCode == 50 || event.keyCode == 98) {
        clear();
        drawFlowerplot(5);
    }
    else {
      console.debug("Keycode: " + event.keyCode);
    }
});

drawTable();