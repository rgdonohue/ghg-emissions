(function() {
	
	var width = $(window).width(),
		height = $(window).height();

	var projection = d3.geo.albersUsa()
		.scale(1200)
		.translate([width / 2, height / 2]);

	var zoom = d3.behavior.zoom()
	    .scaleExtent([1, 8])
	    .on("zoom", zoomed);

	var path = d3.geo.path()
		.projection(projection);
 
	var svg = d3.select('#map').append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g');

	var g = svg.append('g');

	svg.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height);

	svg.call(zoom)
		.call(zoom.event);
 	
	queue()
		.defer(d3.json, 'basemap/us-states.json')
		.defer(d3.json, 'data/direct-emitters.json')
		.await(drawMap);
 
	function drawMap(error, states, facilities) {

		g.append('path')
			.datum(topojson.feature(states, states.objects.usStates))
			.attr('d', path)
			.attr('class', 'states');
		
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
		

			
		g.selectAll('.facilities')
			.data(facilities.features)
			.enter().append('path')
			.attr('class', 'facilities')
			.attr('d', path.pointRadius(function(d) { return radius(d.properties.total_emissions); }));
	
	} // end drawMap

	function zoomed() {
  		g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

})();
