require(["utils", "configuration", "tabulate", "logger", "dataprovider"], function(Utils, Configuration, Tabulate, Logger, DataProvider) {
  function drawStarplot() {
    d3
      .csv("data/out.csv")
      .row(function(d) {
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
        for (let x in rows[0]) {
          pp++;
          if (typeof rows[0][x] === "string") continue;
          if (x == "RowID" || x == "Category") continue; // TODO: Make this configurable?
          labels.push(x);
          accessors.push(function(d) {
            return Configuration.scale(d[x]);
          });
        }

        var star = d3
          .starPlot()
          .width(Configuration.width)
          .accessors(accessors)
          .labels(labels)
          .includeLabels(true)
          .title(function(d) {
            return d.Title;
          })
          .margin(Configuration.margin)
          .labelMargin(Configuration.labelMargin);

        rows.forEach(function(d, i) {
          if (i > 200) return; // draw 4 starplots (4 rows of data)

          d3
            .select("#plots")
            .append("svg")
            .datum(d)
            .attr("class", "chart")
            .attr("width", Configuration.plotWidth)
            .attr("height", Configuration.plotHeight)
            .on("click", function(d) {
              Logger.debug("Click: " + d.toSource());
              // TODO: log selection of row
            })
            .append("g")
            .call(star);
        });
      });
  }

  function drawFlowerplot() {
    d3
      .csv("data/out.csv")
      .row(function(d) {
        // all values are set to their absolutes Id,Title,Price,Distance,Time,EstimationMusic,Popularity,Category
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
          if (typeof rows[0][x] === "string") continue;
          if (x == "RowID" || x == "Category") continue; // TODO: Make this configurable?
          labels.push(x); // name of the column
          // a linear scale for the current data entry
          accessors.push(function(d) {
            return Configuration.scale(d[x]);
          });
        }

        // setup the flower's attributes
        var flower = d3
          .flowerPlot()
          .width(Configuration.width)
          .accessors(accessors)
          .labels(labels)
          .includeLabels(true)
          .title(function(d) {
            return d.Title;
          }) // unique to whiskies.csv
          .margin(Configuration.margin)
          .labelMargin(Configuration.labelMargin);

        rows.forEach(function(d, i) {
          if (i > 200) return;

          // draw the flower
          d3
            .select("#plots")
            .append("svg")
            .datum(d)
            .attr("class", "chart")
            .attr("width", Configuration.plotWidth)
            .attr("height", Configuration.plotHeight)
            .on("click", function(d) {
              Logger.debug("Click: " + d.toSource());
            })
            .append("g")
            .call(flower);
        });
      });
  }

  function drawTable() {
    d3.csv("data/out.csv", function(data) {
      // only take some rows from csv
      data = data.filter(function(row) {
        return row["RowID"] < "19000" &&
          row["Distance"] > "-1" &&
          row["Category"] != "none";
      });
      var columns = [
        "Price",
        "Distance",
        "Time",
        "EstimationMusic",
        "Popularity",
        "Category"
      ];
      Tabulate.printTable(data, columns);
    });
  }

  function clear() {
    $("table").remove(".table-fill");
    $("#plots").empty();
  }

  document.addEventListener("keydown", function(event) {
    if (event.keyCode == 49 || event.keyCode == 97) {
      clear();
      drawTable();
    } else if (event.keyCode == 50 || event.keyCode == 98) {
      clear();
      drawFlowerplot(5);
    } else if (event.keyCode == 51 || event.keyCode == 99) {
      clear();
      drawStarplot(5);
    } else {
      console.debug("Keycode: " + event.keyCode);
    }
  });

  $(document).ready(function() {
    
    if (Utils.urlParam("aufgabe")) {
      aufgabe = parseInt(Utils.urlParam("aufgabe").split("_")[0]);
      subAufgabe = Utils.urlParam("aufgabe").split("_")[1];
    }

    if (aufgabe == 1) drawTable();
    if (aufgabe == 2) drawFlowerplot(5);
    if (aufgabe == 3) drawStarplot(5);

    Logger.log("Selected Task: " + aufgabe)
  });
});
