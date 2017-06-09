require(
  ["utils", "configuration", "tabulate", "logger", "dataprovider"],
  function(Utils, Configuration, Tabulate, Logger, DataProvider) {
    // identifies the study participant by id / use GET param ./index.html?participant={id}
    var participant = -1;
    // current task of the study - set startTask to number greater 0 you want to force to start with
    var task = 0;
    var startTask = 0;
    var finishedTasks = [];
    var rehearsalTask = false;
    // current block of the study
    var block = 1;
    // current condition which is randomized during the study
    var condition = 0;
    // sequence of conditions can be parameterized by GET param ./index.html?conditions=2,3,1
    var conditions = [1, 2, 3];
    // save the already finished conditions of the study
    var finishedConditions = [];
    // used to pause and disable study functions
    var trialRunning = false;
    // save the start time of each trial / task
    var startTest = new Date();
    // the target for the trial
    var currentTarget = -1;
    // in case we need a reference glyph
    var referenceId = -1;
    // suppress debug output to console
    var debug = true;
    // display variables for glyph game
    var starAccuracy = -1;
    var starBestAccuracy = -1;
    var starTime = -1;
    var starBestTime = -1;
    var flowerAccuracy = -1;
    var flowerBestAccuracy = -1;
    var flowerTime = -1;
    var flowerBestTime = -1;
    var timeout;

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
          .attr("id", Utils.eventElement(d.Id, false))
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
          .attr("id", Utils.eventElement(d.Id, false))
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
      // add div area for explain glyph
      $("#infos").prepend('<div id="explainGlyph"></div>');
      // select glyph type
      if (type == "flower") {
        var glyph = d3
          .flowerPlot()
          .colorRange([
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
            "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
          ])
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
          .colorRange([
            "DDDDDD",
            "DDDDDD",
            "DDDDDD",
            "DDDDDD",
            "DDDDDD",
            "DDDDDD"
          ])
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

      // Find a good reference item to explain axis with values for each category
      // or select reference id
      if (referenceId > -1) {
        DataProvider.data.some(function(d, i) {
          if (d.Id == referenceId) {
            explainItem = d;
            return true;
          }
        });
      } else {
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
            if (debug) Logger.log("Found reference glyph");
            return true;
          }
        });
      }

      // draw the explain glyph
      d3
        .select("#explainGlyph")
        .append("svg")
        .datum(explainItem)
        .attr("class", "chart")
        .attr("width", Configuration.explainPlotWidth)
        .attr("height", Configuration.explainPlotHeight)
        .append("g")
        .call(glyph);

      appendLegend("#infos");
    }

    function appendLegend(elementId) {
      $(elementId).append(
        '<div id="legend">' +
          '<div class="box entertainment"></div><div class="box-explain">Entertainment</div>' +
          '<div class="box sport"></div><div class="box-explain">Sport</div>' +
          '<div class="box bildung"></div><div class="box-explain">Bildung</div>' +
          '<div class="box band"></div><div class="box-explain">Band</div>' +
          '<div class="box tourismus"></div><div class="box-explain">Tourismus</div>' +
          '<div class="box beauty"></div><div class="box-explain">Beauty</div>' +
          "</div>"
      );
      var text = task > 0 ? Configuration.tasksText[task - 1] + " 0" : "";
      if (rehearsalTask) text = Configuration.rehearsalTaskText;
      $(elementId).append('<div id="taskDescription">' + text + "</div>");
      startTime();
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
        "Popularity"
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

      // TODO: Add reference element to side of table
      if (referenceId > -1) {
        var refElement = DataProvider.getEventById(referenceId);
        $("body").append(
          '<div id="referenceElement">' +
            "<span>Preis:</span>" +
            refElement.Price.toFixed(3) +
            "<br />" +
            "<span>Ort:</span>" +
            refElement.Distance.toFixed(3) +
            "<br />" +
            "<span>Zeit:</span>" +
            refElement.Time.toFixed(3) +
            "<br />" +
            "<span>Mit Musik:</span>" +
            refElement.EstimationMusic.toFixed(3) +
            "<br />" +
            "<span>Popularität:</span>" +
            refElement.Popularity.toFixed(3) +
            "</div>"
        );
      }

      $("body").append('<div id="tableLegend"></div>');
      appendLegend("#tableLegend");
    }

    /**
     * Clears all displayed data items from the page
     */
    function clear() {
      $("table").remove(".table-fill");
      $("div").remove("#tableLegend");
      $("div").remove("#referenceElement");
      $("#plots").empty();
      $("#infos").empty();
    }

    /**
     * Event handler is attached to all event items that are printed
     * on the screen in order to log study data
     */
    function itemClicked(d) {
      if (!trialRunning) return;
      if (false) {
        // do some magic with existing CSV files
        for (let idx = 2; idx <= 42; idx++) {
          let fileName = "./data/results/study_" + idx + ".csv";
          d3
            .csv(fileName)
            .row(function(d) {
              // TODO: Some normalization?
              return d;
            })
            .get(function(error, rows) {
              let rowCount = rows.length;

              let result = [];
              for (i = 0; i < rowCount; i++) {
                let item = rows[i];
                // TODO: Calculate accuracy new

                var target = DataProvider.getEventById(item.Target);
                var selected = DataProvider.getEventById(item.SelectedItem);

                if (item.Task >= 21 && item.Task <= 25) {
                  item.Accuracy = (
                    Math.abs(target.Price - selected.Price) +
                    Math.abs(target.Popularity - selected.Popularity) +
                    Math.abs(target.Time - selected.Time) +
                    Math.abs(target.EstimationMusic -selected.EstimationMusic) +
                    Math.abs(target.Distance - selected.Distance)) /
                    5;
                }
                Logger.event(
                  item.Participant,
                  item.Block,
                  item.Condition,
                  item.Task,
                  item.Time,
                  item.Accuracy,
                  item.Error,
                  item.Target,
                  item.SelectedItem
                );
              }
              Logger.log(fileName);
              var log = Logger.getEventLog();
              Logger.log(log.join("\n")); // log to console - better safe than sorry
              Utils.saveTextAsFile(log.join("\n"), "study_" + idx + ".csv");
              Logger.clearEventLog();
            });
        }
        return;
      }

      var id = Utils.eventElement(d.Id);
      if (condition != 1) {
        $(".currentglyph").removeClass("currentglyph");
        $(id).toggleClass("currentglyph");
      } else {
        $(".currentrow").removeClass("currentrow");
        $(id).toggleClass("currentrow");
      }

      var now = new Date();
      var time = Math.abs(now - startTest);
      clearTimeout(timeout);

      // TODO: Compare target and selected event according to selected task!
      var accuracy = 999;
      var error = 0;
      var target = DataProvider.getEventById(currentTarget);

      // Finde die Veranstaltung mit dem Preis!
      //if (task == 1 || task == 6)
      if (task == 1) accuracy = target.Price - d.Price;
      // Finde die Veranstaltung mit der Popularität!
      //if (task == 2 || task == 7) 
      if (task == 2) accuracy = target.Popularity - d.Popularity;
      // Finde die Veranstaltung, Zeitpunkt!
      //if (task == 3 || task == 8) accuracy = target.Time - d.Time;
      // Finde die Veranstaltung, die mit Wahrscheinlichkeit eine Musikveranstaltung!
      //if (task == 4 || task == 9) accuracy = target.EstimationMusic - d.EstimationMusic;
      // Finde die Veranstaltung, Entfernung!
      //if (task == 5 || task == 10) accuracy = target.Distance - d.Distance;

      //if (task >= 11 && task <= 20)
      if (task == 3 || task == 4)
        if (d.Category != target.Category) error = 1;

      // Finde die Veranstaltung aus der Kategorie mit Preis!
      //if (task == 16) accuracy = target.Price - d.Price;
      // Finde die Veranstaltung aus der Kategorie mit Popularität!
      //if (task == 12 || task == 17) accuracy = target.Popularity - d.Popularity;
      // Finde die Veranstaltung aus der Kategorie, Zeitpunkt!
      //if (task == 13 || task == 18) 
      if (task == 3) accuracy = target.Time - d.Time;
      // Finde die Veranstaltung aus der Kategorie, mit Wahrscheinlichkeit eine Musikveranstaltung!
      //if (task == 11 || (task == 14 || task == 19)) accuracy = target.EstimationMusic - d.EstimationMusic;
      // Finde die Veranstaltung aus der Kategorie, Entfernung!
      //if (task == 15 || task == 20)
      if (task == 4) accuracy = target.Distance - d.Distance;

      // find event most similar to given event id
      if (task == 5) {
      //if (task = 21 && task <= 25) {
        accuracy = (
          Math.abs(target.Price - d.Price) +
          Math.abs(target.Popularity - d.Popularity) +
          Math.abs(target.Time - d.Time) +
          Math.abs(target.EstimationMusic - d.EstimationMusic) +
          Math.abs(target.Distance - d.Distance)) /
          5;
      }

      if (!rehearsalTask)
        Logger.event(
          participant,
          block,
          condition,
          task,
          time,
          accuracy,
          error,
          currentTarget,
          d.Id
        );

      if (debug) Logger.log("Accuracy: " + accuracy);
      if (debug) Logger.log("ID Clicked: " + d.Id);

      accuracy = error == 1 ? 10.0 : Math.abs(accuracy);
      if (conditions[block - 1] == 2) {
        flowerAccuracy = flowerAccuracy < 0 ? accuracy : (flowerAccuracy + accuracy) / 2;
        flowerTime = flowerTime < 0 ? time : (flowerTime + time) / 2;
      } else if (conditions[block - 1] == 3) {
        starAccuracy = starAccuracy < 0 ? accuracy : (starAccuracy + accuracy) / 2;
        starTime = starTime < 0 ? time : (starTime + time) / 2;
      }

      // show feedback to the user
      var feedback = "<br /><br />Vielen Dank! Aufgabe beendet. Mit Leertaste geht es weiter.";
      feedback += "<br />Genauigkeit: " + accuracy.toFixed(2) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Geschwindigkeit: " + time + " ms";
      $("#taskDescription").append(feedback);

      // finish rehearsal if necessary
      if (rehearsalTask) {
        rehearsalTask = false;
        finishedTasks = [];
      }
      // do not log more events / disable click handler
      trialRunning = false;
    }

    /**
     * Obsolete: Helper function that randomizes the conditions used in the blocks
     * Randomization is balanced beforehand and configured via URL paramater
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
     * Helper function that randomizes the tasks used in the conditions
     */
    function updateTask() {
      if (finishedTasks.length == Configuration.tasks) return false;

      if (startTask > 0) {
        newTask = startTask;
      } else {
        var newTask = Math.floor(Math.random() * Configuration.tasks + 1);
        while (finishedTasks.indexOf(newTask) >= 0) {
          newTask = Math.floor(Math.random() * Configuration.tasks + 1);
        }
      }
      task = newTask;
      finishedTasks.push(task);

      return true;
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
      DataProvider.shuffleData();

      // Prepare reference glyphs according to task number - maybe use seperate class / module
      // clear reference id for tasks without reference glyph
      if (task <= 15) referenceId = -1;

      // Finde die Veranstaltung mit dem höchsten Preis!
      if (task == 1)
        currentTarget = DataProvider.getEventByHighestAttribute("Price").Id;
      // Finde die Veranstaltung mit der höchsten Popularität!
      // if (task == 2)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "Popularity"
      //   ).Id;
      // Finde die Veranstaltung, die am weitesten zum aktuellen Zeitpunkt entfernt ist!
      // if (task == 3)
      //   currentTarget = DataProvider.getEventByHighestAttribute("Time").Id;
      // Finde die Veranstaltung, die mit höchster Wahrscheinlichkeit eine Musikveranstaltung ist!
      // if (task == 4)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "EstimationMusic"
      //   ).Id;
      // Finde die Veranstaltung, die am weitesten entfernt ist!
      // if (task == 5)
      //   currentTarget = DataProvider.getEventByHighestAttribute("Distance").Id;

      // Finde die Veranstaltung mit dem niedrigsten Preis!
      // if (task == 6)
      //   currentTarget = DataProvider.getEventByLowestAttribute("Price").Id;
      // Finde die Veranstaltung mit der niedrigsten Popularität!
      // if (task == 7)
      if (task == 2)
        currentTarget = DataProvider.getEventByLowestAttribute("Popularity").Id;
      // Finde die Veranstaltung, die am nächsten  zum aktuellen Zeitpunkt liegt!
      // if (task == 8)
      //   currentTarget = DataProvider.getEventByLowestAttribute("Time").Id;
      // Finde die Veranstaltung, die mit niedrigster Wahrscheinlichkeit eine Musikveranstaltung ist!
      // if (task == 9)
      //   currentTarget = DataProvider.getEventByLowestAttribute(
      //     "EstimationMusic"
      //   ).Id;
      // Finde die Veranstaltung, mit der größten Nähe zum aktuellen Ort!
      // if (task == 10)
      //   currentTarget = DataProvider.getEventByLowestAttribute("Distance").Id;

      // Finde die Veranstaltung aus der Kategorie Beauty mit höchster Wahrscheinlichkeit eine Musikveranstaltung!
      // if (task == 11)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "EstimationMusic",
      //     "Beauty"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Entertainment mit der höchsten Popularität!
      // if (task == 12)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "Popularity",
      //     "Entertainment"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Band, die am weitesten zum aktuellen Zeitpunkt entfernt ist!
      if (task == 3)
      // if (task == 13)
        currentTarget = DataProvider.getEventByHighestAttribute(
          "Time",
          "Band"
        ).Id;
      // Finde die Veranstaltung aus der Kategorie Sport, die mit höchster Wahrscheinlichkeit eine Musikveranstaltung ist!
      // if (task == 14)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "EstimationMusic",
      //     "Sport"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Tourismus, die am weitesten entfernt ist!
      // if (task == 15)
      //   currentTarget = DataProvider.getEventByHighestAttribute(
      //     "Distance",
      //     "Tourismus"
      //   ).Id;

      // Finde die Veranstaltung aus der Kategorie Entertainment mit dem niedrigsten Preis!
      // if (task == 16)
      //   currentTarget = DataProvider.getEventByLowestAttribute(
      //     "Price",
      //     "Beauty"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Entertainment mit der höchsten Popularität!
      // if (task == 17)
      //   currentTarget = DataProvider.getEventByLowestAttribute(
      //     "Popularity",
      //     "Entertainment"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Entertainment, die am nächsten  zum aktuellen Zeitpunkt liegt!
      // if (task == 18)
      //   currentTarget = DataProvider.getEventByLowestAttribute(
      //     "Time",
      //     "Band"
      //   ).Id;
      // Finde die Veranstaltung aus der Kategorie Entertainment, die mit niedrigster Wahrscheinlichkeit eine Musikveranstaltung ist!      
      // if (task == 19)
        // currentTarget = DataProvider.getEventByLowestAttribute(
        //   "EstimationMusic",
        //   "Sport"
        // ).Id;
      // Finde die Veranstaltung aus der Kategorie Entertainment, mit der größten Nähe zum aktuellen Ort!
      if (task == 4)
      // if (task == 20)
        currentTarget = DataProvider.getEventByLowestAttribute(
          "Distance",
          "Tourismus"
        ).Id;

      // find event most similar to 785752
      // if (task == 21) {
      if (task == 5) {
        currentTarget = 785752;
        referenceId = currentTarget;
      }

      // find event most similar to 570492
      // if (task == 22) {
      //   currentTarget = 570492;
      //   referenceId = currentTarget;
      // }

      // // find event most similar to 786416
      // if (task == 23) {
      //   currentTarget = 786416;
      //   referenceId = currentTarget;
      // }

      // // find event most similar to 200223
      // if (task == 24) {
      //   currentTarget = 200223;
      //   referenceId = currentTarget;
      // }

      // // find event most similar to 580880
      // if (task == 25) {
      //   currentTarget = 580880;
      //   referenceId = currentTarget;
      // }

      // Break until user clicks OK in confirm
      // TODO: Make a more beautiful alert box
      if (debug) Logger.log(Configuration.tasksText[task - 1]);
      var taskDescription = Configuration.tasksText[task - 1];
      var information = "";
      if (condition == 1)
        information += "\n\nZur Lösung nutzen Sie die Tabelle.";
      if (condition == 2)
        information += "\n\nZur Lösung nutzen Sie die Flowerglyphen.";
      if (condition == 3)
        information += "\n\nZur Lösung nutzen Sie die Starplots.";
      if (rehearsalTask) {
        taskDescription = Configuration.rehearsalTaskText;
        information += "\n\nZunächst ein Probedurchgang. Fragen Sie Ihren Studienleiter um Hilfe!";
        referenceId = -1;
      } else {
        information += "\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[Aufgabe " +
          finishedTasks.length +
          "/" +
          Configuration.tasks +
          "]";
      }
      var answer = confirm(taskDescription + information);
      if (answer) {
        updateDisplay();
        trialRunning = true;
        startTest = new Date();
      }
    }

    /**
     * Moves the study one trial / block further
     */
    function advanceStudy() {
      if (task == 0) {
        condition = conditions[block - 1];
      }
      if (!updateTask()) {
        // advance to next block / condition
        finishedTasks = [];
        updateTask();
        block++;
        if (finishedConditions.length < Configuration.conditions) {
          //updateCondition(); // conditions are randomized beforehand
          condition = conditions[block - 1];
          rehearsalTask = false;
          var log = Logger.getEventLog();
          Logger.log(log.join("\n")); // log to console - better safe than sorry
        }
      }

      if (block > Configuration.blocks) {
        // study is done
        clear();

        starBestAccuracy = starBestAccuracy < 0
          ? starAccuracy
          : starBestAccuracy > starAccuracy
            ? starAccuracy
            : starBestAccuracy;
        starBestTime = starBestTime < 0
          ? starTime
          : starBestTime > starTime
            ? starTime
            : starBestTime;
        flowerBestAccuracy = flowerBestAccuracy < 0
          ? flowerAccuracy
          : flowerBestAccuracy > flowerAccuracy
            ? flowerAccuracy
            : flowerBestAccuracy;
        flowerBestTime = flowerBestTime < 0
          ? flowerTime
          : flowerBestTime > flowerTime
            ? flowerTime
            : flowerBestTime;

        var log = Logger.getEventLog();
        var message = "Vielen Dank!\n\n";
        message += "Starplot:\n\n"
        message += "Durchschnittliche Geschwindigkeit:     " + starTime + " ms\n";
        message += "Beste Geschwindigkeit:                          " + starBestTime + " ms\n";
        message += "Durchschnittliche Genauigkeit:             " + starAccuracy.toFixed(2) + "\n";
        message += "Beste Genauigkeit:                                  " + starBestAccuracy.toFixed(2) + "\n\n\n";
        message += "Flowerglyph:\n\n"
        message += "Durchschnittliche Geschwindigkeit:     " + flowerTime + " ms\n";
        message += "Beste Geschwindigkeit:                          " + flowerBestTime + " ms\n";
        message += "Durchschnittliche Genauigkeit:             " + flowerAccuracy.toFixed(2) + "\n";
        message += "Beste Genauigkeit:                                  " + flowerBestAccuracy.toFixed(2) + "\n\n\n";
        confirm(message);

        Utils.saveTextAsFile(log.join("\n"), "study_" + participant + ".csv");
        Logger.log(log.join("\n")); // log to console - better safe than sorry
        $("#taskDescription").append("<h1>Geschafft! Studie beendet.</h1>");
        participant++;
        task = 0;
        startTask = 0;
        finishedTasks = [];
        block = 1;
        condition = 0;
        conditions = conditions[0] == 2 ? [3, 2] : [2, 3];
        finishedConditions = [];
        trialRunning = false;
        startTest = new Date();
        currentTarget = -1;
        referenceId = -1;
        starAccuracy = -1;
        starTime = -1;
        flowerAccuracy = -1;
        flowerTime = -1;
        showInitialInstructions();
        return;
      }

      // log / don't log current study status
      if (debug)
        Logger.log(
          "Block: " + block + " Task: " + task + " Condition: " + condition
        );

      // wait for next task / trial to begin
      prepareTask();
    }

    function highlightTarget(id) {
      $(Utils.eventElement(id)).toggleClass("highlightGlyph");
    }

    function showInitialInstructions() {
      $("#plots").append(
        "<h1>Spiel bereit<br /><br />Teilnehmernummer: " +
          participant +
          "<br />Blöcke: " +
          Configuration.blocks +
          "<br />Aufgaben pro Block: " +
          Configuration.tasks +
          "<br /><br />&lt;Leertaste&gt; um zu beginnen.</h1>"
      );
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
        if (trialRunning) return;
        advanceStudy();
      } else if (event.keyCode == 9) {
        // tab
        // repeat task if something went wrong with rendering / etc.
        if (!trialRunning) Logger.removeLastEvent();
        prepareTask();
      } else if (event.keyCode == 173) {
        // "-" key
        highlightTarget(currentTarget);
      } else {
        if (debug) Logger.log("Keycode: " + event.keyCode);
      }
    });

    function startTime() {
        var now = new Date();
        var text = document.getElementById('taskDescription').innerHTML;
        var lastIndex = text.lastIndexOf(" ");
        text = text.substring(0, lastIndex);
        document.getElementById('taskDescription').innerHTML = text + " " + Math.abs(now - startTest);
        timeout = setTimeout(startTime, 500);
    }

    // parse params from URL / study needs ./index.html?participant={id}
    $(document).ready(function() {
      if (Utils.urlParam("nodebug")) {
        //task = parseInt(Utils.urlParam("task"));
        debug = false;
      }
      if (Utils.urlParam("task")) {
        task = parseInt(Utils.urlParam("task"));
      }
      if (Utils.urlParam("conditions")) {
        conditions = Utils.urlParam("conditions").split(",");
      }
      if (Utils.urlParam("participant")) {
        participant = parseInt(Utils.urlParam("participant"));
      }
      if (participant < 0) participant = 1;

      // TODO: Parse URL params for continuation of a trial like &finishedTasks=1,2,3&finishedConditions=2,1

      // Show initial study instructions
      showInitialInstructions();
    });
  }
);
