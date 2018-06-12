/**
* Name: Sanne Oud 
* Student number: 11014067
* programmeer project
*
* This script makes ......
*
* sources:
*
**/

/**
* Make some global variables 
**/
var dataGDP, dataIncome, dataIndices, dataPopulation;

/**
* Load data
**/
function LoadData() {
	
	// load the datafiles and afterword check the data
	queue()
		.defer(d3.csv, "data/progproj_GDP.csv")
		.defer(d3.csv, "data/progproj_income.csv")
		.defer(d3.csv, "data/progproj_indices.csv")
		.defer(d3.csv, "data/progproj_population.csv")
		.await(CheckData);
}

function CheckData(error, ppGDP, ppIncome, ppIndices, ppPopulation) {
	if (error) throw error;
	dataGDP = ppGDP;
	dataIncome = ppIncome;
	dataIndices = ppIndices;
	dataPopulation = ppPopulation;
	DrawMap()
	DrawCalander()
	DrawBarGraph()
}

function DrawMap() {
	var width = 1000
	var height = 1000
	var svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	var path = d3.geoPath();
	var StateNames = d3.

	d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
		if (error) throw error;

		svg.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(topojson.feature(us, us.objects.states).features)
			.enter()
				.append("path")
				.attr("d", path)
				.attr("id", function(d) {
					var name
					for lengthtxt{ 
						if d.id == txt.id[i]
							name = txt[i].name
					}
					return name });

		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
	});
	
}

function DrawCalander(){
	var width = 960,
        height = 750,
        cellSize = 25; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.time.format("%w"), // day of the week
        day_of_month = d3.time.format("%e") // day of the month
        day_of_year = d3.time.format("%j")
        week = d3.time.format("%U"), // week number of the year
        month = d3.time.format("%m"), // month number
        year = d3.time.format("%Y"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([-.05, .05])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

    var svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2008, 2011))
      .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
      .append("g")

    var rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
          var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
          return day(d) * cellSize + month_padding; 
        })
        .attr("y", function(d) { 
          var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
          var row_level = Math.ceil(month(d) / (no_months_in_a_row));
          return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
        })
        .datum(format);

    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
          .data(function(d) { 
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text(monthTitle)
          .attr("x", function(d, i) {
            var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
            return month_padding;
          })
          .attr("y", function(d, i) {
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
          })
          .attr("class", "month-title")
          .attr("d", monthTitle);

    var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
          .data(function(d) { 
            return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text(yearTitle)
          .attr("x", function(d, i) { return width/2 - 100; })
          .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
          .attr("class", "year-title")
          .attr("d", yearTitle);


    //  Tooltip Object
    var tooltip = d3.select("body")
      .append("div").attr("id", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");

    // d3.csv("dji.csv", function(error, csv) {
      // var data = d3.nest()
        // .key(function(d) { return d.Date; })
        // .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
        // .map(csv);

      // rect.filter(function(d) { return d in data; })
          // .attr("class", function(d) { return "day " + color(data[d]); })
        // .select("title")
          // .text(function(d) { return d + ": " + percent(data[d]); });

       // //Tooltip
      // rect.on("mouseover", mouseover);
      // rect.on("mouseout", mouseout);
      // function mouseover(d) {
        // tooltip.style("visibility", "visible");
        // var percent_data = (data[d] !== undefined) ? percent(data[d]) : percent(0);
        // var purchase_text = d + ": " + percent_data;

        // tooltip.transition()        
                    // .duration(200)      
                    // .style("opacity", .9);      
        // tooltip.html(purchase_text)  
                    // .style("left", (d3.event.pageX)+30 + "px")     
                    // .style("top", (d3.event.pageY) + "px"); 
      // }
      // function mouseout (d) {
        // tooltip.transition()        
                // .duration(500)      
                // .style("opacity", 0); 
        // var $tooltip = $("#tooltip");
        // $tooltip.empty();
      // }

    // });

    function dayTitle (t0) {
      return t0.toString().split(" ")[2];
    }
    function monthTitle (t0) {
      return t0.toLocaleString("en-us", { month: "long" });
    }
    function yearTitle (t0) {
      return t0.toString().split(" ")[3];
    }
}

function DrawBarGraph(){
	
}


	// var d3.tsv("us-state-names.tsv", function(tsv){
    //// extract just the names and Ids
    // var names = {};
    // tsv.forEach(function(d,i){
      // names[d.id] = d.name;
    // });
	
