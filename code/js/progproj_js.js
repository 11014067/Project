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
		.defer(d3.csv, "data/progproj_Weather.csv")
		.await(CheckData);
}

function CheckData(error, ppGDP, ppIncome, ppIndices, ppPopulation, ppStates, ppWeather) {
	
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
	dataWeather = ppWeather;
	DrawMap(dataPopulation)
	DrawCalander("Alaska")
	DrawBarGraph("Alaska")
}

function DrawMap(shownData) {
	var year = document.getElementById("dataYear").value
	var standardYear = "2015"
	
	var width = 950
	var height = 650
	var svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	//var projection = d3.geoAlbersUsa()
	//	.scale(1100);
	// var projection = d3.geoAlbersUsa().scale(1100);
	var path = d3.geoPath()//.projection(projection);	
	
	// get the colour scale
	var colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
			return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
			return Math.round(shownData[i][standardYear]/1000)*1000; 
			})])
		.range(["#D5E2EF", "#08519C"]);
	
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
				})
				.on('mouseover', function(d){
					var name = this.id;
					document.getElementById('stateName').innerHTML=name;
					for (i=0; i<shownData.length; i++) {
						if (name == shownData[i].StateName) {
							return document.getElementById('stateData').innerHTML=(shownData[i][year]);
						}
					}					
				})
					
		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, function(a, b) { return a !== b; })));
	});
	
	
	if (shownData == dataPopulation) {
		document.getElementById('stateInfo').innerHTML=("had a population of")
	}
	else if (shownData == dataIncome) {
		document.getElementById('stateInfo').innerHTML=("had an average income of")
	}
	else {
		document.getElementById('stateInfo').innerHTML=("had a GDP of")
	}
	
	document.getElementById('stateYear').innerHTML=("in " + year)
	// getLegend("USMapLegend", LegendColours)

}

function DrawCalander(stateName){
	var width = 900,
        height = 450,
        cellSize = 15; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;
	var colourScale = d3.scaleLinear()
		.domain([-30, 0, 60])
		.range(["#2A02D8", "#FFFFFF", "#D80404"])
		
	var monthTitle = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var day = d3.timeFormat("%w"), 
        week = d3.timeFormat("%U"), 
        month = d3.timeFormat("%m"), 
        year = d3.timeFormat("%Y"),
		informationDay = d3.timeFormat("%d")
		informationMonth = d3.timeFormat("%B");

    var svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2017, 2018))
		.enter().append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g")

    var rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
		.enter()
		.append("g")
			.attr("class", "calendarSVG")
	
	rect.append("rect")
			.attr("class", "day")
			.attr("id", function(d,i) { return i; })
			.attr("width", cellSize)
			.attr("height", cellSize)
			.attr("x", function(d) {
				var month_padding = 1.2 * cellSize* 7 * ((month(d)-1) % (no_months_in_a_row));
				return day(d) * cellSize + month_padding; 
				})
			.attr("y", function(d) { 
				var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1) );
				var rowNum = Math.ceil(month(d) / (no_months_in_a_row));
				return (week_diff * cellSize) + rowNum * cellSize * 8 - cellSize / 2 - shift_up;
			})
			.style("fill", function(d,i) { return colourScale(dataWeather[i][stateName])})
			.on("mouseover", function(d, i) { 
				d3.selectAll(".calendarLegenda").style("opacity", "0");
				d3.select("#calendarLegenda" + i).style("opacity", "1");})
			.append("title")
				.text(function(d, i) { return dataWeather[i][stateName] + " degrees"; });
	
	rect.append("text")
		.attr("class", "calendarLegenda")
		.attr("id", function(d,i) { return "calendarLegenda" + i; })
		.attr("x", "300")
		.attr("y", "300")
		.style("opacity", "0")
		.text(function(d,i) { 
			information = "On the " + informationDay(d) + "th of " + 
			informationMonth(d) + " the average temperature is " + 
			dataWeather[i][stateName] + " degrees celcius";
			return information; });

    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("text")
			.text(function(d,i) {return monthTitle[i];})
			.attr("x", function(d, i) {
				var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
				return month_padding;
			})
			.attr("y", function(d, i) {
				var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
				var row_level = Math.ceil(month(d) / (no_months_in_a_row));
				return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
			})
			.attr("class", "monthTitle")
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
        left: 100
    };
		
	var width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	
	var svgBar = d3.select("#BarGraph")
		.append("svg")
		.attr("class", "outerBarSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([60, 310]);

    var y = d3.scaleLinear()
		.range([0, height])
		.domain([0, DataList.length]);

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y);

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
        .attr("y", function (d, i) { return y(i); })
        .attr("height", function(d) { return (height/DataList.length) - margin.bottom; })
        .attr("x", 0)
        .attr("width", function (d) { return x(d); })

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        .attr("y", function (d, i) { return y(i + 0.5 ) })
		.attr("x", function (d) { return x(d) - 10; })
		.text(function(d) { return d; });
 
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
		})
		.on('mouseover', function(d){
					var name = this.id;
					document.getElementById('stateName').innerHTML=name;
					for (i=0; i<shownData.length; i++) {
						if (name == shownData[i].StateName) {
							return document.getElementById('stateData').innerHTML=(shownData[i][year]);
						}
					}					
				});
	
	if (shownData == dataPopulation) {
		document.getElementById('stateInfo').innerHTML=("had a population of")
		document.getElementById('stateInfo2').innerHTML=("")
	}
	else if (shownData == dataIncome) {
		document.getElementById('stateInfo').innerHTML=("had an average income of")
		document.getElementById('stateInfo2').innerHTML=(" dollar")
	}
	else {
		document.getElementById('stateInfo').innerHTML=("had a GDP of")
		document.getElementById('stateInfo2').innerHTML=(" dollar")
	}
	
	document.getElementById('stateYear').innerHTML=("in " + year)
}

function clickedState(stateName) {
	updateCalander(stateName);
	updateBarGraph(stateName);
}

function updateCalander(stateName) {
	var colourScale = d3.scaleLinear()
		.domain([-20, 0, 50])
		.range(["#2A02D8", "#FFFFFF", "#D80404"])
		informationDay = d3.timeFormat("%d")
		informationMonth = d3.timeFormat("%B");
		
	var temp = d3.selectAll('.day')
		.style("fill", function(d,i) { return colourScale(dataWeather[i][stateName])})
	d3.selectAll(".calendarLegenda").remove()
	d3.selectAll(".calendarSVG")
		.append("text")
			.attr("class", "calendarLegenda")
			.attr("id", function(d,i) { return "calendarLegenda" + i; })
			.attr("x", "300")
			.attr("y", "300")
			.style("opacity", "0")
			.text(function(d,i) { 
				information = "On the " + informationDay(d) + "th of " + 
				informationMonth(d) + " the average temperature is " + 
				dataWeather[i][stateName] + " degrees celcius";
				return information; });
}

function updateBarGraph(stateName) {
	d3.selectAll(".outerBarSVG").remove();
	DrawBarGraph(stateName)
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