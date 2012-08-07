// class with map and geolocation related functionality

var geo = (function() {
	// private vars and functions
	var currentAreaRoutes = {};
	var routeinfoWindow = new google.maps.InfoWindow();
	
	// public vars and functions
	return {
		// stores the route in the current area indexed by latitude+"_"+longitude
		currentAreaRoutes: {},
		currentMap:null,
		centreToLocation: function(latitude, longitude, zoom) {
			var mapOptions = {
				zoom: zoom,
				streetViewControl : false,
				center: new google.maps.LatLng(latitude, longitude),
				mapTypeId: google.maps.MapTypeId.SATELLITE//ROADMAP
			}
			geo.currentMap = new google.maps.Map($('#map-square')[0], mapOptions);
		},
		addArea: function (latitude, longitude, areaId, name) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				map: geo.currentMap,
				title:"Hello World!"
			});
			google.maps.event.addListener(marker,'click', function() {
				currentClimage.setAreaId(areaId)
				geo.centreToLocation(marker.position.Ya, marker.position.Za, currentClimage.areaZoom)
				currentAreaRoutes = {}
				geo.markAreaRoutes(areaId)
			});
		},
		addRoute: function (latitude, longitude, routeId, imageId) {
			var latlng = (latitude+"_"+longitude).replace('.','__')
			if(this.currentAreaRoutes[latlng]) {
				this.currentAreaRoutes[latlng][imageId].push(routeId) 
			} else {
				this.currentAreaRoutes[latlng] = {}
				this.currentAreaRoutes[latlng][imageId] = [routeId]
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(latitude, longitude),
					map: geo.currentMap
				});
				google.maps.event.addListener(marker,'click', function() {
					if(geo.currentAreaRoutes[latlng].length > 1) {
						// popup with route images
						return function() {
							//currentAreaRoutes[latlng]
							routeinfoWindow.setContent("22");
							routeinfoWindow.open(geo.currentMap, marker);
				        }
					} else if (geo.currentAreaRoutes[latlng][imageId]) {
						$.mobile.changePage('#route')
						comm.getRoutesAndImage(geo.currentAreaRoutes[latlng][imageId], imageId)						
					}
				});
			}
		},
		updateLocation: function () {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					currentClimage.latitude = position.coords.latitude
					currentClimage.longitude = position.coords.longitude
					geo.centreToLocation(currentClimage.latitude, currentClimage.longitude, currentClimage.globalZoom)
					$('#latitude').val(position.coords.latitude)
					$('#longitude').val(position.coords.longitude)
//		  			alert('Latitude: '		  + position.coords.latitude		  + '\n' +
//		  				  'Longitude: '		 + position.coords.longitude		 + '\n' +
//		  				  'Accuracy: '		  + position.coords.accuracy		  + '\n' +
				}, function(error) {  alert('code: '	+ error.code	+ '\n' +
						  'message: ' + error.message + '\n'); },
				{ maximumAge: 60000, timeout: 30000, enableHighAccuracy: true }
			);
		},
		// get routes at the tapped climbing site
		markAreaRoutes: function (areaId) {
			$.getJSON('http://'+comm.server+'/api/route/getAreaRoutes/'+areaId, function(data) {
				this.currentAreaRoutes = {}
				$(data).each(function() {
					geo.addRoute($(this).attr('latitude'), $(this).attr('longitude'), $(this).attr('routeId'), $(this).attr('imageId'))
				})
			})
		},
		// get climbing sites and place markers on the map denoting them
		markSitesNear: function (latitude, longitude) {
			$.getJSON('http://'+comm.server+'/api/route/getAreas', function(data) {
				$(data).each(function() {
					geo.addArea($(this).attr('latitude'), $(this).attr('longitude'), $(this).attr('areaId'))
				})
			})
		}
	}
})()
