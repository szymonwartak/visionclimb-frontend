var savedData = null
var comm = (function() {
	return {
		server: (testEnv!=false ? "localhost:8080" : "www.visionclimb.com"),
		saveRoute: function(saveFunction, climageData) {
			savedData = climageData
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/'+saveFunction,
				data: climageData,
				success: function(data) {
					alert('saved')
					// update the current state: 1) routes on map, and 2) routes on current image
					geo.addRoute(savedData.latitude, savedData.longitude, data.routeId, data.imageId)
					currentClimage.addRoute(savedData.routePointsX, savedData.routePointsY, savedData.grade)
//					geo.markAreaRoutes(currentClimage.areaId)
//					comm.getRoutesAndImage(currentClimage.routes, data.imageId)
				},
				failure: function(data) {
					alert('save failed')
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		getRoutesAndImage: function(routeNums, imageId) {
			currentClimage.clear()
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/getRoutesAndImage',
				data: {
					routeIds: JSON.stringify(routeNums),
					imageId: imageId 
				},
				success: function(data) {
					currentClimage.set(data.imageId, data.image, data.routes)
				},
				failure: function(data) {
					alert('get failed')
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		}
	}
})()