define(["logger"], function(Logger) {
  var tabulate = {
    printTable: function(data, columns, callback) {
      var colorDomain = [
        "arts/entertainment/nightlife",
        "sports/recreation/activities",
        "education",
        "musician/band",
        "tours/sightseeing",
        "health/beauty"
      ];
      var colorRange = [
        "artsrow",
        "sportsrow",
        "educationrow",
        "musicianrow",
        "toursrow",
        "healthrow"
      ];

      var table = d3.select("body").append("table").attr("class", "table-fill");
      var thead = table.append("thead");
      var tbody = table.append("tbody");

      thead
        .append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(d) {
          return d;
        });

      var rows = tbody
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("id", function(d) {
          return "event_" + d.RowID;
        })
        .attr("class", function(d) {
          var index = colorDomain.indexOf(d.Category);
          return colorRange[index];
        })
        .on("click", function(d) {
          callback(d);
        });

      var cells = rows
        .selectAll("td")
        .data(function(row) {
          return columns.map(function(column) {
            var output = row[column];
            var dbl = parseFloat(row[column]);
            if (!isNaN(dbl)) {
              output = dbl.toFixed(3);
            }
            return { column: column, value: output };
          });
        })
        .enter()
        .append("td")
        .text(function(d) {
          return d.value;
        });

      return table;
    }
  };
  return tabulate;
});
