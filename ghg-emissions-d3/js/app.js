(function() {
	
	var width = 960,
		height = 550;
 
	var svg = d3.select('#map').append('svg')
		.attr('width', width)
		.attr('height', height);
 
	var projection = d3.geo.albersUsa()
		.scale(1200)
		.translate([width / 2, height / 2]);
 
	var path = d3.geo.path()
		.projection(projection);
	
	queue()
		.defer(d3.json, 'basemap/us-states.json')
		.defer(d3.json, 'data/direct-emitters.json')
		.await(drawMap);
 
	function drawMap(error, states, facilities) {
	
	var length = facilities.features.length;

	var data = [],
		datum;
	
	for (var i=0; i<length; i++) {
		datum = facilities.features[i].properties.total_emissions;
		data.push(Number(datum));
	}
	
	var min = Math.min.apply(Math, data);
	var max = Math.max.apply(Math, data);
	
	var radius = d3.scale.sqrt()
		.domain([min, max])
		.range([2, 22]);
	
	svg.append('path')
		.datum(topojson.feature(states, states.objects.usStates))
		.attr('d', path)
		.attr('class', 'states');
		
	svg.selectAll('.facilities')
		.data(facilities.features)
		.enter().append('path')
		.attr('class', 'facilities')
		.attr('d', path.pointRadius(function(d) { return radius(d.properties.total_emissions); }));
		
}

})();
