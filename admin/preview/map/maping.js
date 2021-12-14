var mymap;
            var lyrOSM;
            var lyrWatercolor;
            var lyrTopo;
            var lyrImagery;
            var lyrOutdoors;
            var lyrEagleNests;
            var lyrRaptorNests;
            var lyrClientLines;
            var lyrBUOWL;
            var lyrGBH;
            var lyrRoads;
			var lyrGith;
			var lyrBuildings;
			var lyrLandUse;
            var lyrSilanga;
            var lyrOlkSheet2;
            var lyrOlkSheet3;
            var lyrOlkSheet4;
            var lyrSearch;
            var lyrMarkerCluster;
            var mrkCurrentLocation;
            var fgpDrawnItems;
            var ctlAttribute;
            var ctlScale;
            var ctlMouseposition;
            var ctlMeasure;
            var ctlEasybutton;
            var ctlSidebar;
			var ctlRsidebar
            var ctlLayers;
            var ctlDraw;
            var ctlStyle;
            var objBasemaps;
            var objOverlays;
			var arLayersIDs  = [];
            var arProjectIDs = [];
            var arHabitatIDs = [];
            var arEagleIDs   = [];
            var arRaptorIDs  = [];
            
            $(document).ready(function(){
                
                //  ********* Map Initialization ****************
                
                mymap = L.map('mapdiv', {center: [-0.262727 ,36.188879], zoom:9, attributionControl:false});
                
                // ctlSidebar = L.control.sidebar('side-bar').addTo(mymap);
				
                ctlEasybutton = L.easyButton('glyphicon-transfer', function(){
                   ctlSidebar.toggle(); 
                }).addTo(mymap);
				
				
				
				 ctlEasybutton = L.easyButton('glyphicon-cog', function(){
                   ctlRsidebar.toggle(); 
                }).addTo(mymap);
               
                ctlAttribute = L.control.attribution().addTo(mymap);
                ctlAttribute.addAttribution('OSM');
                ctlAttribute.addAttribution('&copy; <a href="http://nakuplan.com">Nakuplan Consultants Kenya</a>');
                
                ctlScale = L.control.scale({position:'bottomleft', metric:false, maxWidth:200}).addTo(mymap);

                ctlMouseposition = L.control.mousePosition().addTo(mymap);
                
                ctlStyle = L.control.styleEditor({position:'topright'}).addTo(mymap);
                ctlMeasure = L.control.polylineMeasure().addTo(mymap);
                
                //   *********** Layer Initialization **********
                
                lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
                lyrTopo = L.tileLayer.provider('OpenTopoMap');
                lyrImagery = L.tileLayer.provider('Esri.WorldImagery');
                lyrOutdoors = L.tileLayer.provider('Thunderforest.Outdoors');
                lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor');
                mymap.addLayer(lyrOSM);
                
                fgpDrawnItems = new L.FeatureGroup();
                fgpDrawnItems.addTo(mymap);
				
				
				lyrBuildings = L.geoJSON.ajax('data/route.geojson').addTo(mymap);

               // lyrRoads = L.geoJSON.ajax('data/plotiti.geojson',{onEachFeature:processGith }).addTo(mymap);
				
				// lyrLandUse = L.geoJSON.ajax('data/docs.geojson', {
    //                 //style: styleLanduseLandUse, 
    //                 onEachFeature: processLanduse, 
    //                 filter: fliterPlots
    //             }).addTo(mymap);

				// lyrLandUse.on('data:loaded', function(){
				// 	arLayersIDs.sort(function(a,b){return a-b});
				// 	$("#txtFindPlot").autocomplete({
				// 		source:arLayersIDs
				// 	});
				// });
			
				lyrGith = L.geoJSON.ajax('data/olksheet1.geojson',
                    {  
                        onEachFeature: processLanduse

                    } ).addTo(mymap);
				lyrGith.on('data:loaded', function(){
					mymap.fitBounds(lyrGith.getBounds());

                lyrSilanga = L.geoJSON.ajax('data/silangasheet3.geojson',
                    {onEachFeature: processLanduse}).addTo(mymap);

                lyrOlkSheet3 = L.geoJSON.ajax('data/olksouthsheet3.geojson',
                    {onEachFeature: processLanduse}).addTo(mymap);

                lyrOlkSheet4 = L.geoJSON.ajax('data/olksouthsheet4.geojson',
                    { onEachFeature: processLanduse} ).addTo(mymap);

                lyrOlkSheet2 = L.geoJSON.ajax('data/olksouthsheet2.geojson',
                    { onEachFeature: processLanduse} ).addTo(mymap);
					
				
                lyrEagleNests = L.geoJSON.ajax('data/wildlife_eagle.geojson', {pointToLayer:returnEagleMarker}).addTo(mymap);
                lyrEagleNests.on('data:loaded', function(){
                    arEagleIDs.sort(function(a,b){return a-b});
                    $("#txtFindEagle").autocomplete({
                        source:arEagleIDs
                    });
                });
                
                lyrMarkerCluster = L.markerClusterGroup();
                lyrRaptorNests = L.geoJSON.ajax('data/wildlife_raptor.geojson', {pointToLayer:returnRaptorMarker});
                lyrRaptorNests.on('data:loaded', function(){
                    arRaptorIDs.sort(function(a,b){return a-b});
                    $("#txtFindRaptor").autocomplete({
                        source:arRaptorIDs
                    });
                    lyrMarkerCluster.addLayer(lyrRaptorNests);
                    lyrMarkerCluster.addTo(mymap);
                });
                
                lyrClientLines = L.geoJSON.ajax('data/client_lines.geojson', {style:styleClientLinears, onEachFeature:processClientLinears}).addTo(mymap);
                lyrClientLines.on('data:loaded', function(){
                    arProjectIDs.sort(function(a,b){return a-b});
                    $("#txtFindProject").autocomplete({
                        source:arProjectIDs
                    });
                });
                
                lyrBUOWL = L.geoJSON.ajax('data/wildlife_buowl.geojson', {style:styleBUOWL, onEachFeature:processBUOWL, filter:filterBUOWL}).addTo(mymap);
                lyrBUOWL.on('data:loaded', function(){
                    arHabitatIDs.sort(function(a,b){return a-b});
                    $("#txtFindBUOWL").autocomplete({
                        source:arHabitatIDs
                    });
                });
                
                lyrGBH = L.geoJSON.ajax('data/wildlife_gbh.geojson', {style:{color:'fuchsia'}}).bindTooltip("GBH Nesting Area").addTo(mymap);
                
                // ********* Setup Layer Control  ***************
                
                objBasemaps = {
                    "Open Street Maps": lyrOSM,
                    "Topo Map":lyrTopo,
                    "Imagery":lyrImagery,
                    "Outdoors":lyrOutdoors,
                    "Watercolor":lyrWatercolor
                };
                
                objOverlays = {
                    "Plot Status":lyrGith,
					"Buildings":lyrBuildings,
					"Land Use":lyrLandUse,
                    
                };
                
                ctlLayers = L.control.layers(objBasemaps, objOverlays).addTo(mymap);
                
                // **********  Setup Draw Control ****************
                
                ctlDraw = new L.Control.Draw({
                    draw:{
                        circle:false,
                        rectangle:false,
                    },
                    edit:{
                        featureGroup:fgpDrawnItems
                    }
                });
                ctlDraw.addTo(mymap);
                
                mymap.on('draw:created', function(e){
                    fgpDrawnItems.addLayer(e.layer);
                });
                
                // ************ Location Events **************
                
                mymap.on('locationfound', function(e) {
                    console.log(e);
                    if (mrkCurrentLocation) {
                        mrkCurrentLocation.remove();
                    }
                    mrkCurrentLocation = L.circle(e.latlng, {radius:e.accuracy/2}).addTo(mymap);
                    mymap.setView(e.latlng, 14);
                });
                
                mymap.on('locationerror', function(e) {
                    console.log(e);
                    alert("Location was not found");
                })
                
            });

            //  ********* BUOWL Functions

            function styleBUOWL(json){
                var att = json.properties;
                switch (att.hist_occup){
                    case 'Yes':
                        return {color:'deeppink', fillColor:'yellow'};
                        break;
                    case 'Undetermined':
                        return {color:'yellow'};
                        break;
                }
            }
            
            function processBUOWL(json, lyr){
                var att = json.properties;
                lyr.bindTooltip("<h4>Habitat ID: "+att.habitat_id+"</h4>Historically Occupied: "+att.hist_occup+"<br>Status: "+att.recentstatus);
                arHabitatIDs.push(att.habitat_id.toString())
            }
            
            function filterBUOWL(json){
                var att = json.properties;
                if (att.recentstatus=='REMOVED') {
                    return false;
                } else {
                    return true;
                }
            }
            
            $("#txtFindBUOWL").on('keyup paste', function(){
                var val = $("#txtFindBUOWL").val();
                testLayerAttribute(arHabitatIDs, val, "Habitat ID", "#divFindBUOWL", "#divBUOWLError", "#btnFindBUOWL");
            });
            
            $("#btnFindBUOWL").click(function(){
                var val = $("#txtFindBUOWL").val();
                var lyr = returnLayerByAttribute(lyrBUOWL,'habitat_id',val);
                if (lyr) {
                    if (lyrSearch) {
                        lyrSearch.remove();
                    }
                    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {style:{color:'red', weight:10, opacity:0.5, fillOpacity:0}}).addTo(mymap);
                    mymap.fitBounds(lyr.getBounds().pad(1));
                    var att = lyr.feature.properties;
                    $("#divBUOWLData").html("<h4 class='text-center'>Attributes</h4><h5>Habitat: "+att.habitat+"</h5><h5>Historically Occupied: "+att.hist_occup+"</h5><h5>Recent Status: "+att.recentstatus+"</h5>");
                    $("#divBUOWLError").html("");
                } else {
                    $("#divBUOWLError").html("**** Habitat ID not found ****");
                }
            });
            
            $("#lblBUOWL").click(function(){
                $("#divBUOWLData").toggle(); 
            });
            
            // ************ Client Linears **********
            
            function styleClientLinears(json) {
                var att = json.properties;
                switch (att.type) {
                    case 'Pipeline':
                        return {color:'peru'};
                        break;
                    case 'Flowline':
                        return {color:'navy'};
                        break;
                    case 'Flowline, est.':
                        return {color:'navy', dashArray:"5,5"};
                        break;
                    case 'Electric Line':
                        return {color:'darkgreen'};
                        break;
                    case 'Access Road - Confirmed':
                        return {color:'darkred'};
                        break;
                    case 'Access Road - Estimated':
                        return {color:'darkred', dashArray:"5,5"};
                        break;
                    case 'Extraction':
                        return {color:'indigo'};
                        break;
                    default:
                        return {color:'darkgoldenrod'}
                }
            }
            function processRoads(json, lyr) {
                var att = json.properties;
                lyr.bindTooltip("<h4>Plot: "+att.plot_num+"</h4>");
                arProjectIDs.push(att.Project.toString());
            }

            function processClientLinears(json, lyr) {
                var att = json.properties;
                lyr.bindTooltip("<h4>Linear Project: "+att.Project+"</h4>Type: "+att.type+"<br>ROW Width: "+att.row_width);
                arProjectIDs.push(att.Project.toString());
            }
            
            $("#txtFindProject").on('keyup paste', function(){
                var val = $("#txtFindProject").val();
                testLayerAttribute(arProjectIDs, val, "PROJECT ID", "#divFindProject", "#divProjectError", "#btnFindProject");
            });
            
            $("#btnFindProject").click(function(){
                var val = $("#txtFindProject").val();
                var lyr = returnLayerByAttribute(lyrClientLines,'Project',val);
                if (lyr) {
                    if (lyrSearch) {
                        lyrSearch.remove();
                    }
                    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {style:{color:'red', weight:10, opacity:0.5}}).addTo(mymap);
                    mymap.fitBounds(lyr.getBounds().pad(1));
                    var att = lyr.feature.properties;
                    $("#divProjectData").html("<h4 class='text-center'>Attributes</h4><h5>Type: "+att.type+"</h5><h5>ROW width: "+att.row_width+ "m </h5>");
                    $("#divProjectError").html("");
                } else {
                    $("#divProjectError").html("**** Project ID not found ****");
                }
            });
            
            $("#lblProject").click(function(){
                $("#divProjectData").toggle(); 
            });
				
				
			//********** STYLING GITHIORO POLYGONS **********//
				
			function styleDocs(json){
				var att = json.properties;
				switch(att.status){
					case 'Documented':
						return {color: 'orange', fillColor:'orange'};
						break;
						
					case 'N.documented':
						return {color: 'black'};
						break;
					 
				}
			}	
				
				function fliterPlots(json){
					var att = json.properties;
					var optFilter = $("input[name=fltPlots]:checked").val();
					if(optFilter=='ALL'){
						return true;
					}else{
						return (att.status==optFilter);
					}
				}
				
				//**** search plot *****//
				function returnPlotByID(id){
					var arLayers = lyrGith.getLayers();
					for(i=0; i<arLayers.length-1;i++){
						var featureID = arLayers[i].feature.properties.PLOT_NUMBE;
						if(featureID == id){ 
							return arLayers[i];
							}
						}
					return false;
				}
				
				//*** find plot query ***//
				$("#btnFindPlot").click(function(){
					var id = $("#txtFindPlot").val();
					var lyr = returnPlotByID (id);
					if (lyr){
						if(lyrSearch){
							lyrSearch.remove();
						}
						lyrSearch = L.geoJSON(lyr.toGeoJSON(),{style:{color:'red', weight:10, opacity:0.5}}).addTo(mymap);
						
						mymap.fitBounds(lyr.getBounds().pad(1));
						var att = lyr.feature.properties;
						$("#divPlotData").html("<h4 class='text-center'>Plot Info</h4><h5>Land Use: "+att.LandUse+"<h5> <h5>Plot Sise: "+att.AREA1+" HA </h5> <h5>Documentation: "+att.status+"</h5> ");
					}else{
						$("#divPlotError").html("***Plot Not Inserted***");
					}
				});
				
				
			function processGith (json, lyr){
			var att = json.properties;
				lyr.bindTooltip("<h4>Plot ID: "+att.plot_num+"</h4>Status:"+att.status+"<br> Land Use: "+att.LandUse+"<br> Plot Size in HA: "+att.AREA1 );
				arLayersIDs.push(att.PLOT_NUMBE.toString());
			}
				
				function testPlotTxtID(id){
					if (arLayersIDs.indexOf(id)<0){
					$("#divFindPlot").addClass("has-error");
						$("#divPlotError").html("*** PLOT NOT FOUND");
						$("#btnFindPlot").attr("disabled", true);
						}else{
						$("#divFindPlot").removeClass("has-error");
						$("#divPlotError").html("");
						$("#btnFindPlot").attr("disabled", false);
					}
					
			}
				$("#txtFindPlot").on('keyup paste', function(){
					var id = $("#txtFindPlot").val();
					testPlotTxtID(id);
				});
				
				
				function styleLanduseLandUse(json){
				var att = json.properties;
				switch(att.LandUse){
						
					case 'Public purpose':
						return {color:'yellow'};
						break;
					
					case 'Proposed public purpose':
						return {color:'yellow'};
						break;
					
					case 'Public utility':
						return {color:'blue'};
						break;
					
						
					case 'industry':
						return {color:'purple'};
						break;
					
					case 'commercial':
						return {color:'red'};
						break;
					
					case 'Transportation':
						return {color:'grey'};
						break;
					
					case 'Educational':
						return {color:'orange'};
						break;
						
					case 'High density Residential':
						return {color:'brown'};
						break;
						
					case 'Medium Density Residential':
						return {color:'brown'};
						break;
					
					case 'Proposed high density residential':
						return {color:'brown'};
						break;	
					
					case 'Market':
						return {color:'blue'};
						break;
					
					case 'Proposed recreation':
						return {color:'green'};
						break;
					
					case 'Proposed commercial':
						return {color:'red'};
						break;
							
				}
			}
				
				function processLanduse (json, lyr){
				var att = json.properties;
				lyr.bindTooltip("<h4>Plot ID: "+att.plot_num+"</h4><h5>RIM: "+att.sheet+"</h5>");
				}
				
				
				
				
            
            // *********  Eagle Functions *****************
            
            function returnEagleMarker(json, latlng){
                var att = json.properties;
                if (att.status=='ACTIVE NEST') {
                    var clrNest = 'deeppink';
                } else {
                    var clrNest = 'chartreuse';
                }
                arEagleIDs.push(att.nest_id.toString());
                return L.circle(latlng, {radius:804, color:clrNest,fillColor:'chartreuse', fillOpacity:0.5}).bindTooltip("<h4>Eagle Nest: "+att.nest_id+"</h4>Status: "+att.status);
            }
            
            $("#txtFindEagle").on('keyup paste', function(){
                var val = $("#txtFindEagle").val();
                testLayerAttribute(arEagleIDs, val, "Eagle Nest ID", "#divFindEagle", "#divEagleError", "#btnFindEagle");
            });
            
            $("#btnFindEagle").click(function(){
                var val = $("#txtFindEagle").val();
                var lyr = returnLayerByAttribute(lyrEagleNests,'nest_id',val);
                if (lyr) {
                    if (lyrSearch) {
                        lyrSearch.remove();
                    }
                    lyrSearch = L.circle(lyr.getLatLng(), {radius:800, color:'red', weight:10, opacity:0.5, fillOpacity:0}).addTo(mymap);
                    mymap.setView(lyr.getLatLng(), 14);
                    var att = lyr.feature.properties;
                    $("#divEagleData").html("<h4 class='text-center'>Attributes</h4><h5>Status: "+att.status+"</h5>");
                    $("#divEagleError").html("");
                } else {
                    $("#divEagleError").html("**** Eagle Nest ID not found ****");
                }
            });
            
            $("#lblEagle").click(function(){
                $("#divEagleData").toggle(); 
            });
            
            //  *********** Raptor Functions
            
            function returnRaptorMarker(json, latlng){
                var att = json.properties;
                arRaptorIDs.push(att.Nest_ID.toString());
                switch (att.recentspecies) {
                    case 'Red-tail Hawk':
                        var radRaptor = 533;
                        break;
                    case 'Swainsons Hawk':
                        var radRaptor = 400;
                        break;
                    default:
                        var radRaptor = 804;
                        break;
                }
                switch (att.recentstatus) {
                    case 'ACTIVE NEST':
                        var optRaptor = {radius:radRaptor, color:'deeppink', fillColor:"cyan", fillOpacity:0.5};
                        break;
                    case 'INACTIVE NEST':
                        var optRaptor = {radius:radRaptor, color:'cyan', fillColor:'cyan', fillOpacity:0.5};
                        break;
                    case 'FLEDGED NEST':
                        var optRaptor = {radius:radRaptor, color:'deeppink', fillColor:"cyan", fillOpacity:0.5, dashArray:"2,8"};
                        break;
                }
                return L.circle(latlng, optRaptor).bindPopup("<h4>Raptor Nest: "+att.Nest_ID+"</h4>Status: "+att.recentstatus+"<br>Species: "+att.recentspecies+"<br>Last Survey: "+att.lastsurvey);
            }
                
            $("#txtFindRaptor").on('keyup paste', function(){
                var val = $("#txtFindRaptor").val();
                testLayerAttribute(arRaptorIDs, val, "Raptor Nest ID", "#divFindRaptor", "#divRaptorError", "#btnFindRaptor");
            });
            
            $("#btnFindRaptor").click(function(){
                var val = $("#txtFindRaptor").val();
                var lyr = returnLayerByAttribute(lyrRaptorNests,'Nest_ID',val);
                if (lyr) {
                    if (lyrSearch) {
                        lyrSearch.remove();
                    }
                    var att = lyr.feature.properties;
                    switch (att.recentspecies) {
                        case 'Red-tail Hawk':
                            var radRaptor = 533;
                            break;
                        case 'Swainsons Hawk':
                            var radRaptor = 400;
                            break;
                        default:
                            var radRaptor = 804;
                            break;
                    }
                    lyrSearch = L.circle(lyr.getLatLng(), {radius:radRaptor, color:'red', weight:10, opacity:0.5, fillOpacity:0}).addTo(mymap);
                    mymap.setView(lyr.getLatLng(), 14);
                    $("#divRaptorData").html("<h4 class='text-center'>Attributes</h4><h5>Status: "+att.recentstatus+"</h5><h5>Species: "+att.recentspecies+"</h5><h5>Last Survey: "+att.lastsurvey+"</h5>");
                    $("#divRaptorError").html("");
                } else {
                    $("#divRaptorError").html("**** Raptor Nest ID not found ****");
                }
            });
            
            $("#lblRaptor").click(function(){
                $("#divRaptorData").toggle(); 
            });
            
            //  *********  jQuery Event Handlers  ************
            
            $("#btnLocate").click(function(){
                mymap.locate();
            });
            
            //  ***********  General Functions *********
            
            function LatLngToArrayString(ll) {
                return "["+ll.lat.toFixed(5)+", "+ll.lng.toFixed(5)+"]";
            }
            
            function returnLayerByAttribute(lyr,att,val) {
                var arLayers = lyr.getLayers();
                for (i=0;i<arLayers.length-1;i++) {
                    var ftrVal = arLayers[i].feature.properties[att];
                    if (ftrVal==val) {
                        return arLayers[i];
                    }
                }
                return false;
            }
            
            function testLayerAttribute(ar, val, att, fg, err, btn) {
                if (ar.indexOf(val)<0) {
                    $(fg).addClass("has-error");
                    $(err).html("**** "+att+" NOT FOUND ****");
                    $(btn).attr("disabled", true);
                } else {
                    $(fg).removeClass("has-error");
                    $(err).html("");
                    $(btn).attr("disabled", false);
                }
            }

            
            
			});
            