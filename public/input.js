
// Which keys are currently pressed?
var input = {
	type:        "command",
	up:          false,
	down:        false,
	left:        false,
	right:       false,
	space:       false,
	buttons:     [],
	axes:        []
}

// Handle keydowns
document.addEventListener('keydown', (event) => {
	switch(event.key) {
		case "ArrowUp":
			input.up = true;
			break;
		case "ArrowDown":
			input.down = true;
			break;
		case "ArrowLeft":
			input.left = true;
			break;
		case "ArrowRight":
			input.right = true;
			break;
		case " ":
			input.space = true;
			break;
		case "d": // Debug
			console.log(input)
			break;
	}
}, false);

// Handle keyups
document.addEventListener('keyup', (event) => {
	switch(event.key) {
		case "ArrowUp":
			input.up = false;
			break;
		case "ArrowDown":
			input.down = false;
			break;
		case "ArrowLeft":
			input.left = false;
			break;
		case "ArrowRight":
			input.right = false;
			break;
		case " ":
			input.space = false;
	}
}, false);

var gp = 0;
window.addEventListener("gamepadconnected", function () {
	gp = navigator.getGamepads()[0];
	console.log("Gamepad " + gp.index + " connected: " + gp.id + ". " + gp.buttons.length + " buttons, " + gp.axes.length + " axes.");

	var gamepadInterval = setInterval(gamepadInput, 16);
});

function gamepadInput() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	if (!gamepads)
		return;

	input.axes = gamepads[0].axes;

	buttons = [];
	for (var i = 0; i < gamepads[0].buttons.length; i++)
		buttons[i] = gamepads[0].buttons[i].pressed;
		input.buttons = buttons;

};



