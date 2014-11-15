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

// return a circle icon with certain color
function colorCircle(color)
{
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: .4,
    scale: 4.5,
    strokeColor: 'black',
    strokeWeight: 1
  }
  return circle;
}

// Initialize Google map
function initialize() {
  var mapOptions = {
    center: claremont,
    zoom: 15,
    draggable: true,
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

/*
 * Places a marker at position pos.
 * map is the canvas that we draw on.
 */
function placeMarker(pos, map) {
  return new google.maps.Marker({
      position: pos,
      map: map
  });
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
function drawOthers(name, pos, map, help) {

  if (help) {
    var icon = colorCircle('blue');
  } else {
    var icon = colorCircle('red');
  }

  marker = new google.maps.Marker({
    position: pos,
    icon: icon,
    map: map
  });

  return marker;
}

/*
 * "Activate" or add all infowindow click listeners
 * for each drawn marker.
 *
 * Utility, not currently used.
 * 
 */
function activateListeners() {
  for (teamName in others) {
    activateListener(others[teamName].circle, teamName);
  }
};

/*
 * Activate a particular drawn marker.
 *
 * This allows us to click on a team's marker and have an info window open.
 *
 */
function activateListener(object, teamName) {
  others[teamName]['listener'] =
    google.maps.event.addListener(object, 'click', function() {
      infowindow.close();
      infowindow.content = this.content;
      infowindow.open(this.getMap());
      infowindow.setPosition(this.position);
    });
};

/*
 * Given a marker's object representation, how
 * should we display this information?
 */
function formatContent(teamData, userData) {
  console.log(userData)
  var languages = "";
  for (key in userData.languages) {
    languages += userData.languages[key] + '<br>';
  }
  var location = userData.location;
  var members = "";
  for (key in userData.names) {
    members += userData.names[key] + '<br>';
  }
  content = '<div id="' + teamData.teamName + '">' + 
      '<strong>Team</strong>: ' +
        teamData.teamName + '<br>' + 
      '<strong>Location: </strong>: ' +
        userData.location + '<br>' + 
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

/*
 * Color team and toggle button when help button clicked.
 *
 */

$('.btn.help').click(function() {
  helpMe($('#teamname').text());
  $('.btn.help').toggle();

});

$(document).ready(function() {
    // Locate the user on the map.
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function onSuccess(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        // Place the big marker where the user is
        placeMarker(pos, map);

        // Request the user's team data from the server and add their location
        // to the database.
        $.getJSON('/team_data', function onSuccess(data) {
            var loc = {lat: pos.lat(), lng: pos.lng()};
            addMe(data.team_name, loc);
        });
    }, function onError() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  $('.btn.filter').click(function(e) {
    if($( this ).hasClass('select')) {
      languageSelect($('#languages').val());
    } else {
      displayAll();
    }  
    $('.btn.filter').toggle();
  });
});


