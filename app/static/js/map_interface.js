/*
 * _________________
 * | DRAW FUNCTIONS|
 * |_______________|
 *
 */

// Where is claremont?
var claremont = { lat: 34.100629, lng: -117.707591};

// DB drawing reference
var teams = DB.child("teams");

// Where was I when I made this thing?
var providence = { lat: 41.826777, lng: -71.402556};

// Alow global access to canvas.
var map;

// Allow global access to my marker.
var marker;

// Allow global access to other locations.
var others = {};

// InfoWindow to display when markers are clicked.
// Initialized to initial content to display the user form.
var infowindow = new google.maps.InfoWindow({
  content: "",
  maxHeight: 200,
  maxWidth: 200
});

/*
 * When you click submit we set the team in the dictionary
 * of one of the teams to what we have from input.
 *
 * We also push information to the database.
 *
 * This binds when the window is open and ready for event binding.
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

    var languages = $('#languages').val();

    var members = $('#members').val();
    members = members.split(",");

    // Find position of user
    var pos = {
      lat: marker.position.k,
      lng: marker.position.B
    };
    
    var data = {
      languages: languages,
      loc: pos,
      members: members,
      teamName: name
    };

    updateDatabase(data);
    infowindow.close();
    others[name] = {};
    others[name].data = data;
    marker.content = formatContent(data);
    activateListener(marker, name);
  });
});

// Initialize map
function initialize() {
  var mapOptions = {
    center: claremont, 
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById('map'),
                            mapOptions);
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      mapOptions.center = pos;
      var loc = {loc: {lat: pos.lat(), lng: pos.lng()}}
      if (logged_in) addMe(teamname,loc.loc); 
      marker = placeMarker(pos, false, map)
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
  map = new google.maps.Map(document.getElementById('map'),
                            mapOptions);
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
 * Returns a point that is drawn on the map.
 *
 * Pass in a name which is the team name,
 * the position on the map, and the map it's drawn on.
 *
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

/*
 *
 * "Activate" or add all infowindow click listeners
 * for each drawn marker.
 * 
 */
function activateListeners() {
  for (teamName in others) {
    activateListener(others[teamName].circle, teamName);
  }
}

/*
 * Activate a particular drawn marker.
 */
function activateListener(object, teamName) {
  others[teamName]['listener'] =
    google.maps.event.addListener(object, 'click', function() {
      infowindow.close();
      infowindow.content = this.content;
      infowindow.open(this.getMap());
      infowindow.setPosition(this.position);
    }); 
}

/*
 * Given a marker's object representation, how
 * should we display this information?
 */
function formatContent(teamData,userData) {
  var languages = "";
  for (key in userData.languages) {
    languages += userData.languages[key] + '<br>';
  }
  var members = "";
  for (key in userData.names) {
    members += userData.names[key] + '<br>';
  }
  content = '<div id="' + teamData.teamName + '">' + 
      '<strong>Team</strong>: ' +
        teamData.teamName + '<br>' + 
      '<div id="teamContent">' +
        '<strong>Languages</strong>: ' +
        '<div id="teamLanguages">' +
          languages +
        '</div>' + '<br>' +
        '<strong>Members</strong>: ' +
        '<div id="teamMembers">' +
          members +
        '</div>' +
      '</div>' + 
      '</div>';
  return content;
}

// Draw map!
google.maps.event.addDomListener(window, 'load', initialize);



