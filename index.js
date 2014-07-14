var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var bodyParser = require('body-parser');


var User = require('./user.js');
var Game = require('./game.js');

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
			users.push(user);
			broadcastUsers();
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

			broadcastUsers();

		res.json({ success: true, user: matchingUser[0] });
	})
app.use('/api', router);


var createGame = function () {
	var game = new Game({
		io:io,
		onStart: false,
		onNext: false,
		onComplete: false
	});
	games.push(game);
}

var findGame = function (id) {

	var match = games.filter(function(obj){ 
		return obj.id == +id 
	});;

	return match ? match[0] : false;

}

var joinGame = function (data, socket) {

	var game = findGame(data.id);

	if(game){
		game.addUser(data.username, socket)
		updateGameBoard();
	} else {
		console.log('didnt find that game');
		socket.emit('game:leave', {message: 'Game does not exist'});
	}
}

var leaveGame = function (data, socket) {

	var game = findGame(data.id);

	if(game){
		game.removeUser(data.username, socket);
		updateGameBoard();
	} else {
		console.log('didnt find that game');
	}

}

var answerQuestion = function(data, socket) {

	var game = findGame(data.id);

	if(game){
		game.userAnswer(data);
	} else {
		console.log('didnt find that game');
	}

}

var broadcastUsers = function () {
	io.to('board').emit('users:list', users);
}

var updateGameBoard = function (socket) {

	var gamesData = games.map(function(obj){ return obj.data; })

	if(socket){
		socket.emit('games:list', gamesData);
	} else {
		io.sockets.emit('games:list', gamesData);
	}
	
}


//SOCKETS!!!
io.on('connection', function(socket){

	
	socket.on('board:register', function(){
		socket.join('board');
		broadcastUsers();
	})

	socket.on('user:register', function(){
		updateGameBoard(socket)
		broadcastUsers();
	})

	socket.on('game:join', function(data){
		joinGame(data, socket);
	});

	socket.on('game:leave', function(data){
		leaveGame(data, socket);
	})

	socket.on('question:answer', function(data){
		answerQuestion(data);
	})


});

createGame();

