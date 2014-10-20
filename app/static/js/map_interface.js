/*
 * _________________
 * | DRAW FUNCTIONS|
 * |_______________|
 *
 */

// Where is claremont?
var claremont = { lat: 34.100629, lng: -117.707591};

// Where was I when I made this thing?
var providence = { lat: 41.826777, lng: -71.402556};

// Alow global access to canvas.
var map;

// Allow global access to my location.
var marker;

// Allow global access to other locations.
var others = {};

var initialContent = '<div id="new_user">' +
    'Team Name: <input type="text" id="teamName"><br>' + 
    '<button id="addTeam">Submit</button>' +
    '</div>';

// InfoWindow to display when markers are clicked.
var infowindow = new google.maps.InfoWindow({
  content: initialContent
});

/*
 * When you click submit we set the team in the dictionary
 * of one of the teams to what we have from input.
 *
 * This binds when the window is open and ready for event binding.
 *
 * We also activate other markers upon a successful click.
 *
 * tldr; this updates the teams location
 */
google.maps.event.addListener(infowindow,'domready', function(){
  $('#addTeam').click(function (e) {
    var name = $('#teamName').val();
    if (name === "" || name === undefined) {
      alert("Please enter a team name!");
      return;
    }
    var pos = {
      lat: marker.position.k,
      lng: marker.position.B
    }
    
    var data = {
      loc: pos,
      teamName: name
    }

    updateDatabase(data);
    infowindow.close();
    others[name].data = data;
    marker.content = formatContent(data);
    activateListener(marker, name);
  });
});

// Initialize stuff
function initialize() {
  var mapOptions = {
    center: providence, 
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById('map'),
                            mapOptions);
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      var loc = {loc: {lat: pos.lat(), lng: pos.lng()}}
      marker = placeMarker(pos, false, map)
      infowindow.open(map, marker);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

/*
 * Places a marker at position pos.
 * drag sets the marker to be draggable or not
 * map is the canvas that we draw on.
 */
function placeMarker(pos, drag, map) {
  var marker = new google.maps.Marker({
      position: pos,
      draggable: drag,
      title:"Center!"
  });
  marker.setMap(map);
  return marker;
}

/*
 * In case your browser is lame:
 */
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    alert('Error: The Geolocation service failed.');
  } else {
    alert('Error: Your browser doesn\'t support geolocation.');
  }
}

/*
 * Display new team.
 * 
 * Returns a circle that is drawn on the map.
 */
function drawOthers(name, pos, map) {
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .4,
    scale: 4.5,
    strokeColor: 'black',
    strokeWeight: 1
  }

  // Add the circle for this city to the map.
  return (new google.maps.Marker({
    position: pos,
    icon: circle,
    map: map
  }));
}

function activateListeners() {
  for (teamName in others) {
    activateListener(others[teamName].circle, teamName);
  }
}

function activateListener(object, teamName) {
  others[teamName]['listener'] =
    google.maps.event.addListener(object, 'click', function() {
      infowindow.close();
      infowindow.content = this.content;
      infowindow.open(this.getMap());
      infowindow.setPosition(this.position);
    }); 
}

function formatContent(teamData) {
  content = '<div id="' + teamData.teamName + '">' + 
      'Team: ' + teamData.teamName + '<br>' + 
      '<div id="teamContent"></div>' + 
      '</div>';
  return content;
}

// Draw map!
google.maps.event.addDomListener(window, 'load', initialize);
