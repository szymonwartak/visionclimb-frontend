
// wrapper for images with routes data and canvas functions
var currentClimage = (function() {
	return {
		newRoutePointsX:[],
		newRoutePointsY:[],
		previousX:null,
		previousY:null,
		Xsize:4,
		climageId:0,
		imageData:"",
		existingRouteColour:'#0f0',
		newRouteColour:'#00f',
		gradings:[
			['','5.5','5.6','5.7','5.8','5.9','5.10a','5.10b','5.10c','5.10d','5.11a','5.11b','5.11c','5.11d','5.12a','5.12b','5.12c','5.12d','5.13a','5.13b','5.13c','5.13d','5.14a','5.14b','5.14c','5.14d'], // YDS
			['','4a' ,'4b' ,'4c' ,'4c' ,'5a' ,'5a'   ,'5b'   ,'5b'   ,'5c'   ,'5c'   ,'5c'   ,'6a'   ,'6a'   ,'6a'   ,'6a'   ,'6b'   ,'6b'   ,'6b'  ,'6c'    ,'6c'   ,'6c'   ,'7a'   ,'7a'   ,'7b'   ,'7b'   ] // British (tech)
		],
		ctx: function() { return $('#canvas')[0].getContext('2d'); },
		clearData: function() {
			this.newRoutePointsX = [];
			this.newRoutePointsY = [];
			this.previousX = null;
			this.previousY = null;
		},
		refresh: function() {
			this.drawImage(allImages.getImage(this.climageId).imageData)
		},
		addRoutePoint: function( x,y ) {
			this.setRouteStyle(this.newRouteColour);
			if(!this.previousX && !this.previousY) {
				this.drawRouteStart(x ,y);
			} else {
				this.drawLine(this.previousX, this.previousY, x, y);
			}
			this.previousX = x;
			this.previousY = y;
			this.newRoutePointsX.push(x);
			this.newRoutePointsY.push(y);
		},
		set: function( climageId ) {
			this.climageId = climageId
			this.refresh()
		},
		drawRoutePoints: function() {
			var routes = allImages.getRoutes(this.climageId)
			for(var i2=0; i2<routes.length; i2++) {
				var xset = allRoutes.getRoute(routes[i2]).routePointsX; var yset = allRoutes.getRoute(routes[i2]).routePointsY;
				var previousX, previousY;
				for(var i1=0; i1<xset.length; i1++) {
					if(i1==0) {
						this.setRouteStyle(this.existingRouteColour);
						this.drawRouteStart(xset[0],yset[0]);
					} else {
						this.setRouteStyle(this.existingRouteColour);
						this.drawLine(previousX, previousY, xset[i1], yset[i1])
					}
					previousX = xset[i1];
					previousY = yset[i1];
				}
			}
			// now draw the labels so the route lines done overwrite them
			var routeLabelsX = [], routeLabelsY = []
			for(var i2=0; i2<routes.length; i2++) {
				var xset = allRoutes.getRoute(routes[i2]).routePointsX; var yset = allRoutes.getRoute(routes[i2]).routePointsY;
				var grade = allRoutes.getRoute(routes[i2]).grade
				var previousX, previousY;
				var labelled = false
				for(var i1=0; i1<xset.length; i1++) {
					if(i1>0 && !labelled) {
						var xdiff = xset[i1]-previousX
						var ydiff = yset[i1]-previousY
						for(var b1=0;b1<Math.sqrt(xdiff*xdiff+ydiff*ydiff);b1++) {
							var overlapping = false
							var proposedX = previousX, proposedY = previousY;
							for(var b2=0;b2<routeLabelsX.length;b2++) {
								proposedX = previousX+b1*xdiff
								proposedY = previousY+b1*ydiff
								if(routeLabelsX[b2]+this.labelWidth>proposedX && routeLabelsX[b2]-this.labelWidth<proposedX &&
										routeLabelsY[b2]+this.labelHeight>proposedY && routeLabelsY[b2]-this.labelHeight<proposedY) {
									overlapping = true
									break
								}
							}
							if(!overlapping) {
								this.setLabelStyle()
								this.drawLabel(grade, proposedX, proposedY)
								labelled = true
								routeLabelsX.push(proposedX); routeLabelsY.push(proposedY);
								break
							}
						}
					}
					previousX = xset[i1];
					previousY = yset[i1];
				}
			}
		},
		drawLabel: function(grade, x, y) {
			this.ctx().fillRect(x-this.labelWidth/2, y-this.labelHeight/2, this.labelWidth, this.labelHeight)
			this.ctx().strokeText(grade, x-this.labelWidth/2+2, y)
		},
		drawImage: function(imageSrc) {
			this.clearData()
			var image = new Image();
			var that = this;
			image.onload = function() {
				that.ctx().clearRect(0,0,200,300);
				that.ctx().drawImage(image,0,0,200,300);
				that.imageData = $('#canvas')[0].toDataURL()
				if(that.climageId != 0)
					that.drawRoutePoints();
			};
			image.src = imageSrc;
		},
		setRouteStyle: function( strokeColour ) {
			this.ctx().lineWidth = 2
			this.ctx().strokeStyle = strokeColour
		},
		setLabelStyle: function() {
			this.labelWidth = 30; this.labelHeight = 15;
			this.ctx().lineWidth = 1
			this.ctx().strokeStyle = '#fff'
			// for route labels
			this.ctx().fillStyle = '#777';
			this.ctx().font = '10px sans-serif';
			this.ctx().textBaseline = 'middle';
		},
		drawRouteStart: function( x,y ) {
			this.drawLine(x-this.Xsize, y-this.Xsize,x+this.Xsize, y+this.Xsize)
			this.drawLine(x+this.Xsize, y-this.Xsize,x-this.Xsize, y+this.Xsize)
		},
		drawLine: function ( x1,y1,x2,y2 ) {
			this.ctx().beginPath();
			this.ctx().moveTo(x1, y1);
			this.ctx().lineTo(x2, y2);
			this.ctx().stroke();
		},
		setGrade: function ( grade ) {
			this.grade = grade;
		},
		takePhoto: function() {
			if(!testEnv) {
				var that = this;
				navigator.camera.getPicture(
					function(url) { // successful photo
						that.climageId = 0
						$.mobile.changePage('#route')
						that.drawImage(url)
					},
					function(msg) { /* $('#output').append(msg); */ }, // fail
					{ quality: 40, targetWidth: 200, targetHeight: 300 }
				);
			} else {
				this.climageId = 0
				setTimeout(function() {
					$.mobile.changePage('#route')
					currentClimage.drawImage('images/asdf.png')
				}, 500)
			}
		},
		save: function() {
			if(!this.newRoutePointsX || this.newRoutePointsX.length<2) {
				alert('mark the route with at least 2 points')
				return
			} else if($('#grade').val() == 1) {
				alert('please select a grade for the route ( > 1 )')
				return
			}
			var data = {
					name: $('#routeName').val(),
					grade: $('#gradeYDS').val(),
					routePointsX: JSON.stringify(this.newRoutePointsX),
					routePointsY: JSON.stringify(this.newRoutePointsY),
					latitude: geo.latitude,
					longitude: geo.longitude,
					areaId: geo.areaId
				};
			if(this.climageId==0) {
				data['imageData'] = currentClimage.imageData
				comm.saveRoute('postRouteWithImage', data)
			} else {
				data['climageId'] = this.climageId
				comm.saveRoute('postRoute', data)
			}
		}
	}
})()
