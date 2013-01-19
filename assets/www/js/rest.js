var savedData = null
var comm = (function() {
	return {
		server: (testEnv!=false ? "localhost:8080" : "www.visionclimb.com"),
		saveRoute: function(saveFunction, climageData) {
			$.ajax({
				type: 'POST',
				url: 'http://'+comm.server+'/api/route/'+saveFunction,
				data: climageData,
				success: function(data) {
					alert('saved')
					if(saveFunction=="postRouteWithImage") {
						allImages.addClimage(new Climage(data.climageId, climageData.name, climageData.latitude, climageData.longitude, currentClimage.imageData))
					}
					allImages.addRoute(data.climageId, new Route(data.routeId, climageData.name, $.parseJSON(climageData.routePointsX), $.parseJSON(climageData.routePointsY), climageData.grade))
					currentClimage.climageId = data.climageId
					currentClimage.refresh()
				},
				failure: function(data) {
					alert('save failed')
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		getClimage: function(climageId) {
			$.getJSON('http://'+comm.server+'/api/route/getClimage/'+climageId, function(data) {
				if(data.climageId == null) {
					alert("Error - climageId null");
				} else {
					// update model
					allImages.addClimage(new Climage(data.climageId, data.name, data.latitude, data.longitude, data.imageData))
					$(data.routes).each(function() {
						allImages.addRoute(data.climageId, new Route(this.routeId, this.name, $.parseJSON(this.routePointsX), $.parseJSON(this.routePointsY), this.grade))
					})
					// update view
					currentClimage.set(data.climageId)
				}
			});
		},
		// get routes at the tapped climbing site
		getAreaClimages: function (areaId) {
			$.getJSON('http://'+comm.server+'/api/route/getAreaClimages/'+areaId, function(data) {
				var climages = []
				$(data).each(function() {
					var climage = new Climage(this.climageId, this.name, this.latitude, this.longitude)
					allAreas.addClimage(areaId, climage)
					climages.push(climage)
				})
				geo.markClimages(climages)
			})
		},
		// get climbing sites and place markers on the map denoting them
		getAreasNear: function (latitude, longitude) {
			$.getJSON('http://'+comm.server+'/api/route/getAreas', function(data) {
				$(data).each(function() {
					allAreas.addArea(new Area(this.areaId, this.name, this.latitude, this.longitude))
					geo.markArea(this.areaId)
				})
			})
		}
	}
})()