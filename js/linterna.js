/**
    * Provides the JavaScript code of the Graphical User Interface for Lost At Night application
    * @author Nico Sava
    */

// ===== Maps Scripts =====

// ===== Google Maps =====

// Pakistan
latitud = 26.475088;
longitud = 64.654246;

function initMap() {
    var centro = {lat: latitud, lng: longitud};
    //var spain = {lat: 40.4167754, lng: -3.7037901999999576};
    //var myLatlng = new google.maps.LatLng(43.565529, -80.197645);
    var mapOptions = {
        zoom: 3,
        center: centro,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    }
    var map = new google.maps.Map(document.getElementById('map-google'), mapOptions);

     //=====Initialise Default Marker
    var marker = new google.maps.Marker({
        position: centro,
        map: map,
        title: 'marker',
        //icon: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
        icon: 'images/map-marker-aprox.png'
     //=====You can even customize the icons here
    });

     //=====Initialise InfoWindow
    var infowindow = new google.maps.InfoWindow({
      content: "<B>Skyway Dr</B>"
  });

   //=====Eventlistener for InfoWindow
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });
}

var marker;

function placeMarkerAndPanTo(latLng, map) {
  if ( marker ){
    marker.setPosition(latLng);
  } else {
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
      //icon: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
      icon: 'images/map-marker-exact.png'
    });
  // map.panTo(latLng);
    }
  }

//google.maps.event.addDomListener(window, 'load', initMap);

// ===== VIIRS Maps =====
function initMapVIIRS() {

var mapviirs = new ol.Map({
      layers: viirs,
      view: new ol.View({
          maxResolution: 0.5625,
          projection: ol.proj.get("EPSG:4326"),
          extent: [-180, -90, 180, 90],
          center: [eval(longitud),eval(latitud)], // centro del mapa
          zoom: 1.7 // 1.7 (VIIRS) ~ 3 (Gmaps) | VIIRS - 1.3 = Gmaps (tiene que ser entero); x = Math.round(20.49); (redondear)
      }),
      target: "map-viirs",
      controls: [], // para quitar los botones
      //renderer: ["canvas", "dom"],
  });

  var sourceViirs = new ol.source.WMTS({
      urls: [
          "https://map1a.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",
          "https://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",
          "https://map1c.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",
      ],
      layer: "VIIRS_CityLights_2012",
      format: "image/jpeg",
      matrixSet: "EPSG4326_500m",
      tileGrid: new ol.tilegrid.WMTS({
          origin: [-180, 90],
          resolutions: [
              0.5625,
              0.28125,
              0.140625,
              0.0703125,
              0.03515625,
              0.017578125,
              0.0087890625,
              0.00439453125,
              0.002197265625
          ],
          matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          tileSize: 512
      }),
      /*attributions: [
          new ol.Attribution({html: "NASA NPP - VIIRS"})
      ]*/
  });

  var viirs = new ol.layer.Tile({source: sourceViirs});
  mapviirs.addLayer(viirs);

// --- Definicion del marcador y de su capa ---

var vectorSource = new ol.source.Vector({
  //create empty vector
});

//create a bunch of icons and add to source vector
// para varios marcadores sobre el mismo capa
/*for (var i=0;i<50;i++){

    var iconFeature = new ol.Feature({
      geometry: new
        ol.geom.Point([eval(longitud),eval(latitud)]),
        //ol.geom.Point(ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
    name: 'Null Island ' + i,
    population: 4000,
    rainfall: 500
    });
    vectorSource.addFeature(iconFeature);
}*/

// Un unico marcador
var iconFeature = new ol.Feature({
  geometry: new
    ol.geom.Point([eval(longitud),eval(latitud)]),
    //ol.geom.Point(ol.proj.transform([Math.random()*360-180, Math.random()*180-90], 'EPSG:4326',   'EPSG:3857')),
  name: 'Null Island ',
  population: 4000,
  rainfall: 500
});

//create the style
var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 0.75,
    //src: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
    src: 'images/map-marker-aprox.png'
  }))
});

vectorSource.addFeature(iconFeature);

// Segundo marcador: variable
var iconGeometry = new ol.geom.Point([eval(longitud),eval(latitud)]);

var iconFeature2 = new ol.Feature({
            geometry: iconGeometry,
            name: 'Null Island',
            population: 4000,
            rainfall: 500
        });

var iconStyle2 = new ol.style.Style({
    image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        //src: 'https://evernote.com/media/img/getting_started/skitch/android/android-location_icon.png'
        src: 'images/map-marker-exact.png'
    }))
});

iconFeature2.setStyle(iconStyle2);
//vectorSource.addFeature(iconFeature2);

//vectorSource.addFeature(iconFeature2);

//add the feature vector to the layer vector, and apply a style to whole layer
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: iconStyle
});

mapviirs.addLayer(vectorLayer);

mapviirs.on('singleclick', function (evt) {
  vectorSource.addFeature(iconFeature2);
  iconGeometry.setCoordinates(evt.coordinate);
});


// -------------
}

// ===== Botones =====
$("a.btn-gmaps").click(function() {
    $(this).toggleClass("unselected");
});

$("a.btn-viirs").click(function() {
    $(this).toggleClass("unselected");
});

$("a.btn-iss").click(function() {
    $(this).toggleClass("unselected");
});

//add smooth scrolling
$(document).ready(function() {

    'use strict';

    $('.nav-item, #scroll-to-top').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

});



/*  ===== Enlaces =====
Google Maps Responsive
https://codepen.io/hubpork/pen/xriIz

Botones show/hide
http://jsfiddle.net/qYCUJ/

<!-- Range slider -->
<!--script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script-->

Seleccionar mapa VIIRS:
http://jsfiddle.net/GFarkas/3oj4madx/

Marcador mapa VIIRS
http://jsfiddle.net/6RS2z/356/

Google markers (varios)
https://developers.google.com/maps/documentation/javascript/examples/event-arguments

Map markers
http://www.iconarchive.com/show/vista-map-markers-icons-by-icons-land.html

Map marker red
http://www.iconarchive.com/show/small-n-flat-icons-by-paomedia/map-marker-icon.html

*/
