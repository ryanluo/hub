/*
 * IMPORTS: firebase.js, map_interface.js
 */

// Reference to database
var DB = new Firebase('https://hub-test.firebaseio.com');

var teams = DB.child("teams");
var users = DB.child("users");

/*
 * _________________
 * | SAVE FUNCTIONS|
 * |_______________|
 *
 */

/*
 * When a team is added, we display it.
 *
 * Other teams displayed as points on map. After they are added to the map, we
 * activate a click listener so that they display information upon click.
 *
 * We also save a local copy of each marker we add so that we can add/remove
 * them later.
 *
 * Future: Maybe not add a points to your own team?
 *
 */
teams.on('child_added', function(snapshot) {
    var team = snapshot.val();
    var loc  = team.loc;
    var pos = {lat: loc.lat, lng: loc.lng};
    var name = team.teamName;
    var help = team.needsHelp;
    var circle = drawOthers(name, pos, map, help);

    users.child(name).once('value', function(dataSnapshot) {
        var userData = dataSnapshot;
        circle.content = formatContent(team, userData.val());
        others[name] = {circle: circle, data: team};
        activateListener(others[name].circle, name);
    });
});

/*
 * On child change, if team help flag is true, change color of
 * marker.
 *
*/
teams.on('child_changed', function(snapshot) {

    var team = snapshot.val();
    var name = team.teamName;
    var currentMarker = others[name].circle

    if (team.needsHelp) {
        if (currentMarker.getIcon().fillColor == 'red') {
            currentMarker.setIcon(colorCircle('blue'));
        }
    } else {
        if (currentMarker.getIcon().fillColor == 'blue') {
            currentMarker.setIcon(colorCircle('red'));
        }
    }
});

/*
 * When a child is removed, we remove it from the map.
 *
 * Because we kept a local copy in others, we can do this.
 *
 */
teams.on('child_removed', function(snapshot) {
    var team = snapshot.val();
    var name = team.teamName;
    var circle = others[name].circle;
    circle.setMap(null);
    delete others[name];
});

// Call this to add a user's location to the DB
function addMe(teamName, location) {
    var data = {loc: location, teamName: teamName, needsHelp:false};
    teams.child(teamName).set(data);
}


function helpMe(teamname) {
    teams.child(teamname).child('needsHelp').set(true);
}
