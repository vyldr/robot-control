// Set up the WebSocket
var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST);

// Data from the server
var message = {};
ws.onmessage = function (event) {
	message = JSON.parse(event.data);
};

var display = document.getElementById("display");

// Send the input to the server
function send() {
	ws.send(JSON.stringify(input));
	display.innerHTML = JSON.stringify(input, null, 4);
}

function setup() {
	// Tell the server our group name
	ws.send(document.getElementById("group").value);

	// Start sending data to the server
	setInterval(send, 16);

	// Unfocus the text box because we are using the keyboard for input
	document.getElementById("group").blur();
}
