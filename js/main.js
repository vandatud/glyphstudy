require(
  ["utils", "configuration", "tabulate", "logger", "dataprovider"],
  function(Utils, Configuration, Tabulate, Logger, DataProvider) {
    function drawStarplot() {
      var star = d3
        .starPlot()
        .width(Configuration.width)
        .accessors(DataProvider.accessors)
        .labels(DataProvider.labels)
        .includeLabels(true)
        .title(function(d) {
          return d.Title;
        })
        .margin(Configuration.margin)
        .labelMargin(Configuration.labelMargin);

      DataProvider.data.forEach(function(d, i) {
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
    }

    function drawFlowerplot() {
      // setup the flower's attributes
      var flower = d3
        .flowerPlot()
        .width(Configuration.width)
        .accessors(DataProvider.accessors)
        .labels(DataProvider.labels)
        .includeLabels(true)
        .title(function(d) {
          return d.Title;
        }) // unique to whiskies.csv
        .margin(Configuration.margin)
        .labelMargin(Configuration.labelMargin);

      DataProvider.data.forEach(function(d, i) {
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
    }

    function drawTable() {
      var columns = [
        "Price",
        "Distance",
        "Time",
        "EstimationMusic",
        "Popularity",
        "Category"
      ];
      Tabulate.printTable(DataProvider.data, columns);
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
      aufgabe = 1;

      if (Utils.urlParam("aufgabe")) {
        aufgabe = parseInt(Utils.urlParam("aufgabe").split("_")[0]);
        subAufgabe = Utils.urlParam("aufgabe").split("_")[1];
      }

      if (aufgabe == 1) drawTable();
      if (aufgabe == 2) drawFlowerplot(5);
      if (aufgabe == 3) drawStarplot(5);

      Logger.log("Selected Task: " + aufgabe);
    });
  }
);
