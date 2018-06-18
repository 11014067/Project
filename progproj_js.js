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
	dataGDP = ppGDP;
	dataIndices = ppIndices;
	dataIncome = ppIncome;
	dataPopulation = ppPopulation;
	ppStates.forEach( function(d){
		d.IdentificationNumber = +d.IdentificationNumber
	});
	dataStates = ppStates;
	dataTexas = ppTexas;
	DrawMap(dataGDP)
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
				.style("fill", function(d, i){
					for (i=0; i<shownData.length; i++) {
						if (this.id == shownData[i].StateName) {
							return colour(shownData[i][year]);
						}
					}
					return "rbg(80, 80, 80)"; });

		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, function(a, b) { return a !== b; })));
	});

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
	
	d3.csv('data/progproj_indices.csv', function(error, dataIndices) {
		if (error) throw error;
		dataIndices.forEach( function (d) {
			d.Index = +d.Index
			d.Grocery = +d.Grocery
			d.Housing = +d.Housing
			d.Utilities = +d.Utilities
		})
		
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
            .attr("height", function(d, i) { return (height/DataList.length) - margin.bottom; })
            .attr("x", 0)
            .attr("width", function (d, i) { return x(d); });

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
	})
        
}

function updateMap(showData) {
	//get year
	var year = document.getElementById("dataYear").value
	//get dataset
	var dataName = document.getElementById("optionBox").value
	var showData = "data" + dataName;
	
	
}