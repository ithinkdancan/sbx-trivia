
var user = function (username) {
	console.log('username', username)
	this.username = username
}

user.prototype = {


}

module.exports = user