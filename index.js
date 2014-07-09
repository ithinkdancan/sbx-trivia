var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//create the server
http.listen(8080);

//set up the static resources (HTML, JS, CSS)
app.use(express.static(__dirname + '/dist/'));

//SOCKETS!!!
io.on('connection', function(socket){
  console.log('a user connected');
});

