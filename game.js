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

	this.gameDelay = 5000;

	this.gameStartDelay = 20000*5;

	this.requiredPlayers = 2;

	this.startTimeout = false;

	
	//Public Game Data
	this.data = {
		id: this.id,
		users: [],
		scores: {},
		started: false,
		completed: false,
		startTime: false
	}

}

game.prototype.update = function () {
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

	var that = this;
	this.currentQuestion++;

	if(questions[this.currentQuestion]){

		this.questionActive = true;
		this.broadcastQuestion(this.currentQuestion);

		setTimeout(function(){
			that.broadcastResult.call(that,that.currentQuestion);
		},this.gameDelay)

		if(typeof this.onGameNext == 'function'){
			this.onGameNext();
		}

	} else {
		this.end();
	}
};

game.prototype.end = function () {

	this.io.to(this.gameRoom).emit('game:over');
	this.data.completed = true;

	if(typeof this.onGameEnd == 'function'){
		this.onGameEnd();
	}

}

game.prototype.addUser = function(username, socket){
	
	if(this.data.users.indexOf(username) < 0){
		console.log(username + ' has joined the game');
		
		this.data.users.push(username);
		
		//start the game in in 30 seconds or so
		var that = this;
		if(!this.data.started && this.data.users.length == this.requiredPlayers){

			this.data.startTime = Date.now() + this.gameStartDelay;
			
			this.startTimeout = setTimeout(function(){
				that.start()
			},this.gameStartDelay)

		}
	} 

	socket.join(this.gameRoom);

	if(this.questionActive){
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

game.prototype.broadcastResult = function (index){

	var that = this;
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
	setTimeout(function(){
		that.next.call(that);
	},this.gameDelay)

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
			options: question.options,
			results: []
		}

		console.log('sending Question', data.text)
		
		if(socket){
			socket.emit('game:question', data);
		} else {
			this.io.to(this.gameRoom).emit('game:question', data);
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