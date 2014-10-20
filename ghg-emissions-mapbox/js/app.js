(function() {
	L.mapbox.accessToken = 'pk.eyJ1Ijoicmdkb25vaHVlIiwiYSI6Im5Ua3F4UzgifQ.PClcVzU5OUj17kuxqsY_Dg';
	var map = L.mapbox.map('map', 'examples.map-h67hf2ic')
	    .setView([40, -94.50], 5);

	$.getJSON('data/direct-emitters.geojson', function(data) { // load the GeoJSON data

		drawSymbols(data); // pass loaded external resource data

	});

	function drawSymbols(data) {
		
		var symbols = L.geoJson(data, {

			pointToLayer: function(feature, latlng) {

				// use the population attribute to calculate the radius of the circle
				return L.circleMarker(latlng, {

				    fillColor: "red",
				    color: 'white',
				    weight: 1,
				    fillOpacity: 0.8

				});
			}

		}).addTo(map);

		updateSymbols(symbols);

	} //end drawSymbols


	function calcPropRadius(pop, sf) {

		var area = pop * sf;

		return Math.sqrt(area/Math.PI)*2;

	} // end calcPropRadius

	function updateSymbols(symbols) {

		var radius,
			props;

		symbols.eachLayer(function(layer) {

			props = layer.feature.properties,
			radius = calcPropRadius(props.total_emissions, .00005),
			popupContent = '<b>' + props.name + 
			'</b><br><ul><li><b>total emissions</b>: ' + 
			String(props.total_emissions) + '</li><li>CO2: ' + 
			String(props.CO2) + '</li><li>CH4: ' + 
			String(props.CH4) + '</li><li>N2O: ' + 
			String(props.N2O) + '</li></ul>';
			
			layer.setRadius(radius);
			layer.bindPopup(popupContent);

			layer.bindPopup(popupContent, { offset: new L.Point(0,-radius) }); 
			layer.on({

				mouseover: function(e) {
					this.openPopup();
					this.setStyle({color: 'yellow'});
				},
				mouseout: function(e) {
					this.closePopup();
					this.setStyle({color: 'red'});
						
				}
			});


		});

	}

})();
