/*
 * Created by Eliott Jaquier on 08/05/2023
 * This file contains the native functions to connect to a websocket. It is used like a bridge between the WebAssembly and the native JS WebSocket API.
*/

var WebSocketWebAssemblyLib = {
	$wsState: {
		websocket: null,
	},
	// Connect to a websocket with the given url and WebAssembly Callbacks for each event
	WSConnect: function (url, onOpen, onMessage, onError, onClose) {
		//Create a new websocket with the given url. UTF8ToString is used to convert the url from a WebAssembly string to a JS string.
		wsState.websocket = new WebSocket(UTF8ToString(url));
		//Call the given WebAssembly callback when the websocket is opened
		wsState.websocket.onopen = function (event) {
			dynCall('v', onOpen, []);
		}
		//Call the given WebAssembly callback when a message is received. The message is converted from a JS string to a WebAssembly string.
		wsState.websocket.onmessage = function (event) {
			var msg = event.data;
			var msgBytes = lengthBytesUTF8(msg) + 1;
			var msgBuffer = _malloc(msgBytes);
			stringToUTF8(msg, msgBuffer, msgBytes);
			dynCall('vi', onMessage, [msgBuffer]);
		}
		//Call the given WebAssembly callback when an error occurs without any parameters
		wsState.websocket.onerror = function (event) {
			dynCall('v', onError, []);
		}
		//Call the given WebAssembly callback when the websocket is closed. The code of the event is passed as a parameter. We don't need to convert it to a WebAssembly string because it is a number.
		wsState.websocket.onclose = function (event) {
			dynCall('vi', onClose, [event.code]);
		}
	},
	// Send a message to the websocket. The message is converted from a WebAssembly string to a JS string. Return true if the message was sent, false otherwise.
	WSSend: function (message) {
		if(wsState.websocket == null || wsState.websocket.readyState !== 1) return false;
		var message = UTF8ToString(message);
		console.log("Sending from JS : " + message);
		wsState.websocket.send(message);
		return true;
	},
	// Get the status of the native WebSocket api. Return the readyState of the websocket. Return -1 if the websocket is null.
	WSStatus: function () {
		if(wsState.websocket == null) return -1;
		return wsState.websocket.readyState;
	},
	// Close the websocket. Return true if the websocket was closed, false otherwise.
	WSClose: function () {
		if(wsState.websocket == null || wsState.websocket.readyState !== 1) return false;
		wsState.websocket.close();
		wsState.websocket = null;
		return true;
	},
};

//Add the WebSocketWebAssemblyLib to the autoAddDeps function so it is loaded before the WebAssembly module
autoAddDeps(WebSocketWebAssemblyLib, '$wsState');
//Merge the WebSocketWebAssemblyLib with the LibraryManager library so it is accessible from the WebAssembly module
mergeInto(LibraryManager.library, WebSocketWebAssemblyLib);