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
}

function DrawMap() {
	var width = 1000
	var height = 1000
	var svg = d3.select("#USMap").append("svg").attr("width", width).attr("height", height);

	var path = d3.geoPath();

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

// function DrawCalander(){
	// var d3.tsv("us-state-names.tsv", function(tsv){
    //// extract just the names and Ids
    // var names = {};
    // tsv.forEach(function(d,i){
      // names[d.id] = d.name;
    // });
	
// }