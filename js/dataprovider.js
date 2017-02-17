define(["configuration", "utils"], function(Configuration, Utils) {
  var instance = null;

  function DataProvider() {
    this.fileData = [];
    this.data = [];
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
      var that = this;
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

          var rowCount = rows.length;

          // get headers of the data-columns
          for (let x in rows[0]) {
            pp++;
            if (typeof rows[0][x] === "string") continue;
            labels.push(Utils.translate(x)); // name of the column
            // a linear scale for the current data entry
            accessors.push(function(d) {
              return Configuration.scale(d[x]);
            });
          }

          let result = [];
          for (i = 0; i < Configuration.maxItems; i++) {
            var index = Math.floor(Math.random() * rowCount);
            var item = rows[index];
            while (result.indexOf(item) >= 0) {
              index = Math.floor(Math.random() * rowCount);
              item = rows[index];
            }
            result.push(item);
          }

          that.fileData = rows;
          that.data = result;
          that.labels = labels;
          that.accessors = accessors;
        });
    },
    shuffleData: function() {
      var that = this;
      let result = [];
      var rowCount = that.data.length;
      for (i = 0; i < Configuration.maxItems; i++) {
        var index = Math.floor(Math.random() * rowCount);
        var item = that.fileData[index];
        while (result.indexOf(item) >= 0) {
          index = Math.floor(Math.random() * rowCount);
          item = that.fileData[index];
        }
        result.push(item);
      }
      that.data = result;
    },
    getEventById: function(id) {
      var that = this;
      var result = [];
      that.data.some(function(d, i) {
        if (d.Id == id) {
          result = d;
          return true;
        }
      });
      return result;
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
