var tabulate = function (data,columns) {
  var table = d3.select('body').append('table').attr('class', 'table-fill')
	var thead = table.append('thead')
	var tbody = table.append('tbody')

	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })

	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')
      .attr("id", "blueLine")
      .on("click", function(d) {
		console.debug("Click: " + d.toSource());
        // TODO: log selection of row
	})

	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
      .text(function (d) { return d.value })

  return table;
}