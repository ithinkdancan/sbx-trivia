var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./user.js');
var router = express.Router();
var bodyParser = require('body-parser');


var users = [];

//create the server
http.listen(8080);

//set up the static resources (HTML, JS, CSS)
app.use(express.static(__dirname + '/dist/'));

//set up the api
app.use(bodyParser.json());
router.route('/users')
	.post(function(req, res) {

		var username = req.body.username;
		console.log(users.filter(function(obj){ return obj.username == username }));
		
		//check if the username is already in use
		if( users.filter(function(obj){ return obj.username == username }).length > 0 ){
			res.json({ success: false });
		} else {
			users.push(new User(username))
			res.json({ success: true });
			broadcastUsers();
		}
		
	})


app.use('/api', router);

var broadcastUsers = function () {
	console.log('sending users')
	io.to('board').emit('users:list', users);
}


// //SOCKETS!!!
io.on('connection', function(socket){

	socket.on('board:register', function(){
		socket.join('board');
		broadcastUsers();
	})


});

