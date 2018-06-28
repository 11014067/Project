/**
* Name: Sanne Oud 
* Student number: 11014067
* programmeer project
*
* This script makes a US map, a weather calendar and a barchart.
* The US map shows population, income or GDP data from 2011-2015.
* The calendar shows the temperature in that state in 2017 and the 
* barchart shows how expensive living is in the selected state.
*
* sources:
* indices:	https://www.missourieconomy.org/indicators/cost_of_living/
* weather: 	https://www.wunderground.com/
* population: https://www.census.gov/data/tables/2016/demo/popest/state-total.html
* GDP:		https://www.bea.gov/iTable/iTable.cfm?reqid=70&step=10&isuri=1&7003=200&7035=-1&7004=sic&7005=1&7006=xx&7036=-1&7001=1200&7002=1&7090=70&7007=-1&7093=levels#reqid=70&step=10&isuri=1&7003=200&7004=naics&7035=-1&7005=1&7006=xx&7001=1200&7036=-1&7002=1&7090=70&7007=-1&7093=levels
* income: 	https://en.wikipedia.org/wiki/List_of_U.S._states_by_income
*
**/

/**
* Make some global variables 
**/
let dataGDP = {},
	dataIncome = {}, 
	dataIndices = {}, 
	dataPopulation = {},
	dataStates = {};

/**
* Load all the data files.
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


/**
* Check the data, make the data usable and start making the site.
**/
function CheckData(error, ppGDP, ppIncome, ppIndices, ppPopulation, ppStates, ppWeather) {
	
	// check for errors
	if (error) throw error;
	
	// make the strings into variables
	ppGDP.forEach( function(d) {
		d["2011"] = +d["2011"] 
		d["2012"] = +d["2012"] 
		d["2013"] = +d["2013"]
		d["2014"] = +d["2014"]
		d["2015"] = +d["2015"]
	});
	ppPopulation.forEach( function(d) {
		d["2010"] = +d["2010"] 
		d["2011"] = +d["2011"] 
		d["2012"] = +d["2012"] 
		d["2013"] = +d["2013"]
		d["2014"] = +d["2014"]
		d["2015"] = +d["2015"]
		d["2016"] = +d["2016"]
	});
	ppIncome.forEach( function(d) {
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
	});
	ppStates.forEach( function(d){
		d.IdentificationNumber = +d.IdentificationNumber
	});
	
	// save the new data in global variables
	dataGDP = ppGDP;
	dataIndices = ppIndices;
	dataIncome = ppIncome;
	dataPopulation = ppPopulation;
	dataStates = ppStates;
	dataWeather = ppWeather;
	
	// start drawing the site
	DrawMap(dataPopulation);
	DrawCalander("Alaska");
	DrawBarGraph("Alaska");
}

/**
* Draw the US map.
**/
function DrawMap(shownData) {
	
	// get the year and svg size
	const year = "2015";
	const width = 950;
	const height = 650;
	
	// start the svg
	const svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
		
	// make a path for the map
	const path = d3.geoPath();

	// get the colour scale with a lower minimum to fit all the years
	const colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
			return (Math.round(shownData[i][year]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
				return Math.round(shownData[i][year]/1000)*1000; 
			})
		])
		.range(["#D5E2EF", "#08519C"]);
	
	// get the US map data
	d3.json("https://d3js.org/us-10m.v1.json", function(error, USStates) {
		if (error) throw error;
		
		// make the states and colour them according to the data
		svg.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(topojson.feature(USStates, USStates.objects.states).features)
			.enter()
				.append("path")
				.attr("d", path)
				.attr("id", function(d) {
					let IDName = "NULL";
					for (i=0; i<dataStates.length; i++) { 
						if (d.id == dataStates[i].StateNumber) {
							IDName = dataStates[i].StateName;
						}
					}
					return IDName;
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
					let name = this.id;
					document.getElementById('stateName').innerHTML=name;
					for (i=0; i<shownData.length; i++) {
						if (name == shownData[i].StateName) {
							return document.getElementById('stateData')
								.innerHTML=(shownData[i][year]);
						}
					}					
				});
				
		// append the borders with the path		
		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, 
				function(a, b) { return a !== b; })));
	});
	
	
	// create the tooltip starting with Alaska
	document.getElementById('stateName').innerHTML=shownData[1].StateName;
	
	if (shownData == dataPopulation) {
		document.getElementById('stateInfo')
			.innerHTML=("had a population of");
	}
	else if (shownData == dataIncome) {
		document.getElementById('stateInfo')
			.innerHTML=("had an average income of");
	}
	else {
		document.getElementById('stateInfo')
			.innerHTML=("had a GDP of");
	}
	
	document.getElementById('stateData')
		.innerHTML=(shownData[1][year]);
	
	document.getElementById('stateYear')
		.innerHTML=("in " + year);
		
}

/**
* Draw the calendar for any state.
**/
function DrawCalander(stateName){
	
	// get all the sizes
	const width = 900,
        height = 450,
        cellSize = 15,
		no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50)),
		shift_up = cellSize * 3;
		
	// make a colour scale
	const colourScale = d3.scaleLinear()
		.domain([-30, 0, 50])
		.range(["#007CC4", "#F7F7F7", "#E84302"]);
	
	// get the months in the year and the necessery date formats
	const day = d3.timeFormat("%w"), 
        week = d3.timeFormat("%U"), 
        month = d3.timeFormat("%m"), 
        year = d3.timeFormat("%Y"),
		informationDay = d3.timeFormat("%d"),
		informationMonth = d3.timeFormat("%B");
		
	// make a svg
    const svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2017, 2018))
		.enter().append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g");

	// make a "g" for every day
    const rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
		.enter()
		.append("g")
			.attr("class", "calendarSVG");
	
	// make a square for every day
	rect.append("rect")
		.attr("class", "day")
		.attr("id", function(d,i) { return i; })
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", function(d) {
			let month_padding = 1.2 * cellSize* 7 * 
				((month(d)-1) % (no_months_in_a_row));
			return day(d) * cellSize + month_padding; 
		})
		.attr("y", function(d) { 
			let week_diff = week(d) - 
				week(new Date(year(d), month(d) - 1, 1) );
			let rowNum = Math.ceil(month(d) / (no_months_in_a_row));
			return (week_diff * cellSize) + 
				rowNum * cellSize * 8 - cellSize / 2 - shift_up;
		})
		.style("fill", function(d,i) { 
			return colourScale(dataWeather[i][stateName])
		})
		.on("mouseover", function(d, i) { 
			d3.selectAll(".calendarLegenda").style("opacity", "0");
			d3.select("#calendarLegenda" + i).style("opacity", "1");
		});
	
	// make a tooltip
	rect.append("text")
		.attr("class", "calendarLegenda")
		.attr("id", function(d,i) { return "calendarLegenda" + i; })
		.attr("x", function() { return width/3 - 30})
		.attr("y", function() { return height*2/3 + 30})
		.style("opacity", "0")
		.text(function(d,i) { 
			information = "On the " + informationDay(d) + "th of " + 
			informationMonth(d) + " it was " + 
			dataWeather[i][stateName] + " degrees celcius";
			return information; 
		});
		
	// title the months
    const month_titles = svg.selectAll(".month-title")  
        .data(function(d) { 
			return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); 
			})
		.enter().append("text")
			.text(function(d,i) { return informationMonth(d); })
			.attr("x", function(d, i) {
				let month_padding = 1.2 * cellSize* 7 * 
					((month(d)-1) % (no_months_in_a_row));
				return month_padding;
			})
			.attr("y", function(d, i) {
				let week_diff = week(d) - 
					week(new Date(year(d), month(d)-1, 1) );
				let row_level = Math.ceil(month(d) / (no_months_in_a_row));
				return (week_diff*cellSize) + row_level * cellSize * 8 
					- cellSize - shift_up;
			})
			.attr("class", "monthTitle");
}

/**
* Draw a bar graph about the cost of living in a state.
**/
function DrawBarGraph(stateName){
	// get the state number
	let stateNumber = 0;
	for (i = 0; i < dataStates.length; i++) {
		if (dataStates[i].StateName == stateName) {
			stateNumber = i;
		}
	}
	
	// make a object with the data for the state
	const DataList = ["Index", "Grocery", "Housing", "Utilities"];
	let DataListIndex = [] ;
	
	for (i=0; i<DataList.length; i++) {
		DataListIndex.push(dataIndices[stateNumber][DataList[i]]);
	}
	
	// get the svg sizes
    const margin = {
        top: 50,
        right: 25,
        bottom: 15,
        left: 50
    };
		
	const width = 700 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	
	// make the svg
	const svgBar = d3.select("#BarGraph")
		.append("svg")
		.attr("class", "outerBarSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 
			margin.top + ")");

	// make the x and y scale and y axis
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([50, 350]);

    const y = d3.scaleOrdinal()
		.range([0, (height / 4), (height/ 2), (height * 3 / 4)])
		.domain(DataList);

    const yAxis = d3.axisLeft(y);

    svgBar.append("g")
        .attr("class", "y axis")
        .call(yAxis);
			
	// make the bars with labels
    const bars = svgBar.selectAll(".bar")
        .data(DataListIndex)
        .enter()
        .append("g").attr("class", "Bar");

    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d, i) { return y(DataList[i]); })
        .attr("height", function(d) { 
			return (height/DataList.length) - margin.bottom; 
		})
        .attr("x", 0)
        .attr("width", function (d) { return x(d); });

    bars.append("text")
        .attr("class", "label")
        .attr("y", function (d, i) { return y(DataList[i]) + 20; })
		.attr("x", function (d) { return x(d) - 10; })
		.text(function(d) { return d; });
 
}
        
/**
* Update the map for year or shown value.
**/
function updateMap() {
	//get the year and dataset
	const year = document.getElementById("dataYear").value;
	const dataName = "data" + document.getElementById("optionBox").value;
	
	if (dataName == "dataPopulation") {
		shownData = dataPopulation;
	}
	else if (dataName == "dataGDP") {
		shownData = dataGDP;
	}
	else if (dataName == "dataIncome") {
		shownData = dataIncome;
	}
	
	const standardYear = "2015";
	
	// remake the colour scale to keep it the same for each year
	const colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
				return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
				return Math.round(shownData[i][standardYear]/1000)*1000; 
			})
		])
		.range(["#D5E2EF", "#08519C"]);	
	
	// re-colour the states and update the tooltip
	const temp = d3.selectAll('path')
		.style("fill", function(d, i){
			for (i=0; i<shownData.length; i++) {
				if (this.id == shownData[i].StateName) {
					return colour(shownData[i][year]);
				}
			}
			return "rbg(80, 80, 80)"; 
		})
		.on('mouseover', function(d){
			let name = this.id;
			document.getElementById('stateName').innerHTML=name;
			for (i=0; i<shownData.length; i++) {
				if (name == shownData[i].StateName) {
					return document.getElementById('stateData')
						.innerHTML=(shownData[i][year]);
				}
			}					
		});
	
	if (shownData == dataPopulation) {
		document.getElementById('stateInfo')
			.innerHTML=("had a population of");
		document.getElementById('stateInfo2')
			.innerHTML=("");
	}
	else if (shownData == dataIncome) {
		document.getElementById('stateInfo')
			.innerHTML=("had an average income of");
		document.getElementById('stateInfo2')
			.innerHTML=(" dollar");
	}
	else {
		document.getElementById('stateInfo')
			.innerHTML=("had a GDP of");
		document.getElementById('stateInfo2')
			.innerHTML=(" dollar");
	}
	
	document.getElementById('stateYear')
		.innerHTML=("in " + year);
}

/**
* Change the calendar and bar graph if a state is selected.
**/
function clickedState(stateName) {
	updateCalendar(stateName);
	d3.selectAll(".outerBarSVG").remove();
	DrawBarGraph(stateName);
	document.getElementById('graphTitle')
		.innerHTML=stateName;
}

/**
* Re-colour the calendar for a new state.
**/
function updateCalendar(stateName) {
	// get the colour scale and date formats
	const colourScale = d3.scaleLinear()
		.domain([-30, 0, 50])
		.range(["#007CC4", "#F7F7F7", "#E84302"]),
		informationDay = d3.timeFormat("%d"),
		informationMonth = d3.timeFormat("%B");
		
	// re-colour each day rect
	const temp = d3.selectAll('.day')
		.style("fill", function(d,i) { 
			return colourScale(dataWeather[i][stateName])
		});
		
	// remove the tooltip and make a new one
	d3.selectAll(".calendarLegenda").remove();
	
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
				return information; 
			});
}

/**
* Show/hide the storytelling/help.
**/
function showStory() {
	
	// show or hide the dropdown
	if (d3.select(".dropdownContentStory").style("display") == "none") {
		d3.select(".dropdownContentStory").style("display", "block");
	}
	else {
		d3.select(".dropdownContentStory").style("display", "none");
	}
}

function showHelp() {
	
	// show or hide the dropdown
	if (d3.select(".dropdownContentHelp").style("display") == "none") {
		d3.select(".dropdownContentHelp").style("display", "block");
	}
	else {
		d3.select(".dropdownContentHelp").style("display", "none");
	}
}