var global = {}

////////////////////////
// mapping ids to values

var allAreas = (function() {
	var areas = {}
	var climages = {}
	return {
		addArea: function(area) {
			areas[area.id] = area
		},
		addClimage: function(id, climage) {
			if(climages[id] == null) climages[id] = []
			mergeIfFound(climages[id], climage)
			allImages.addClimage(climage)
		},
		getArea: function(id) { return areas[id]; },
		getAreas: function() { return areas; },
		getClimages: function(id) { return climages[id]; }
	}
})()

// id -> { data (base64), routes (array) }
// - id == 0: new captured image
var allImages = (function() {
	var images = {}
	var routes = {}
	return {
		addClimage: function(climage) {
			images[climage.id] = climage.mergeWith(images[climage.id])
		},
		addRoute: function(id, route) {
			if(routes[id] == null) routes[id] = {}
			routes[id][route.id] = true
			allRoutes.addRoute(route)
		},
		getImage: function(id) { return images[id] },
		getRouteIds: function(id) { return routes[id]; }
	}
})()

var allRoutes = (function() {
	var routes = {}
	return {
		addRoute: function(route) {
			routes[route.id] = route
		},
		getRoute: function(id) { return routes[id]; }
	}
})()

////////////
// classes
var Area = function(id, name, latitude, longitude) {
	this.id = id; this.name = name; this.latitude = latitude; this.longitude = longitude;
}
var Climage = function(id, name, latitude, longitude, imageData) {
	this.latitude = latitude; this.longitude = longitude; this.id = id; this.name = name; this.imageData = imageData;
}
Climage.prototype = {
	fields:["1","2"],
	mergeWith:function(otherClimage) {
		this.imageData = !this.imageData ? (!otherClimage ? null : otherClimage.imageData) : this.imageData
		return this;
	}
}
var Route = function(id, name, routePointsX, routePointsY, grade) {
	this.id = id; this.name = name; this.routePointsX = routePointsX; this.routePointsY = routePointsY; this.grade = grade;
}

Route.prototype.length = function() { return 1; }


