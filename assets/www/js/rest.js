var savedData = null
var comm = (function() {
	return {
		server: (testEnv!=false ? "http://localhost:9000" : "http://www.visionclimb.com"),
		saveRoute: function(saveFunction, climageData) {
			log.debug("comm\tsaveRoute(saveFunction="+saveFunction+",climageData={" +
					",name="+climageData['name']+
					",grade="+climageData['grade']+
					",routePointsX="+climageData['routePointsX']+
					",routePointsY="+climageData['routePointsY']+
					",latitude="+climageData['latitude']+
					",longitude="+climageData['longitude']+
					",areaId="+climageData['areaId']+
					",imageData="+(!climageData['imageData'] ? "NULL" : climageData['imageData'].substring(0,20))+
					",climageId="+climageData['climageId']+
					"})")
			climageData['userId'] = USERID
			$.ajax({
				type: 'POST',
				url: comm.server+'/api/route/'+saveFunction,
                dataType: "json",
				data: climageData,
				success: function(data) {
					log.debug("comm\tsaveRoute_success(climageId="+data.climageId+",routeId="+data.routeId+")")
					if(saveFunction=="postRouteWithImage") {
						allAreas.addClimage(geo.areaId, new Climage(data.climageId, climageData.name, climageData.latitude, climageData.longitude, currentClimage.imageData))
					}
					allImages.addRoute(data.climageId, new Route(data.routeId, climageData.name, $.parseJSON(climageData.routePointsX), $.parseJSON(climageData.routePointsY), climageData.grade))
					currentClimage.climageId = data.climageId
					currentClimage.refresh()
				},
				failure: function(data) {
					log.debug("comm\tsaveRoute_failure(data="+data+")")
				},
				contentType: 'application/x-www-form-urlencoded'
			});
		},
		getClimage: function(climageId, isForceRefresh) {
			var updateView = function(climageId) {
				currentClimage.set(climageId)
			}
			if(isForceRefresh || !allImages.getImage(climageId).imageData) {
				log.debug("comm\tONLINE\tgetClimage(climageId="+climageId+",isForceRefresh="+isForceRefresh+")")
				$.getJSON(comm.server+'/api/route/getClimage/'+climageId+'/'+USERID, function(climage) {
					if(climage.climageId == null) {
						alert("Error - climageId null");
					} else {
						// update model
						allAreas.addClimage(climage.climageId.substring(0,1), new Climage(climage.climageId, climage.name, climage.latitude, climage.longitude, climage.imageId))
						$(climage.routes).each(function() {
							allImages.addRoute(climage.climageId, new Route(this.routeId, this.name, $.parseJSON(this.routePointsX), $.parseJSON(this.routePointsY), this.grade))
						})
                        updateView(climage.climageId)
					}
				});
			} else {
				log.debug("comm\tOFFLINE\tgetClimage(climageId="+climageId+",isForceRefresh="+isForceRefresh+")")
				updateView(climageId)
			}
		},
		// get routes at the tapped climbing site
		getAreaClimages: function (areaId, isForceRefresh) {
			var updateView = function(climages) {
				geo.markClimages(climages)
			}
			if(isForceRefresh || !allAreas.getClimages(areaId)) {
				log.debug("comm\tONLINE\tgetClimage(areaId="+areaId+",isForceRefresh="+isForceRefresh+")")
				$.getJSON(comm.server+'/api/route/getAreaClimages/'+areaId+'/'+USERID, function(data) {
					var climages = []
					$.each(data, function() {
						var climage = new Climage(this.climageId, this.name, this.latitude, this.longitude, this.imageId)
						allAreas.addClimage(areaId, climage)
						climages.push(climage)
					})
					updateView(climages)
				})
			} else {
				log.debug("comm\tOFFLINE\tgetClimage(areaId="+areaId+",isForceRefresh="+isForceRefresh+")")
				updateView(allAreas.getClimages(areaId))
			}
		},
		// get climbing sites and place markers on the map denoting them
		getAreasNear: function (latitude, longitude, isForceRefresh) {
			var updateView = function(areaId) {
				geo.markArea(areaId)
			}
			if(isForceRefresh || Object.size(allAreas.getAreas())==0) {
				log.debug("comm\tONLINE\tgetAreasNear(latitude="+latitude+",longitude="+longitude+",isForceRefresh="+isForceRefresh+")")
				$.getJSON(comm.server+'/api/route/getAreas/'+USERID, function(data) {
                    $.each(data, function() {
						allAreas.addArea(new Area(this.areaId, this.name, this.latitude, this.longitude))
                        updateView(this.areaId)
                    })
				})
			} else {
				log.debug("comm\tOFFLINE\tgetAreasNear(latitude="+latitude+",longitude="+longitude+",isForceRefresh="+isForceRefresh+")")
				for(var areaId in allAreas.getAreas()) {
					updateView(areaId)
				}
			}
		}
	}
})()