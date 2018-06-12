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
var dataGDP, dataIncome, dataIndices, dataPopulation, dataStates;

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
		.defer(d3.csv, "data/progproj_States.csv")
		.await(CheckData);
}

function CheckData(error, ppGDP, ppIncome, ppIndices, ppPopulation, ppStates) {
	if (error) throw error;
	dataGDP = ppGDP;
	dataIncome = ppIncome;
	dataIndices = ppIndices;
	ppPopulation.forEach( function(d){
		d["2015"] = +d["2015"]
	});
	dataPopulation = ppPopulation;
	dataStates = ppStates;
	DrawMap()
	DrawCalander()
	DrawBarGraph()
}

function DrawMap() {
	var width = 1000
	var height = 650
	var svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	var path = d3.geoPath();	
	
	
	// get the colour scale
	var colour = d3.scaleLinear()
		.domain([0, d3.max(dataPopulation, function (d) { 
			return Math.round(d["2015"]/10000)*10000; 
			})])
		.range(["#D5E2EF", "#08519C"]);
	
	console.log(dataPopulation);
	
	
	d3.json("https://d3js.org/us-10m.v1.json", function(error, USStates) {
		if (error) throw error;

		svg.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(topojson.feature(USStates, USStates.objects.states).features)
			.enter()
				.append("path")
				.attr("d", path)
				.attr("id", function(d) {
					var IDName = "NULL";
					for (i=0; i<dataStates.length; i++) { 
						if (d.id == dataStates[i].StateNumber) {
							IDName = dataStates[i].StateName
						}
					}
					return IDName 
				})
				.style("fill", function(d) { return colour(dataPopulation["2015"][d.StateName]); });

		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, function(a, b) { return a !== b; })));
	});
	
}

function DrawCalander(){
	var width = 960,
        height = 750,
        cellSize = 25; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.timeFormat("%w"), // day of the week
        day_of_month = d3.timeFormat("%e") // day of the month
        day_of_year = d3.timeFormat("%j")
        week = d3.timeFormat("%U"), // week number of the year
        month = d3.timeFormat("%m"), // month number
        year = d3.timeFormat("%Y"),
        percent = d3.format(".1%"),
        format = d3.timeFormat("%Y-%m-%d");

    var svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2016, 2017))
		.enter().append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "RdYlGn")
		.append("g")

    var rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
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
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text("monthTitle")
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
          .attr("d", "monthTitle");

    var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
          .data(function(d) { 
            return d3.timeYears(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text("yearTitle")
          .attr("x", function(d, i) { return width/2 - 100; })
          .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
          .attr("class", "year-title")
          .attr("d", "yearTitle");


    //  Tooltip Object
    // var tooltip = d3.select("body")
      // .append("div").attr("id", "tooltip")
      // .style("position", "absolute")
      // .style("z-index", "10")
      // .style("visibility", "hidden")
      // .text("a simple tooltip");

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

    // function dayTitle (t0) {
      // return t0.toString().split(" ")[2];
    // }
    // function monthTitle (t0) {
      // return t0.toLocaleString("en-us", { month: "long" });
    // }
    // function yearTitle (t0) {
      // return t0.toString().split(" ")[3];
    // }
}

function DrawBarGraph(){
	var canvas = d3.select('#wrapper')
		.append('svg')
		.attr('width', "900")
		.attr('height', "550");
		
	var categories= ['','Accessories', 'Audiophile', 'Camera & Photo', 'Cell Phones', 'Computers','eBook Readers','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];
	var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];
	var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];
	var grid = d3.range(25).map(function(i){
		return {'x1':0,'y1':0,'x2':0,'y2':480};
		});

	var xscale = d3.scaleLinear()
		.domain([10,250])
		.range([0,722]);

	var yscale = d3.scaleLinear()
		.domain([0,categories.length])
		.range([0,480]);

	// var	xAxis = d3.svg.axis();
		// xAxis.orient('bottom')
			// .scale(xscale)
			// .tickValues(tickVals);

	// var	yAxis = d3.svg.axis();
		// yAxis.orient('left')
			// .scale(yscale)
			// .tickSize(2)
			// .tickFormat(function(d,i){ return categories[i]; })
			// .tickValues(d3.range(17));

	// var y_xis = canvas.append('g')
		// .attr("transform", "translate(150,0)")
		// .attr('id','yaxis')
		// .call(yAxis);

	// var x_xis = canvas.append('g')
		// .attr("transform", "translate(150,480)")
		// .attr('id','xaxis')
		// .call(xAxis);

	// var chart = canvas.append('g')
		// .attr("transform", "translate(150,0)")
		// .attr('id','bars')
		// .selectAll('rect')
		// .data(dollars)
		// .enter()
		// .append('rect')
		// .attr('height',19)
		// .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
		// .style('fill',function(d,i){ return colorScale(i); })
		// .attr('width',function(d){ return 0; });
}


	// var d3.tsv("us-state-names.tsv", function(tsv){
    //// extract just the names and Ids
    // var names = {};
    // tsv.forEach(function(d,i){
      // names[d.id] = d.name;
    // });
	
