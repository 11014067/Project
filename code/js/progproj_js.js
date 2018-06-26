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
let dataGDP = {},
	dataIncome = {}, 
	dataIndices = {}, 
	dataPopulation = {},
	dataStates = {},
	dataTexas = {};

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
	});
	dataGDP = ppGDP;
	dataIndices = ppIndices;
	dataIncome = ppIncome;
	dataPopulation = ppPopulation;
	ppStates.forEach( function(d){
		d.IdentificationNumber = +d.IdentificationNumber
	});
	dataStates = ppStates;
	dataWeather = ppWeather;
	DrawMap(dataPopulation);
	DrawCalander("Alaska");
	DrawBarGraph("Alaska");
}

function DrawMap(shownData) {
	const year = document.getElementById("dataYear").value;
	const standardYear = "2015";
	
	const width = 950;
	const height = 650;
	const svg = d3.select("#USMap")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	const path = d3.geoPath();

	// get the colour scale
	const colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
			return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
				return Math.round(shownData[i][standardYear]/1000)*1000; 
			})
		])
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
					
		svg.append("path")
			.attr("class", "state-borders")
			.attr("d", path(topojson.mesh(USStates, USStates.objects.states, 
				function(a, b) { return a !== b; })));
	});
	
	
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
	
	document.getElementById('stateYear')
		.innerHTML=("in " + year);
}

function DrawCalander(stateName){
	const width = 900,
        height = 450,
        cellSize = 15; 

    const no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    const shift_up = cellSize * 3;
	const colourScale = d3.scaleLinear()
		.domain([-30, 0, 60])
		.range(["#2A02D8", "#FFFFFF", "#D80404"]);
		
	const monthTitle = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

    const day = d3.timeFormat("%w"), 
        week = d3.timeFormat("%U"), 
        month = d3.timeFormat("%m"), 
        year = d3.timeFormat("%Y"),
		informationDay = d3.timeFormat("%d"),
		informationMonth = d3.timeFormat("%B");

    const svg = d3.select("#Calander").selectAll("svg")
        .data(d3.range(2017, 2018))
		.enter().append("svg")
			.attr("width", width)
			.attr("height", height)
		.append("g");

    const rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
		.enter()
		.append("g")
			.attr("class", "calendarSVG");
	
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
			return information; 
		});

    const month_titles = svg.selectAll(".month-title")  
        .data(function(d) { 
			return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); 
			})
		.enter().append("text")
			.text(function(d,i) {return monthTitle[i];})
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

function DrawBarGraph(stateName){
	let stateNumber = 0;
	for (i = 0; i < dataStates.length; i++) {
		if (dataStates[i].StateName == stateName) {
			stateNumber = i;
		}
	}
	
	const DataList = ["Index", "Grocery", "Housing", "Utilities"],
		DataListIndex = [] ;
	
	for (i=0; i<4; i++) {
		DataListIndex.push(dataIndices[stateNumber][DataList[i]]);
	}
		
    const margin = {
        top: 50,
        right: 25,
        bottom: 15,
        left: 100
    };
		
	const width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	
	const svgBar = d3.select("#BarGraph")
		.append("svg")
		.attr("class", "outerBarSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 
			margin.top + ")");

    const x = d3.scaleLinear()
        .range([0, width])
        .domain([60, 310]);

    const y = d3.scaleLinear()
		.range([0, height])
		.domain([0, DataList.length]);

    //make y axis to show bar names
    const yAxis = d3.axisLeft(y);

    const gy = svgBar.append("g")
        .attr("class", "y axis")
        .call(yAxis);
			
    const bars = svgBar.selectAll(".bar")
        .data(DataListIndex)
        .enter()
        .append("g").attr("class", "Bar");

    
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d, i) { return y(i); })
        .attr("height", function(d) { 
			return (height/DataList.length) - margin.bottom; 
		})
        .attr("x", 0)
        .attr("width", function (d) { return x(d); });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        .attr("y", function (d, i) { return y(i + 0.5 ) })
		.attr("x", function (d) { return x(d) - 10; })
		.text(function(d) { return d; });
 
}
        

function updateMap() {
	//get year
	const year = document.getElementById("dataYear").value;
	//get dataset
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
	else {
		//give error
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!11
		return;
	}
	
	const standardYear = "2015";
	
	// get the colour scale
	const colour = d3.scaleLinear()
		.domain([d3.min(shownData, function (d, i) { 
				return (Math.round(shownData[i][standardYear]/1000)*1000)/1.5; 
			}), 
			d3.max(shownData, function (d, i) { 
				return Math.round(shownData[i][standardYear]/1000)*1000; 
			})
		])
		.range(["#D5E2EF", "#08519C"]);	
	
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

function clickedState(stateName) {
	updateCalander(stateName);
	updateBarGraph(stateName);
}

function updateCalander(stateName) {
	const colourScale = d3.scaleLinear()
		.domain([-20, 0, 50])
		.range(["#2A02D8", "#FFFFFF", "#D80404"]),
		informationDay = d3.timeFormat("%d"),
		informationMonth = d3.timeFormat("%B");
		
	const temp = d3.selectAll('.day')
		.style("fill", function(d,i) { 
			return colourScale(dataWeather[i][stateName])
		});
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

function updateBarGraph(stateName) {
	d3.selectAll(".outerBarSVG").remove();
	DrawBarGraph(stateName);
}