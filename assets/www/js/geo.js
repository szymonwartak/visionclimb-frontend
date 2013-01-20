// class with map and geolocation related functionality

var geo = (function() {
	// private vars and functions
	var routeinfoWindow = new google.maps.InfoWindow();
	
	// public vars and functions
	return {
		areaId:"0",
		latitude:0,
		longitude:0,
		globalZoom:7,
		areaZoom:14,
		currentZoom:7,
		areaTolerance:0.01,
		lastGpsRefresh:0,
	// stores the route in the current area indexed by latitude+"_"+longitude
		currentMap:null,
		refresh: function(isForced) {
			routeinfoWindow.close()
			if(geo.currentZoom == geo.areaZoom) comm.getAreaClimages(geo.areaId)
			else if(geo.currentZoom == geo.globalZoom) comm.getAreasNear(geo.latitude, geo.longitude)
		},
		reset: function() {
			routeinfoWindow.close()
			geo.currentZoom = geo.globalZoom
			geo.areaId = 0
			geo.updateLocation(function() {
				geo.centreToLocation(geo.latitude, geo.longitude, geo.globalZoom)
				comm.getAreasNear(geo.latitude, geo.longitude)
			}, false)
		},
		centreToLocation: function(latitude, longitude, zoom) {
			var mapOptions = {
				zoom: zoom,
				streetViewControl : false,
				center: new google.maps.LatLng(latitude, longitude),
//				mapTypeId: google.maps.MapTypeId.SATELLITE
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			geo.currentMap = new google.maps.Map($('#map-square')[0], mapOptions);
		},
		markArea: function (areaId) {
			var area = allAreas.getArea(areaId)
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(area.latitude, area.longitude),
				map: geo.currentMap,
				title:area.name
			});
			google.maps.event.addListener(marker,'click', function() {
				geo.currentZoom = geo.areaZoom
				geo.areaId = areaId
				geo.centreToLocation(area.latitude, area.longitude, geo.areaZoom)
				comm.getAreaClimages(areaId)
			});
		},
		markClimages: function (climages) {
			var climagesLatLng = {}
			$(climages).each(function() {
				var latlng = this.latitude+"_"+this.longitude
				if(climagesLatLng[latlng] == null) climagesLatLng[latlng] = {}
				if(climagesLatLng[latlng].climage == null) climagesLatLng[latlng].climage = []
				climagesLatLng[latlng].climage.push(this)
				climagesLatLng[latlng].latitude = this.latitude
				climagesLatLng[latlng].longitude = this.longitude
			})
			for(var i1 in climagesLatLng) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(climagesLatLng[i1].latitude, climagesLatLng[i1].longitude),
					map: geo.currentMap,
					markerIndex: i1
				});
				google.maps.event.addListener(marker,'click', function() {
					if(climagesLatLng[this.markerIndex].climage.length > 1) {
						// popup with route images
						var content = "Multiple images<br/>"
						for(var i2 in climagesLatLng[this.markerIndex].climage) {
							if(climagesLatLng[this.markerIndex].climage.hasOwnProperty(i2))
								content += "<a href='javascript:void(0);' onclick='geo.openRoutes(\""+climagesLatLng[this.markerIndex].climage[i2].id+"\");return false;'>route "+i2+"</a><br/>"
						}
						routeinfoWindow.setContent(content);
						routeinfoWindow.open(geo.currentMap, marker);
					} else {
						routeinfoWindow.close()
						geo.openRoutes(climagesLatLng[this.markerIndex].climage[0].id)
					}
				});
			}
		},
		openRoutes: function(climageId) {
			$.mobile.changePage('#route')
			comm.getClimage(climageId)
		},
		updateLocation: function (callback, isSaving) {
			var lastUpdateDiff = new Date().getTime() / 1000 - geo.lastGpsRefresh
			if((isSaving==true && lastUpdateDiff>60) || lastUpdateDiff>300) {
				navigator.geolocation.getCurrentPosition(
					function(position) {
						geo.lastGpsRefresh = new Date().getTime() / 1000
						geo.latitude = Math.round(position.coords.latitude*100)/100
						geo.longitude = Math.round(position.coords.longitude*100)/100
						geo.centreToLocation(geo.latitude, geo.longitude, geo.globalZoom)
	//		  			alert('Latitude: '		  + position.coords.latitude		  + '\n' +
	//		  				  'Longitude: '		 + position.coords.longitude		 + '\n' +
	//		  				  'Accuracy: '		  + position.coords.accuracy		  + '\n' +
						if(callback != null) callback()
					}, function(error) {  },
					{ maximumAge: 60000, timeout: 30000, enableHighAccuracy: true }
				);
			} else {
				if(callback != null) callback()
			}
		}
	}
})()
