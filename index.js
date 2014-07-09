var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//create the server
http.listen(8080);

//Application Routing
app.get('/', function(req, res){
  res.sendfile('src/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
});
