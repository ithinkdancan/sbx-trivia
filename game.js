var questions = require('./questions2.json');
var  _ = require('lodash');

var game = function (config) {

	console.log('New Game');

	//Socket Interface
	this.io = config.io;

	// this.questions = _.sample(questions, 15);

	this.questions = questions.filter(function(question){ return question.image; });

	//Event Callbacks
	this.onGameStart = config.onStart || false;
	this.onGameEnd = config.onEnd || false;
	this.onGameResult = config.onResult || false;
	this.onGameNext = config.onNext || false;

	//Room ID
	this.id = Date.now();

	//Socket Room Name
	this.gameRoom = 'game:' + this.id;

	//Current Question Showing
	this.currentQuestion = -1;

	//Question Status
	this.questionActive = false;

	//User Answers for each question
	this.answers = [];

	this.gameDelay = 1000;

	this.gameResultDelay = 1000;

	this.gameOverDelay = 5000;

	this.gameStartDelay = 1000*60*0;

	this.requiredPlayers = 1;

	this.startTimeout = false;

	
	//Public Game Data
	this.data = {
		id: this.id,
		users: [],
		scores: {},
		started: false,
		completed: false,
		startTime: false,
		currentTime: false
	}

}

game.prototype.update = function () {
	this.data.currentTime = Date.now();
	this.io.to(this.gameRoom).emit('game:update', this.data);
};

game.prototype.updateBoard = function (socket) {
	this.broadcastQuestion(this.currentQuestion, socket);
}

game.prototype.start = function () {

	this.data.started = true;
	
	if(typeof this.onGameStart == 'function'){
		this.onGameStart();
	}

	this.next();
	this.update();
};

game.prototype.next = function () {

	this.currentQuestion++;

	if(this.questions[this.currentQuestion]){

		this.questionActive = true;
		this.questionEndTime = Date.now() + this.gameDelay;
		this.broadcastQuestion(this.currentQuestion);

		setTimeout(this.broadcastResult.bind(this,this.currentQuestion) ,this.gameDelay);

		if(typeof this.onGameNext == 'function'){
			this.onGameNext();
		}

	} else {
		this.end();
	}
};

game.prototype.end = function () {

	this.data.completed = true;

	setTimeout(this.broadcastEnd.bind(this) ,this.gameOverDelay);

	if(typeof this.onGameEnd == 'function'){
		this.onGameEnd();
	}

}

game.prototype.findUser = function (cid) {

	var match = this.data.users.filter(function(user){ 
		return user.cid == cid;
	});

	return match ? match[0] : false;

};

game.prototype.addUser = function(user, socket){

	
	if(!this.findUser(user.cid)){
		console.log(user.username + ' has joined the game');
		
		this.data.users.push(user);
		
		//start the game in in 30 seconds or so
		if(!this.data.started && this.data.users.length == this.requiredPlayers){
			this.data.startTime = Date.now() + this.gameStartDelay;
			this.startTimeout = setTimeout(this.start.bind(this), this.gameStartDelay);
		}
	} 

	socket.join(this.gameRoom);

	if(this.currentQuestion >= 0){
		this.broadcastQuestion(this.currentQuestion, socket);
	}

	this.update();	

	
}

game.prototype.removeUser = function(user, socket){
	
	var userIndex = this.data.users.indexOf(user);
	
	if(userIndex >= 0){
		console.log(user.username + ' has left the game');
		
		this.data.users.splice(userIndex,1);
		socket.leave(this.gameRoom);

		if(this.startTimeout && this.data.users.length < this.requiredPlayers){
			console.log('cancel it!')
			clearTimeout(this.startTimeout);
			this.data.startTime = false;
		}
	}

	this.update();	
}

game.prototype.calculateScores = function () {

	this.data.scores = {};

	
	for (var i = 0; i <= this.currentQuestion; i++) {
		for(cid in this.answers[i]){
			if(this.answers[i][cid] == this.questions[i].correct){
				if(this.data.scores[cid]){
					this.data.scores[cid]++;
				} else {
					this.data.scores[cid] = 1;
				}
			} 
		}
	};

	console.log(this.data.scores);
};

game.prototype.broadcastEnd = function () {

	//send the message
	this.io.to(this.gameRoom).emit('game:over');
	var roomName = this.gameRoom;

	//empty the room
	this.io.sockets.in(this.gameRoom).sockets.forEach(function(s){
	    s.leave(roomName);
	});

}

game.prototype.broadcastResult = function (index){

	var question = this.questions[index];

	this.questionActive = false;

	var result = {
		id: index,
		correctAnswer: question.correct
	};

	this.io.to(this.gameRoom).emit('game:result', result);
	this.io.to('board').emit('game:result', result);

	//Update Scores
	this.calculateScores();

	if(typeof this.onGameResult == 'function'){
		this.onGameResult();
	}

	// Show the Next Question
	setTimeout(this.next.bind(this), this.gameResultDelay);

};

game.prototype.broadcastQuestion = function (index, socket){
	
	if(this.questionActive){
		var question = this.questions[index];

		if(!this.answers[index]){
			this.answers[index] = {};
		}

		var data = {
			id: index,
			text : question.text,
			image : question.image || false,
			options: question.options,
			endTime: this.questionEndTime,
			currentTime: Date.now(),
			results: []
		}
		
		if(socket){
			socket.emit('game:question', data);
		} else {
			this.io.to(this.gameRoom).emit('game:question', data);
			this.io.to('board').emit('game:question', data);
		}

		// broadcastNumResponses();
	}

}

game.prototype.userAnswer = function (data) {

	if(data.questionId == this.currentQuestion && this.questionActive){
		this.answers[this.currentQuestion][data.cid] = data.answer;
	}

}

module.exports = game;