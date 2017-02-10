var margin = {
  top: 36,
  right: 50,
  bottom: 20,
  left: 50
};

var width = 150 - margin.left - margin.right;
var height = 150 - margin.top - margin.bottom;
var labelMargin = 8;

var scale = d3.scaleLinear()
  .domain([0, 999])
  .range([0, 100])

function drawStarplot(noOfRows) {
  d3.csv('data/out.csv')
    .row(function (d) {
      d.Price = +d.Price;
      d.Distance = +d.Distance;
      d.Time = +d.Time;
      d.EstimationMusic = +d.EstimationMusic;
      d.Popularity = +d.Popularity;
      return d;
    })
    .get(function (error, rows) {
      let labels = [];
      let accessors = [];
      let pp = 0;
      for (let x in rows[0]) {
        pp++;
        if (x == 'RowID' || x == 'Category') continue; // TODO: Make this configurable?
        labels.push(x);
        accessors.push(function (d) { return scale(d[x]); })
      }

      var star = d3.starPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .includeLabels(false)
        .title(function (d) { return d.Title; })
        .margin(margin)
        .labelMargin(labelMargin)

      rows.forEach(function (d, i) {

        if (i > 200) return; // draw 4 starplots (4 rows of data)

        d3.select('#plots').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
          .datum(d)
          .call(star)
          .on("click", function (d) {
            console.debug("Click: " + d.toSource());
            // TODO: log selection of row
          })
      });
    });
}

function drawFlowerplot(noOfRows) {
  d3.csv('data/out.csv')
    .row(function (d) { // all values are set to their absolutes Id,Title,Price,Distance,Time,EstimationMusic,Popularity,Category
      d.Price = +d.Price;
      d.Distance = +d.Distance;
      d.Time = +d.Time;
      d.EstimationMusic = +d.EstimationMusic;
      d.Popularity = +d.Popularity;
      return d;
    })
    .get(function (error, rows) {
      let labels = [];
      let accessors = [];
      let pp = 0;

      // get headers of the data-columns
      for (let x in rows[0]) {
        pp++;
        if (x == 'RowID' || x == 'Category') continue; // TODO: Make this configurable?
        labels.push(x); // name of the column
        // a linear scale for the current data entry
        accessors.push(function (d) { return scale(d[x]); })
      }

      // setup the flower's attributes
      var flower = d3.flowerPlot()
        .width(width)
        .accessors(accessors)
        .labels(labels)
        .includeLabels(false)
        .title(function (d) { return d.Title; }) // unique to whiskies.csv
        .margin(margin)
        .labelMargin(labelMargin)


      rows.forEach(function (d, i) {

        if (i > 200) return;

        // draw the flower
        d3.select('#plots').append('svg')
          .attr('class', 'chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', width + margin.top + margin.bottom)
          .append('g')
          .datum(d)
          .call(flower)
          .on("click", function (d) {
            console.debug("Click: " + d.toSource());
          })
      });
    });
}

function drawTable() {
  d3.csv('data/out.csv', function (data) {
    // only take some rows from csv
    data = data.filter(function (row) {
      return row['RowID'] < '19000' && row['Distance'] > '-1' && row['Category'] != 'none';
    })
    var columns = ['RowID', 'Title', 'Price', 'Distance', 'Time', 'EstimationMusic', 'Popularity', 'Category']
    tabulate(data, columns)
  })
}

function clear() {
  $("table").remove(".table-fill");
  $("#plots").empty();
}

document.addEventListener('keydown', function (event) {
  if (event.keyCode == 49 || event.keyCode == 97) {
    clear();
    drawTable();
  }
  else if (event.keyCode == 50 || event.keyCode == 98) {
    clear();
    drawFlowerplot(5);
  }
  else if (event.keyCode == 51 || event.keyCode == 99) {
    clear();
    drawStarplot(5);
  }
  else {
    console.debug("Keycode: " + event.keyCode);
  }
});

drawTable();