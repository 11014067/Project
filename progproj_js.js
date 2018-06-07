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
	dataPopulation = ppPopultion;
	DrawMap()
}

function DrawMap() {
	var width = 960,
		height = 500,
		centered;

	var projection = d3.geo.albersUsa()
		.scale(1070)
		.translate([width / 2, height / 2]);

	var path = d3.geo.path()
		.projection(projection);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	svg.append("rect")
		.attr("class", "background")
		.attr("width", width)
		.attr("height", height)
		.on("click", clicked);

	var g = svg.append("g");

	d3.json("/mbostock/raw/4090846/us.json", function(error, us) {
		if (error) throw error;
	
		g.append("g")
			.attr("id", "states")
			.selectAll("path")
			.data(topojson.feature(us, us.objects.states).features)
			.enter().append("path")
			.attr("d", path)
			.on("click", clicked);
	
		g.append("path")
			.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			.attr("id", "state-borders")
			.attr("d", path);
	});
}

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}