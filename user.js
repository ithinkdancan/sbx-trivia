var user = function (username) {
	console.log('New User', username);
	this.username = username;
	this.avatar = false;
	this.score = 0;
}

module.exports = user;