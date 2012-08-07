function Climage() {
	this.newRoutePointsX = new Array();
	this.newRoutePointsY = new Array();
	this.previousX = null;
	this.previousY = null;
	this.Xsize = 4;
	this.image = null;
	this.latitude = 53; this.longitude = 0;
	this.ctx = $('#canvas')[0].getContext('2d');
	this.globalZoom = 6; this.areaZoom = 14;
	this.existingRouteColour = '#0f0'; this.newRouteColour = '#00f';
	this.areaId = 0; this.imageId = 0;
};
var climagePrototype = {
	addRoutePoint: function( x,y ) {
		this.setStyle(this.newRouteColour);
		if(!this.previousX && !this.previousY) {
			this.drawRouteStart(x ,y);
		} else {
			this.drawRouteLine(this.previousX, this.previousY, x, y);
		}
		this.previousX = x;
		this.previousY = y;
		this.newRoutePointsX.push(x);
		this.newRoutePointsY.push(y);
	},
	set: function( imageId, image, routes ) {
		var that = this
		if( image && routes.length>0 ) {
			$('#routeName').val("");
			$('#latitude').val("")
			$('#longitude').val("")
			this.routePointsX = []; this.routePointsY = [];
			$(routes).each(function() {
				$('#routeName').val($(this).attr('name'))
				$('#latitude').val($(this).attr('latitude'))
				$('#longitude').val($(this).attr('longitude'))
				that.routePointsX.push($.parseJSON($(this).attr('routePointsX')))
				that.routePointsY.push($.parseJSON($(this).attr('routePointsY')))
			})
			this.imageId = imageId
			this.ctx.clearRect(0,0,300,200);
			this.drawImage(image);
		}
	},
	drawRoutePoints: function() {
		this.setStyle(this.existingRouteColour);
		for(var i2=0; i2<this.routePointsX.length; i2++) {
			var xset = this.routePointsX[i2]; var yset = this.routePointsY[i2];
			var previousX, previousY;			
			for(var i1=0; i1<xset.length; i1++) {
				if(i1==0) {
					this.drawRouteStart(xset[0],yset[0]);
					previousX = xset[0];
					previousY = yset[0];
				} else {
					this.drawRouteLine(previousX, previousY, xset[i1], yset[i1])
					previousX = xset[i1];
					previousY = yset[i1];
				}
			}
		}
	},
	drawImage: function(image) {
		this.image = new Image();
		var that = this;
		this.image.onload = function() {
			that.ctx.drawImage(that.image,0,0,300,200);
			that.drawRoutePoints();
		};
		this.image.src = image;
	},
	setStyle: function( strokeColour ) {
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = strokeColour;
	},
	drawRouteStart: function( x,y ) {
		this.ctx.beginPath();
		this.ctx.moveTo(x-this.Xsize, y-this.Xsize);
		this.ctx.lineTo(x+this.Xsize, y+this.Xsize);
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.moveTo(x+this.Xsize, y-this.Xsize);
		this.ctx.lineTo(x-this.Xsize, y+this.Xsize);
		this.ctx.stroke();
	},
	drawRouteLine: function ( x1,y1,x2,y2 ) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	},
	setGrade: function ( grade ) {
		this.grade = grade;
	},
	takePhoto: function() {
		var that = this;
		navigator.camera.getPicture(
			function(url) {
				that.image = new Image();
				that.image.onload = function() {
					that.ctx.drawImage(that.image,0,0,300,200);
					that.image = $('#canvas')[0].toDataURL();
				};
				that.image.src = url;
			},
			function(msg) { /* $('#output').append(msg); */ }, // fail
			{ quality: 40, targetWidth: 300, targetHeight: 200 }
		); 

//		this.image = new Image();
//		var that = this;
//		this.image.onload = function() {
//			that.ctx.drawImage(that.image,0,0,300,200);
//			that.image = $('#canvas')[0].toDataURL();
//		};
//		this.image.src = 'images/asdf.png';		
	},
	clearRoutes: function () {
		this.areaId = 0
		this.routePointsX = new Array();
		this.routePointsY = new Array();
	},
	setAreaId: function( areaId ) {
		this.areaId = areaId
		$('#areaId').val(areaId)
	},
	save: function() {
		var data = {
				name: $('#routeName').val(),
				routePointsX: JSON.stringify(currentClimage.newRoutePointsX),
				routePointsY: JSON.stringify(currentClimage.newRoutePointsY),
				latitude: $('#latitude').val(),
				longitude: $('#longitude').val(),
				areaId: $('#areaId').val()
			};
		if(currentClimage.imageId==0) {
			data['image'] = currentClimage.image
			comm.saveRouteWithImage(data)			
		} else {
			data['imageId'] = currentClimage.imageId
			comm.saveRoute(data)			
		}
	}
};

Climage.prototype = climagePrototype;

