var comm = (function() {
	return {
		server: "www.visionclimb.com",
//		server: "localhost:8080",
		postClimage: function() {
			$.ajax({
				type: 'POST',
				url: 'http://'+this.server+'/api/route/postworks',
				data: {
					name: $('#routeName')[0].value,
					routePointsX: JSON.stringify(currentClimage.routePointsX),
					routePointsY: JSON.stringify(currentClimage.routePointsY),
					latitude: $('#latitude').val(),
					longitude: $('#longitude').val(),
					image: currentClimage.image
				},
				success: function(data) {
					alert(data);
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		getRoute: function(routeNum) {
			$.getJSON('http://'+this.server+'/api/route/get/'+routeNum, function(data) {
				alert(data.name+"_"+data.image+"_"+data.routePointsX+"_"+data.routePointsY)
				currentClimage.drawRoute(data.name, data.image, $.parseJSON(data.routePointsX), $.parseJSON(data.routePointsY));
			});
		}
	}
})()