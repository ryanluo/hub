/*
 * IMPORTS: firebase.js, map_interface.js
 */

// Reference to database
var DB = new Firebase('https://hub-test.firebaseio.com')

var db = DB.child("teams")

// Reference to user
var user;

/*
 * _________________
 * | SAVE FUNCTIONS|
 * |_______________|
 *
 */

/*
 * Update database on added location
 */
function updateDatabase(pos) {
  user = db.push(pos);
}

/*
 * Update database on window close.
 */ 
window.onbeforeunload = function() {
  if(user) user.remove();
}

/*
 * When a team is added, we display it.
 *
 * Other teams displayed as points on map.
 * After they are added to the map, we 
 * activate a click listener so that they
 * display information upon click.
 * 
 * We also save a local copy of each marker
 * we add so that we can add/remove them later.
 *
 * Future: Maybe not add a points to your own team?
 *
 */
db.on('child_added', function(snapshot) {
  var team = snapshot.val();
  var loc  = team.loc
  var pos = {lat: loc.lat, lng: loc.lng};
  var name = team.teamName;
  var circle = drawOthers(name, pos, map);
  circle.content = formatContent(team);
  others[name] = {circle: circle, data: team};
  activateListener(others[name].circle, name);
});

/*
 * When a child is updated, we display it.
 *
 * This isn't quite as relevant because we haven't
 * implemented an "update" function.
 *
 */
db.on('child_changed', function(snapshot) {
  var team = snapshot.val();
  var loc  = team.loc
  var pos = {lat: loc.lat, lng: loc.lng};
  var name = team.teamName;
  var circle = drawOthers(name, pos, map);
  circle.content = formatContent(team);
  others[name] = {circle: circle, data: team};
  activateListener(others[name].circle, name);
});

/*
 * When a child is removed, we remove it from the map.
 *
 * Because we kept a local copy in others, we can do this.
 *
 */
db.on('child_removed', function(snapshot) {
  var team = snapshot.val();
  var name = team.teamName;
  var circle = others[name].circle;
  circle.setMap(null);
  others[name] = null;
});

// Call this to add user to DB
function addMe(teamname, LOC) {
  teams.child(teamname).set(LOC);
}

// Call this to remove user from DB
function deleteMe(teamname) {
  db.child(teamname).set(null); 
}
