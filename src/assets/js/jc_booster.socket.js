
/* ---------------------------------------------------------------------------------------------------------------------------
 * Using websocket php
*/
function JC_Socket(chanelID) {
	let roll 	= 0,
		loop 	= 100,
		inv 	= 5000;

	let socket = new WebSocket("wss://echo.websocket.org");

	socket.onopen = function() {
		console.log('connected!');
	};

	socket.onerror = function(error) {
		(roll < loop) ? setTimeout(() => { JC_Socket(chanelID); console.log("Reconnecting.."); roll += 1}, inv) : false;
		console.log("Websocket Error | " + error.message );
	};

	socket.onclose  = function(event) {
		(roll < loop) ? setTimeout(() => { JC_Socket(chanelID); console.log("Reconnecting.."); roll += 1}, inv) : false;
		(event.wasClean) ? console.log("Websocket Closed | " + event.code) : console.log('[close] Connection die!');
	};

	this.publish = function(room, data) {
		socket.send(JSON.stringify({
			room 	: chanelID + "-" + room,
			content : data
		}));
	}

	this.response = function(room, callback) {
		socket.onmessage = function(data) {
			let res = JSON.parse(data.data);
			(res.room === chanelID + "-" + room) ? callback(res.content) : false;
		}
	}
}