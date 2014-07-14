var user = function (username) {
	console.log('New User', username);
	this.username = username;
	this.avatar = false;
}

module.exports = user;