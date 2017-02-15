define(["configuration"], function(Configuration) {
  var instance = null;

  function DataProvider() {
    this.data = ["Test"];
    this.accessors = [];
    this.labels = [];

    if (instance !== null) {
      throw new Error(
        "Cannot instantiate more than one DataProvider, use DataProvider.getInstance()"
      );
    }

    this.initialize();
  }
  DataProvider.prototype = {
    initialize: function() {
      var that=this;
      // summary:
      //      Initializes the singleton.

      d3
        .csv("./data/cleaned.csv")
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
          let pp = 0;
          let labels = [];
          let accessors = [];
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

          that.data = rows.slice(0,Configuration.maxItems);
          that.labels = labels;
          that.accessors = accessors;
        });
    }
  };

  DataProvider.getInstance = function() {
    // summary:
    //      Gets an instance of the singleton. It is better to use
    if (instance === null) {
      instance = new DataProvider();
    }
    return instance;
  };

  return DataProvider.getInstance();
});
