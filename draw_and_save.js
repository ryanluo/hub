var db = new Firebase('https://hub-test.firebaseio.com')

/*
 * SAVE FUNCTIONS
 */

/*
 * When you click submit we set the team in the dictionary
 * of one of the teams to what we have from input.
 *
 * tldr; this updates the teams location
 */
$('#addTeam').click(function (e) {
        var X = $('#X').val();
        var Y = $('#Y').val();
        var teamName = $('#teamName').val();
        var teams = {};
        teams = {name: teamName, loc: {x: X, y:Y}};
        db.child(teamName).set(teams);
        $('#X').val('');
        $('#Y').val('');
})

/*
 * When a team is added, we display it.
 */
db.on('child_added', function(snapshot) {
        var team = snapshot.val();
        var loc  = team.loc
        displayTeam(team.name, loc.x, loc.y);
});

/*
 * When a child is updated, we display it.
 */
db.on('child_changed', function(snapshot) {
        var team = snapshot.val();
        var loc = team.loc;
        updateTeam(team.name, loc.x, loc.y);
});

/*
 * DRAW FUNCTIONS
 */

/*
 * Display new team
 */
function displayTeam(name, x, y) {
        $('<div id='+name+' />')
                .text(name+": " +x+","+y).appendTo($('#db'));
}

/*
 * Update team 
 */
function updateTeam(name, x, y) {
       $('#'+name).text(name+": "+x+","+y); 
}

