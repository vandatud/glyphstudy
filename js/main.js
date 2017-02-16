require(
  ["utils", "configuration", "tabulate", "logger", "dataprovider"],
  function(Utils, Configuration, Tabulate, Logger, DataProvider) {
    var participant = -1;
    var task = 0;
    var block = 1;
    var condition = 0;
    var finishedConditions = [];
    var trialRunning = false;
    var startTest = new Date();

    /**
     * Draws an array of star plots into #pots div
     * Uses glyph project 
     */
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

    /**
     * Draws an array of flower plots into #plots div
     * Uses glyph project 
     */
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

    /**
     * Draws a seperate explaining glyph with axis description into #plots div
     * Uses glyph project 
     */
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

    /**
     * Displays a table using the tabulate.js / tabulate.css files in the project
     */
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
      Tabulate.printTable(
        DataProvider.data.slice(0, half),
        columns,
        itemClicked
      );
      Tabulate.printTable(
        DataProvider.data.slice(half, Configuration.maxItems),
        columns,
        itemClicked
      );
    }

    /**
     * Clears all displayed data items from the page
     */
    function clear() {
      $("table").remove(".table-fill");
      $("#plots").empty();
    }

    /**
     * Event handler is attached to all event items that are printed
     * on the screen in order to log study data
     */
    function itemClicked(d) {
      if (!trialRunning) return;

      var id = "#event_" + d.RowID;
      if (condition != 1) {
        $(".currentglyph").removeClass("currentglyph");
        $(id).toggleClass("currentglyph");
      } else {
        $(".currentrow").removeClass("currentrow");
        $(id).toggleClass("currentrow");
      }

      var now = new Date();
      var time = Math.abs(now - startTest);
      var accuracy = 0; // TODO: Compare target and selected event!
      Logger.event(
        participant,
        block,
        condition,
        task,
        time,
        accuracy,
        d.RowID
      );

      // TODO: do not log more events / disable click handler?
      trialRunning = false;
    }

    /**
     * Helper function that randomizes the conditions used in the blocks
     */
    function updateCondition() {
      var cond = Math.floor(Math.random() * Configuration.conditions + 1);
      while (finishedConditions.indexOf(cond) >= 0) {
        cond = Math.floor(Math.random() * Configuration.conditions + 1);
      }
      condition = cond;
      finishedConditions.push(condition);
    }

    /**
     * Helper function that displays visualizations of the data 
     * according to the selected condition
     */
    function updateDisplay() {
      if (condition == 1) drawTable();
      if (condition == 2) drawFlowerplot();
      if (condition == 3) drawStarplot();
    }

    /**
     * Function that initializes one task / trial in the study
     */
    function prepareTask() {
      clear();
      var answer = confirm(Configuration.tasksText[task]);
      if (answer) {
        DataProvider.shuffleData();
        updateDisplay();
        trialRunning = true;
        startTest = new Date();
      }
    }

    /**
     * Moves the study one trial / block further
     */
    function advanceStudy() {
      task++;
      if (block == 1 && task == 1) {
        // study begins
        updateCondition();
      }
      if (task > Configuration.tasks) {
        // advance to next block / condition
        task = 1;
        block++;
        if (finishedConditions.length < Configuration.conditions) {
          updateCondition();
        }
      }

      if (block > Configuration.blocks) {
        // study is done
        clear();
        alert(Logger.getEventLog());
        return;
      }

      // log / don't log current study status
      Logger.log(
        "Block: " + block + " Task: " + task + " Condition: " + condition
      );

      // wait for next task / trial to begin
      prepareTask();
    }

    // enable keyboard interaction
    document.addEventListener("keydown", function(event) {
      if (event.keyCode == 49 || event.keyCode == 97) {
        // button 1
        clear();
        condition = 1;
        updateDisplay();
      } else if (event.keyCode == 50 || event.keyCode == 98) {
        // button 2
        clear();
        condition = 2;
        updateDisplay();
      } else if (event.keyCode == 51 || event.keyCode == 99) {
        // button 3
        clear();
        condition = 3;
        updateDisplay();
      } else if (event.keyCode == 32) {
        // space bar
        advanceStudy();
      } else if (event.keyCode == 9) {
        // tab
        // repeat task if something went wrong with rendering / etc.
        prepareTask();
      } else {
        Logger.log("Keycode: " + event.keyCode);
      }
    });

    // parse params from URL / study needs ./index.html?participant={id}
    $(document).ready(function() {
      if (Utils.urlParam("task")) {
        task = parseInt(Utils.urlParam("task"));
      }
      if (Utils.urlParam("condition")) {
        condition = parseInt(Utils.urlParam("condition"));
      }
      if (Utils.urlParam("participant")) {
        participant = parseInt(Utils.urlParam("participant"));
      }
    });
  }
);
