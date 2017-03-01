var name = getQueryVariable('name') || 'Anonymous';
var email = getQueryVariable('email');
var gender = getQueryVariable('gender');
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

// Update h1 tag
jQuery('.room-title').text(room);

socket.on('connect', function () {
	console.log('Conncted to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room,
		email: email,
		gender: gender
	});
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:');
	console.log(message);

	if (typeof message.type != 'undefined' && message.type == 'message') {
		$message.append('<p><strong>' + message.name + '&lt' + message.email + '&gt ' + message.gender + ':' + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
		$message.append('<p>' + message.text + '</p>');
	}
	else if (typeof message.type != 'undefined' && message.type == 'leaveroom') {
		$message.append('<p><strong> ' + message.name + ':' + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
		$message.append('<p><span class="glyphicons glyphicons-user-remove"></span> <span class="glyphicon glyphicon-print"></span> ' + message.text + '</p>');
	}
	else {
		$message.append('<p><strong>' + message.name + ':' + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
		$message.append('<p>' + message.text + '</p>');
	}
	
	$messages.append($message);
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});