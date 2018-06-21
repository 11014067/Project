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
var dataGDP, dataIncome, dataIndices, dataPopulation, dataStates, dataTexas;
var Temp2015 = [];

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
		.defer(d3.csv, "data/progproj_Texas.csv")
		.await(CheckData);
}

function CheckData(error, ppGDP, ppIncome, ppIndices, ppPopulation, ppStates, ppTexas) {
	
	if (error) throw error;
	ppGDP.forEach( function(d){
		d["2011"] = +d["2011"] 
		d["2012"] = +d["2012"] 
		d["2013"] = +d["2013"]
		d["2014"] = +d["2014"]
		d["2015"] = +d["2015"]
	});
	ppPopulation.forEach( function(d){
		d["2010"] = +d["2010"] 
		d["2011"] = +d["2011"] 
		d["2012"] = +d["2012"] 
		d["2013"] = +d["2013"]
		d["2014"] = +d["2014"]
		d["2015"] = +d["2015"]
		d["2016"] = +d["2016"]
		Temp2015[d.StateName] = d["2015"]
	});
	ppIncome.forEach( function(d){
		d["2011"] = +d["2011"] 
		d["2012"] = +d["2012"] 
		d["2013"] = +d["2013"]
		d["2014"] = +d["2014"]
		d["2015"] = +d["2015"]
	});
	ppIndices.forEach( function (d) {
		d.Index = +d.Index
		d.Grocery = +d.Grocery
		d.Housing = +d.Housing
		d.Utilities = +d.Utilities
	})
	dataGDP = ppGDP;
	dataIndices = ppIndices;
	dataIncome = ppIncome;
	dataPopulation = ppPopulation;
	ppStates.forEach( function(d){
		d.IdentificationNumber = +d.IdentificationNumber
	});
	dataStates = ppStates;
	dataTexas = ppTexas;
	DrawMap(dataPopulation)
	DrawCalander("Texas")
	DrawBarGraph("Florida")
}

function DrawMap(shownData) {
	var year = document.getElementById("dataYear").value
	var standardYear = "2015"
	
	var width = 1000
	var height = 650
	var svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	var path = d3.geoPath();	
	
	// get the colour scale
	var colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
			return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
			return Math.round(shownData[i][standardYear]/1000)*1000; 
			})])
		.range(["#D5E2EF", "#08519C"]);
	
	// var legendColours = { "$0": colour(0), "$20000": colour(20000), 
			// "$40000": colour(40000), "$60000": colour(60000), 
			// "$80000": colour(80000), "unknown": colour(undefined)
		// }
	
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
				.style("fill", function(d) {
					for (i=0; i<shownData.length; i++) {
						if (this.id == shownData[i].StateName) {
							return colour(shownData[i][year]);
						}
					}
					return "rbg(80, 80, 80)"; 
				})
				.on("click", function() {
					clickedState(this.id);
				});

		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, function(a, b) { return a !== b; })));
	});
	
	// getLegend("USMapLegend", LegendColours)

}

function DrawCalander(stateName){
	var width = 900,
        height = 650,
        cellSize = 15; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;
	var colourScale = d3.scaleLinear()
		.domain([-10, 40])
		.range(["#2a02d8", "#D80404"])

    var day = d3.timeFormat("%w"), // day of the week
        day_of_month = d3.timeFormat("%e") // day of the month
        day_of_year = d3.timeFormat("%j")
        week = d3.timeFormat("%U"), // week number of the year
        month = d3.timeFormat("%m"), // month number
        year = d3.timeFormat("%Y"),
        format = d3.timeFormat("%Y-%m-%d");

    var svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2017, 2018))
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
			.attr("id", function(d,i) { return i; })
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
			.style("fill", function(d,i) { return colourScale(dataTexas[i][stateName])})
			.datum(format);

    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
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

    d3.csv("data/progproj_Texas.csv", function(error, TexasData) {
		var data = d3.nest()
			.key(function(d) { return d.Date; })
			.rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
			.map(TexasData);
    });
}

function DrawBarGraph(stateName){
	var stateNumber;
	for (i = 0; i < dataStates.length; i++) {
		if (dataStates[i].StateName == stateName) {
			stateNumber = i;
		}
	}
	
	var DataList = ["Index", "Grocery", "Housing", "Utilities"]
	var DataListIndex = [] ;
	
	for (i=0; i<4; i++) {
		DataListIndex.push(dataIndices[stateNumber][DataList[i]])
	}
		
    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 50,
        right: 25,
        bottom: 15,
        left: 60
    };
		
	var width = 500 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	
	var svgBar = d3.select("#BarGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([50, 150]);

    var y = d3.scaleLinear()
		.range([0, height])
		.domain([0, DataList.length]);

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        //no tick marks
        .tickSize(0);

    var gy = svgBar.append("g")
        .attr("class", "y axis")
        .call(yAxis)
			
    var bars = svgBar.selectAll(".bar")
        .data(DataListIndex)
        .enter()
        .append("g").attr("class", "Bar")

        //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d, i) {
            return y(i);
        })
        .attr("height", function(d) { return (height/DataList.length) - margin.bottom; })
        .attr("x", 0)
        .attr("width", function (d) { return x(d); });

    //add a value label to the right of each bar
    // bars.append("text")
        // .attr("class", "label")
        //y position of the label is halfway down the bar
        // .attr("y", function (d) {
             // return y(d.StateNumber) + y.bandwidth() / 2 + 4;
        // })
            //x position is 3 pixels to the right of the bar
            // .attr("x", function (d, i) {
                // return x(d[DataList[i]]) + 3;
            // })
            // .text(function (d, i) {
                // return d[DataList[i]];
            // });
}
        

function updateMap() {
	//get year
	var year = document.getElementById("dataYear").value;
	//get dataset
	var dataName = "data" + document.getElementById("optionBox").value;
	
	if (dataName == "dataPopulation") {
		shownData = dataPopulation;
	}
	else if (dataName == "dataGDP") {
		shownData = dataGDP;
	}
	else if (dataName == "dataIncome") {
		shownData = dataIncome;
	}
	else {
		//give error
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!11
		return;
	}
	
	var standardYear = "2015";
	
	// get the colour scale
	var colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
			return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
			return Math.round(shownData[i][standardYear]/1000)*1000; 
			})])
		.range(["#D5E2EF", "#08519C"]);	
	
	var temp = d3.selectAll('path')
		.style("fill", function(d, i){
			for (i=0; i<shownData.length; i++) {
				if (this.id == shownData[i].StateName) {
					return colour(shownData[i][year]);
				}
			}
			return "rbg(80, 80, 80)"; 
		});

}

function clickedState(stateName) {
	updateCalander(stateName);
	updateBarGraph(stateName);
}

function updateCalander(stateName) {
	
}

function updateBarGraph(stateName) {
	var stateNumber;
	var DataList = ["Index", "Grocery", "Housing", "Utilities"]
	var DataListIndex = [] ;
	
	for (i = 0; i < dataStates.length; i++) {
		if (dataStates[i].StateName == stateName) {
			stateNumber = i;
		}
	}
	for (i=0; i<DataList.length; i++) {
		DataListIndex.push(dataIndices[stateNumber][DataList[i]])
	}
	
	var x = d3.scaleLinear()
        .range([0, width])
        .domain([50, 150]);
		
	var bars = d3.selectAll(".bar")
	for (i = 0; i < bars.length; i++) {
		bars[i].attr("width", function (d,i) { return x(DataListIndex[i]); });
	}
}

/**
* Draw the legends.
**/
function getLegend(svgName, infoColours, width, height, margin){
	
	// get the wanted svg
	var svg = d3.select("." + svgName);

	// get the coordinates for the legend and its content
	var legendX = width + margin.left + 10;
	var legendY = margin.top + 10;
	var legendWidth = margin.right - 50;
	var legendHeight = 	height - 20;
	var colourWidth = legendWidth/6;
	var legendBorder = 15;
	var infoWidth = legendWidth - colourWidth - (legendBorder * 3);
			
	// get all the different regions
	var infoList = Object.keys(infoColours);
	var infoHeight = ((legendHeight - (legendBorder * 3) )
		/ infoList.length) - 10;
	
	// create a y coordinate scale for the legend
	var legendYScale = d3.scale.linear()
		.range([legendY + (legendBorder * 3), 
			legendY + legendHeight - legendBorder])
		.domain([0, infoList.length]);
	
	// draw the legend box
	var legend = svg.append("g").attr("class", "legend");
	legend.append("rect")
		.attr("x", legendX)
		.attr("y", legendY)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("stroke", "black")
		.attr("fill", "white")
		.attr("rx", 10)
		.attr("ry", 10);
	
	// draw the coloured rectangles
	legend.selectAll(".colour rect")
		.data(infoList)
		.enter()
		.append("rect")
			.attr("class", "colour rect")
			.attr("x", legendX + legendBorder)
			.attr("y", function(d,i) { return legendYScale(i); })
			.attr("width", colourWidth)
			.attr("height", infoHeight)
			.attr("stroke", "black")
			.attr("fill", function(d) { return infoColours[d]; })
			.attr("rx", 10)
			.attr("ry", 10);
		
	// draw the rectangles for the colour discription
	legend.selectAll(".text rect")
		.data(infoList)
		.enter()
		.append("rect")
			.attr("class", "text rect")
			.attr("x", legendX + colourWidth + (legendBorder * 2))
			.attr("y", function(d,i) { return legendYScale(i); })
			.attr("width", infoWidth)
			.attr("height", infoHeight)
			.attr("stroke", "black")
			.attr("fill", "white")
			.attr("rx", 10)
			.attr("ry", 10);
	
	// write the legend title
	legend.append("text")
		.attr("class", "title")
		.attr("x", legendX + (legendWidth / 2))
		.attr("y", legendY + (legendBorder * 2))
		.attr("fill", "black")
		.attr("font-size", "25px")
		.attr("text-anchor", "middle")
		.text("Legend");
		
	// write the colour discription
	legend.selectAll(".legenda")
		.data(infoList)
		.enter()
		.append("text")
			.attr("class", "legenda")
			.attr("x", legendX + colourWidth + (legendBorder * 2) + 10 )
			.attr("y", function(d,i) {
				return legendYScale(i) + infoHeight - 5; 
			})
			.attr("fill", "black")
			.attr("font-size", function() { 
				{ return Math.round(infoHeight/2); }
			})
			.text( function(d) { return d; });
}