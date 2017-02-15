require(
  ["utils", "configuration", "tabulate", "logger", "dataprovider"],
  function(Utils, Configuration, Tabulate, Logger, DataProvider) {
    function drawStarplot() {
      var star = d3
        .starPlot()
        .width(Configuration.width)
        .accessors(DataProvider.accessors)
        .labels(DataProvider.labels)
        .includeLabels(false)
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
          .attr("id", "event_" + d.RowID)
          .attr("class", "chart")
          .attr("width", Configuration.plotWidth)
          .attr("height", Configuration.plotHeight)
          .on("click", function(d) {
            itemClicked(d);
          })
          .append("g")
          .call(star);
      });

      drawExplainGlyph("star");
    }

    function drawFlowerplot() {
      // setup the flower's attributes
      var flower = d3
        .flowerPlot()
        .width(Configuration.width)
        .accessors(DataProvider.accessors)
        .labels(DataProvider.labels)
        .includeLabels(false)
        .title(function(d) {
          return d.Title;
        })
        .margin(Configuration.margin)
        .labelMargin(Configuration.labelMargin);

      DataProvider.data.forEach(function(d, i) {
        // draw the flower
        d3
          .select("#plots")
          .append("svg")
          .datum(d)
          .attr("id", "event_" + d.RowID)
          .attr("class", "chart")
          .attr("width", Configuration.plotWidth)
          .attr("height", Configuration.plotHeight)
          .on("click", function(d) {
            itemClicked(d);
          })
          .append("g")
          .call(flower);
      });

      drawExplainGlyph("flower");
    }

    function drawExplainGlyph(type) {
      $("#plots").prepend('<div id="explainGlyph"></div>');
      if (type == "flower") {
        var glyph = d3
          .flowerPlot()
          .width(Configuration.explainWidth)
          .accessors(DataProvider.accessors)
          .labels(DataProvider.labels)
          .includeLabels(true)
          .title(function(d) {
            return "";
          })
          .margin(Configuration.explainMargin)
          .labelMargin(Configuration.explainLabelMargin);
      }
      if (type == "star") {
        var glyph = d3
          .starPlot()
          .width(Configuration.explainWidth)
          .accessors(DataProvider.accessors)
          .labels(DataProvider.labels)
          .includeLabels(true)
          .title(function(d) {
            return "";
          })
          .margin(Configuration.explainMargin)
          .labelMargin(Configuration.explainLabelMargin);
      }

      DataProvider.data.some(function(d, i) {
        if (
          d.Price > 3 &&
            d.EstimationMusic > 1 &&
            d.Distance > 1 &&
            d.Time > 1 &&
            d.Popularity > 1
        ) {
          d3
            .select("#explainGlyph")
            .append("svg")
            .datum(d)
            .attr("class", "chart")
            .attr("width", Configuration.explainPlotWidth)
            .attr("height", Configuration.explainPlotHeight)
            .on("click", function(d) {
              //itemClicked(d);
            })
            .append("g")
            .call(glyph);
          return true;
        }
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
      var half = Configuration.maxItems / 2;
      Logger.log("Half: " + half);
      Tabulate.printTable(DataProvider.data.slice(0, half), columns);
      Tabulate.printTable(
        DataProvider.data.slice(half, Configuration.maxItems),
        columns
      );
    }

    function clear() {
      //$("#explainGlyph").hide();
      $("table").remove(".table-fill");
      $("#plots").empty();
      $("#explainGlyph").empty();
    }

    function itemClicked(d) {
      Logger.debug("Click: " + d.toSource());
      var id = "#event_" + d.RowID;
      $(".currentglyph").removeClass("currentglyph");
      $(id).toggleClass("currentglyph");
    }

    document.addEventListener("keydown", function(event) {
      if (event.keyCode == 49 || event.keyCode == 97) {
        clear();
        drawTable();
      } else if (event.keyCode == 50 || event.keyCode == 98) {
        clear();
        drawFlowerplot();
      } else if (event.keyCode == 51 || event.keyCode == 99) {
        clear();
        drawStarplot();
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
      if (aufgabe == 2) drawFlowerplot();
      if (aufgabe == 3) drawStarplot();

      Logger.log("Selected Task: " + aufgabe);
    });
  }
);
