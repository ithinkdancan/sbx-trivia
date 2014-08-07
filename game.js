var questions = require('./questions.json');

var game = function (config) {

	console.log('New Game');

	//Socket Interface
	this.io = config.io;

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

	this.gameDelay = 10000;

	this.gameOverDelay = 5000;

	this.gameStartDelay = 60000;

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

	if(questions[this.currentQuestion]){

		this.questionActive = true;
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

game.prototype.addUser = function(username, socket){
	
	if(this.data.users.indexOf(username) < 0){
		console.log(username + ' has joined the game');
		
		this.data.users.push(username);
		
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

game.prototype.removeUser = function(username, socket){
	var userIndex = this.data.users.indexOf(username);
	
	if(userIndex >= 0){
		console.log(username + ' has left the game');
		
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
		for(username in this.answers[i]){
			if(this.answers[i][username] == questions[i].correct){
				if(this.data.scores[username]){
					this.data.scores[username]++;
				} else {
					this.data.scores[username] = 1;
				}
			} 
		}
	};
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

	var question = questions[index];

	this.questionActive = false;

	this.io.to(this.gameRoom).emit('game:result', {
		id: index,
		correctAnswer: question.correct
	});

	//Update Scores
	this.calculateScores();

	if(typeof this.onGameResult == 'function'){
		this.onGameResult();
	}

	// Show the Next Question
	setTimeout(this.next.bind(this), this.gameDelay);

};

game.prototype.broadcastQuestion = function (index, socket){
	
	if(this.questionActive){
		var question = questions[index];

		if(!this.answers[index]){
			this.answers[index] = {};
		}

		var data = {
			id: index,
			text : question.text,
			image : question.image || false,
			options: question.options,
			results: []
		}

		console.log('sending Question', data.text)
		
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
		this.answers[this.currentQuestion][data.username] = data.answer;
	}

}

module.exports = game;