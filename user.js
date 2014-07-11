
var user = function (username) {
	console.log('New User', username)
	this.username = username;
	this.answers = [];
	this.avatar = false;
}



module.exports = user