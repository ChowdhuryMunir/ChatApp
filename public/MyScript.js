/// <reference path="jquery‐3.3.1.min.js" />

var socket;
$(document).ready(function () {
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserList);
    $('#send').click(sendMessage);
    $('#imageInput').change(sendImage);
});
function addUser() {
    socket.emit('adduser', prompt("Type Your Name!!"));
}
function processMessage(username, data) {
    document.querySelector('#feedback').innerHTML = '';
    document.querySelector('#output_msg').innerHTML += '<b>' + username + ': </b>' + data + '<br>';
}
function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key) {
        var userImage = 'profile.png'; // Adjust this path as needed
        $('#users').append('<li><img src="' + userImage + '" alt="User Image" style="width:20px; height:20px; border-radius:50%; margin-right:5px;">'+"<span>" +  key  + "</span>" +'</li>');
    });
}
 
function sendMessage() {
    var message = $('#message').val();
    if (message != "") {
        $('#message').val('');
        socket.emit('sendchat', message);
        $('#message').focus();
        $('#message').val('');
    }
    else {
        $('#message').val('');
        $('#message').focus();
    }
}
function sendImage() {
    if (this.files.length > 0) {
        var file = this.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var imageData = e.target.result;
            socket.emit('sendchat', { type: 'image', data: imageData });
        };

        reader.readAsDataURL(file);
    }
}

// Modify processMessage function to handle image data
function processMessage(username, message) {
    document.querySelector('#feedback').innerHTML = '';
    var messageElement;
    if (typeof message === 'object' && message.type === 'image') {
        messageElement = '<b>' + username + ':</b> <img src="' + message.data + '" style="max-width:200px;"><br>';
    } else {
        messageElement = '<b>' + username + ':</b> ' + message + '<br>';
    }
    document.querySelector('#output_msg').innerHTML += messageElement;
}
