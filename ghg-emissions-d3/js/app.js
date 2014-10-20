(function() {
	
	var width = $(window).width(),
		height = $(window).height();

	var projection = d3.geo.albersUsa()
		.scale(1200)
		.translate([width / 2, height / 2]);

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

	var radius,
		zoom;
	
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

		radius = d3.scale.sqrt()
			.domain([min, max])
			.range([2, 30]);
			
		g.selectAll('.facilities')
			.data(facilities.features)
			.enter().append('path')
			.attr('class', 'facilities')
			.attr('d', path.pointRadius(function(d) { return radius(d.properties.total_emissions); }));

		zoom = d3.behavior.zoom()
		    .scaleExtent([1, 16])
		    .on("zoom", zoomed);

		svg.call(zoom)
			.call(zoom.event);			
	
	} // end drawMap

	function scaleFeatures() {
		
		g.selectAll('.facilities')
			.attr('d', path.pointRadius(function(d) { return radius(d.properties.total_emissions); }));

	}

	function zoomed() {
		var zoomScale = function(scaleIn) {

			// switch statement actually slower here!!!
			if(scaleIn == 1) { return 16; }
			if(scaleIn > 1 && scaleIn <= 5) { return 14; }
			if(scaleIn > 5 && scaleIn <= 10) { return 12; }
			if(scaleIn > 10 && scaleIn <= 15) { return 10; }
			if(scaleIn > 15  && scaleIn <= 20) { return 8; }
			if(scaleIn > 20 && scaleIn <= 25) { return 6; }
			if(scaleIn > 25 && scaleIn <= 30) { return 4; }

		}
  		g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  		zoom.on('zoomend', function() {
  			
  			var s = zoom.scale();

  			radius.range([2,zoomScale(s)])
  			
  		});

  		scaleFeatures();
	}

})();
