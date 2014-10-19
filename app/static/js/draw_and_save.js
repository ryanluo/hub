/*
 * IMPORTS: firebase.js, raphael.js
 */

var db = new Firebase('https://hub-test.firebaseio.com')
var user;

/*
 * SAVE FUNCTIONS
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
  user.remove();
}

/*
 * When a team is added, we display it.
 */
db.on('child_added', function(snapshot) {
  var team = snapshot.val();
  var loc  = team.loc
  var pos = {lat: loc.y, lng: loc.x};
  var name = team.teamName;
  var circle = drawOthers(name, pos, map);
  others[name] = {circle: circle, team: team};
});

/*
 * When a child is updated, we display it.
 */
db.on('child_changed', function(snapshot) {
  var team = snapshot.val();
  var loc = team.loc;
  var pos = {lat: loc.y, lng: loc.x};
});

/*
 * When a child is removed, we remove it from the map.
 *
 * <<<<untested>>>>
 *
 */
db.on('child_removed', function(snapshot) {
  var team = snapshot.val();
  var name = team.teamName;
  var circle = others[name].circle;
  circle.setMap(null);
  others[name] = null;
});
