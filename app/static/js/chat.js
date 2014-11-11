$('#chat_input').bind('keyup', function(e) {
	var code = e.keyCode || e.which;
	if(code == 13) { 
	   send_message();
	}});

var chat = DB.child("chat");
var teamname = $("#teamname").html();

var messages = {};

function storeMessage(teamName, message) {
	var time = Date.now();
    var data = {teamName: teamName, message: message, time: time};
    
    chat.child(time).set(data);
}

chat.on('child_added', function(snapshot) {

	var message = snapshot.val().message;
	var messenger = snapshot.val().teamName;
	var time = snapshot.val().time;

	messages[time] = {};
	messages[time]["message"] = message;
	messages[time]["team"] = messenger;

	update_chat();
});

function update_chat() {
	var chatlist = "";

	for(var m in messages) {
		chatlist += "<div>"+messages[m]["team"]+": "+messages[m]["message"]+"</div>";
	}

	$("#chatbox").html(chatlist);
	$("#chatbox").scrollTop(function(){return this.scrollHeight})
}

function send_message() {
	var message = $("#chat_input").val();
	storeMessage(teamname, message);
	$("#chat_input").val("");
}

