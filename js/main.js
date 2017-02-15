require(
  ["utils", "configuration", "tabulate", "logger", "dataprovider"],
  function(Utils, Configuration, Tabulate, Logger, DataProvider) {
    var task = 0;
    var block = 1;
    var condition = 0;
    var finishedConditions = [];
    var startTest = new Date();

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

      var explainItem = DataProvider.data[0];

      DataProvider.data.some(function(d, i) {
        explainItem = d;
        if (
          d.Price > 3 &&
            d.EstimationMusic > 1 &&
            d.Distance > 1 &&
            d.Time > 1 &&
            d.Popularity > 1
        ) {
          explainItem = d;
          Logger.log("Found reference glyph");
          return true;
        }
      });

      d3
        .select("#explainGlyph")
        .append("svg")
        .datum(explainItem)
        .attr("class", "chart")
        .attr("width", Configuration.explainPlotWidth)
        .attr("height", Configuration.explainPlotHeight)
        .append("g")
        .call(glyph);
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
      Tabulate.printTable(DataProvider.data.slice(0, half), columns, itemClicked);
      Tabulate.printTable(
        DataProvider.data.slice(half, Configuration.maxItems),
        columns, itemClicked
      );
    }

    function clear() {
      $("table").remove(".table-fill");
      $("#plots").empty();
      $("#explainGlyph").empty();
    }

    function itemClicked(d) {
      var id = "#event_" + d.RowID;
      if (condition != 1) {
        $(".currentglyph").removeClass("currentglyph");
        $(id).toggleClass("currentglyph");
      } else {
        $(".currentrow").removeClass("currentrow");
        $(id).toggleClass("currentrow");
      }
      
      var now = new Date();
      Logger.debug("Click: " + d.toSource());
      Logger.log("Time: " + Math.abs(now - startTest));

      // TODO: Log to file!!!
    }

    function updateCondition() {
      var cond = Math.floor(Math.random() * Configuration.conditions + 1);
      while (finishedConditions.indexOf(cond) >= 0) {
        cond = Math.floor(Math.random() * Configuration.conditions + 1);
      }
      condition = cond;
      finishedConditions.push(condition);
    }

    function updateDisplay() {
      if (condition == 1) drawTable();
      if (condition == 2) drawFlowerplot();
      if (condition == 3) drawStarplot();
    }

    document.addEventListener("keydown", function(event) {
      if (event.keyCode == 49 || event.keyCode == 97) {
        clear();
        condition = 1;
        updateDisplay()
      } else if (event.keyCode == 50 || event.keyCode == 98) {
        clear();
        condition = 2;
        updateDisplay()
      } else if (event.keyCode == 51 || event.keyCode == 99) {
        clear();
        condition = 3;
        updateDisplay()
      } else if (event.keyCode == 32) {
        task++;
        if (block == 1 && task == 1) {
          updateCondition();
        }
        if (task > Configuration.tasks) {
          task = 1;
          block++;
          if (finishedConditions.length < Configuration.conditions) {
            updateCondition();
          }
        }

        if (block > Configuration.blocks) {
          clear();
          return;
        }

        Logger.log(
          "Block: " + block + " Task: " + task + " Condition: " + condition
        );

        clear();
        var answer = confirm(Configuration.tasksText[task]);
        if (answer) {
          DataProvider.shuffleData();
          updateDisplay();
          startTest = new Date();
        }

      } else {
        Logger.log("Keycode: " + event.keyCode);
      }
    });

    $(document).ready(function() {
      if (Utils.urlParam("task")) {
        task = parseInt(Utils.urlParam("task"));
      }
      if (Utils.urlParam("condition")) {
        condition = parseInt(Utils.urlParam("condition"));
      }
    });
  }
);
