var global = {}

////////////////////////
// mapping ids to values

var allAreas = (function() {
	var areas = {}
	var climages = {}
	return {
		addArea: function(area) {
			areas[area.areaId] = area
		},
		addClimage: function(areaId, climage) {
			if(climages[areaId] == null) climages[areaId] = []
			climages[areaId].push(climage)
			allImages.addClimage(climage)
		},
		getArea: function(areaId) { return areas[areaId]; },
		getClimages: function(areaId) { return climages[areaId]; }
	}
})()

// climageId -> { data (base64), routes (array) }
// - climageId == 0: new captured image
var allImages = (function() {
	var images = {}
	var routes = {}
	return {
		addClimage: function(climage) {
			images[climage.climageId] = climage
		},
		addRoute: function(climageId, route) {
			if(routes[climageId] == null) routes[climageId] = []
			routes[climageId].push(route.routeId)
			allRoutes.addRoute(route)
		},
		getImage: function(climageId) { return images[climageId] },
		getRoutes: function(climageId) { return routes[climageId]; }
	}
})()

var allRoutes = (function() {
	var routes = {}
	return {
		addRoute: function(route) {
			routes[route.routeId] = route
		},
		getRoute: function(routeId) { return routes[routeId]; }
	}
})()

////////////
// classes
var Area = function(areaId, name, latitude, longitude) {
	this.areaId = areaId; this.name = name; this.latitude = latitude; this.longitude = longitude;
}
var Climage = function(climageId, name, latitude, longitude, imageData) {
	this.latitude = latitude; this.longitude = longitude; this.climageId = climageId; this.name = name; this.imageData = imageData;
}
var Route = function(routeId, name, routePointsX, routePointsY, grade) {
	this.routeId = routeId; this.name = name; this.routePointsX = routePointsX; this.routePointsY = routePointsY; this.grade = grade;
}

Route.prototype.length = function() { return 1; }


