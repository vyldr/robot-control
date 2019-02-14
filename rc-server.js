const express      = require('express')
const SocketServer = require('ws').Server;
const path         = require('path')
const PORT         = process.env.PORT || 5000
var activeConnections = 0;
var connections = [];

const server = express()
	.use(express.static(path.join(__dirname, 'public')))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// WebSockets!
const wss = new SocketServer({ server: server });
wss.on('connection', (ws) => {
	userConnect(ws);
	ws.on('message', (message) => sendMessage(ws, message));
	ws.on('close', () => userDisconnect(ws));
});

function sendMessage(ws, message) {
	// Assign a group
	if (message[0] != '{') {
		ws.group = message;

	// Broadcast to the group
	} else {
		for (var i in connections)
			if (connections[i] != 0) // Don't ask an empty slot who it belongs to
				if (connections[i].group == ws.group && 
						connections[i].readyState === connections[i].OPEN &&
						ws.group != "")
					connections[i].send(message);
	}
}

// Add a new connection
function userConnect(ws) {
	activeConnections++;
	
	// Add a new connection slot if necessary
	if (activeConnections > connections.length)
		connections.push(0);
	
	// Give the user the lowest available ID
	for (var i = 0; i < connections.length; i++)
		if (connections[i] == 0) {
			ws.id = i; // This ID is unique for each connection
			connections[i] = ws;
			break;
		}
		console.log('User connected ' + ws.id);
}

function userDisconnect(ws) {
	console.log('User disconnected ' + ws.id)
	activeConnections--; // Update the number of connections
	connections[ws.id] = 0; // Clear the slot
	
	// The server is empty now
	if (activeConnections == 0)
		cleanup();
}

// Reset the server
function cleanup() {
	connections = [];
}