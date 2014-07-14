var questions = require('./questions.json');

var game = function (io) {

	console.log('New Game');

	this.io = io;
	this.id = Date.now();
	this.gameRoom = 'game:' + this.id;
	this.currentQuestion = -1;
	this.questionActive = false;
	this.answers = [];
	
	this.data = {
		id: this.id,
		users: [],
		started: false,
		completed: false,
	}

}

game.prototype.update = function () {
	console.log('sending update', this.data)
	this.io.to(this.gameRoom).emit('game:update', this.data);
};

game.prototype.start = function () {

	this.data.started = true;

	this.next();
	this.update();
};

game.prototype.next = function () {

	this.currentQuestion++;
	this.questionActive = true;
	this.broadcastQuestion(this.currentQuestion);

	// setTimeout(function(){
	// 	this.broadcastResult.call(this,this.currentQuestion);
	// },30000)

};

game.prototype.addUser = function(username, socket){
	
	if(this.data.users.indexOf(username) < 0){
		console.log(username + ' has joined the game');
		
		this.data.users.push(username);
		var that = this;

		if(!this.data.started && this.data.users.length == 1){
			setTimeout(function(){
				that.start()
			},1000)
		}
	} else {

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
	}
}

game.prototype.broadcastResult = function (index){



}

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

		console.log('sending Question', data)
		
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