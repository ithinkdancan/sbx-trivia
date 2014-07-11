var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var bodyParser = require('body-parser');


var User = require('./user.js');


var users = [];
var games = [];

//create the server
http.listen(8080);

//set up the static resources (HTML, JS, CSS)
app.use(express.static(__dirname + '/dist/'));

//set up the api
app.use(bodyParser.json({limit: '50mb'}));
router.route('/users')
	.post(function(req, res) {

		var username = req.body.username;
		var create = req.body.create;
		var matchingUser = users.filter(function(obj){ 
				return obj.username == username 
			});
		
		//check if the username is already in use
		if( matchingUser.length > 0 ){
			res.json({ success: false });		
		} else {
			console.log('creating a new user', username);
			var user = new User(username);
			users.push(user)
			res.json({ success: true, user: user });
			broadcastUsers();
		}
		
	})


router.route('/users/:username')

	//get a user
	.get(function(req, res){

		var username = req.params.username;
		var matchingUser = users.filter(function(obj){ 
				return obj.username == username 
			});

		if(matchingUser.length){
			user = matchingUser[0];
		} else {
			user = new User(username);
			users.push(user)
		}

		res.json({ success: true, user: user  });
	})

	//update a user
	.post(function(req, res){

		var username = req.params.username;
		var matchingUser = users.filter(function(obj){ 
				return obj.username == username 
			})[0];

			matchingUser.avatar = req.body.avatar;

			console.log(users);

		res.json({ success: true, user: matchingUser[0] });
	})
app.use('/api', router);




var broadcastUsers = function () {
	io.to('board').emit('users:list', users);
}


//SOCKETS!!!
io.on('connection', function(socket){

	socket.on('board:register', function(){
		socket.join('board');
		broadcastUsers();
	})


});

