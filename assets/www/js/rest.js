var comm = (function() {
	return {
		server: "www.visionclimb.com",
//		server: "localhost:8080",
		saveRoute: function(saveFunction, climageData) {
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/'+saveFunction,
				data: climageData,
				success: function(data) {
					alert('saved')
					geo.markAreaRoutes(currentClimage.areaId)
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		getRoutesAndImage: function(routeNums, imageId) {
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
				contentType: 'application/x-www-form-urlencoded'
			});
		}
	}
})()