var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require("fs");
var mkdirp = require('mkdirp');
var shortId = require('shortid');


var User = require('./user.js');
var Game = require('./game.js');

var users = require('./data/users.json');
var games = require('./data/games.json');

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
				return obj.username == username; 
			});
		
		//check if the username is already in use
		if( matchingUser.length > 0 ){
			res.json({ success: false });		
		} else {
			console.log('creating a new user', username);
			var user = new User(username);
			users.push(user);
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
		var matchingUser = findUser(username);

			matchingUser.avatar = req.body.avatar;

			var base64Data = matchingUser.avatar.replace(/^data:image\/png;base64,/, "");
			mkdirp('dist/uploads', function (err) {
				fs.writeFile('dist/uploads/' + matchingUser.cid + ".png", base64Data, 'base64', function(err) {
					 matchingUser.avatar =  encodeURI('/uploads/' + matchingUser.cid + ".png?cache=" + shortId.generate());

					 res.json({ success: true, user: matchingUser });

					 broadcastUsers();

				});
			});	
	})

app.use('/api', router);

var updateUserScores = function(){
	
	//Reset Scores
	users.map(function(user){
		user.score = 0;
	})

	//Tally up the scores!
	games.forEach(function(game){
		var gameScores = game.data.scores;
		for(cid in gameScores){
			var user = findUserById(cid);
			if(user){
				user.score += gameScores[user.cid];
			}
		}
	});

	broadcastUsers();

}


var createGame = function () {
	var game = new Game({
		io:io,
		onStart: broadcastGamesList,
		onNext: broadcastGamesList,
		onResult: updateUserScores,
		onEnd: createGame
	});
	games.push(game);

	broadcastGamesList();
	saveGames();
}

var findUser = function (username) {

	var match = users.filter(function(user){ 
		return user.username.toLowerCase() == username.toLowerCase();
	});

	return match ? match[0] : false;

};

var findUserById = function (cid) {

	var match = users.filter(function(user){ 
		return user.cid == cid;
	});

	return match ? match[0] : false;

};

var findGame = function (id) {

	var match = games.filter(function(obj){ 
		return obj.id == +id;
	});

	return match ? match[0] : false;

}

var joinGame = function (data, socket) {

	var game = findGame(data.id);
	var user = findUserById(data.cid);

	if(game){
		game.addUser(user, socket);
		broadcastGamesList();
	} else {
		console.log('didnt find that game');
		socket.emit('game:leave', {message: 'Game does not exist'});
	}
}

var leaveGame = function (data, socket) {

	var game = findGame(data.id);
	var user = findUserById(data.cid);

	if(game){
		game.removeUser(user, socket);
		broadcastGamesList();
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
	saveUsers();
}

var broadcastGamesList = function (socket) {

	//get only games that are not complete
	var gamesData = games
		.map(function(obj){ obj.data.currentTime = Date.now(); return obj.data; })
		.filter(function(obj){ return obj.completed == false; });

	if(socket){
		socket.emit('games:list', gamesData);
	} else {
		io.sockets.emit('games:list', gamesData);
	}
	
}

var broadcastCurrentGameQuestion = function (socket) {

	var activeGame = games
		.filter(function(obj){ return obj.data.completed == false && obj.data.started == true; });

	if(activeGame[0]){
		activeGame[0].updateBoard(socket);
	}

}

var saveGames = function () {

	var gamesData = games
		.map(function(obj){ return {data: obj.data }; })
		.filter(function(obj){ return obj.data.completed == true; });

	fs.writeFile('./data/games.json', JSON.stringify(gamesData),  function (err) {});
}

var saveUsers = function () {
	fs.writeFile('./data/users.json', JSON.stringify(users),  function (err) {});
}


//SOCKETS!!!
io.on('connection', function(socket){
	
	socket.on('board:register', function(){
		socket.join('board');
		broadcastUsers();
		broadcastGamesList(socket);
		broadcastCurrentGameQuestion(socket);
	});

	socket.on('user:register', function(){
		broadcastGamesList(socket)
		broadcastUsers();
	});

	socket.on('game:join', function(data){
		joinGame(data, socket);
	});

	socket.on('game:leave', function(data){
		leaveGame(data, socket);
	});

	socket.on('question:answer', function(data){
		answerQuestion(data);
	});

});

createGame();

// for (var i = 0; i < 12; i++) {
// 	var user = new User('user-' + i);
// 	user.avatar = 'http://lorempixel.com/200/200/?id='+users.length;
// 	users.push(user);
// };

