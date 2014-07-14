var game = function () {

	console.log('New Game');

	this.id = Date.now();
	this.users = [];
	this.started = false;
	this.completed = false;

}

game.prototype.addUser = function(username){
	if(this.users.indexOf(username) < 0){
		this.users.push(username);
	}
}

game.prototype.removeUser = function(username){
	var userIndex = this.users.indexOf(username);
	if(userIndex >= 0){
		this.users.splice(userIndex,1);
	}
}

module.exports = game;