var comm = (function() {
	return {
		server: "www.visionclimb.com",
//		server: "localhost:8080",
		saveRouteWithImage: function(climageData) {
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/postRouteWithImage',
				data: climageData,
				success: function(data) {
					alert(data);
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		saveRoute: function(climageData) {
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/postRoute',
				data: climageData,
				success: function(data) {
					alert(data);
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