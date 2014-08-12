var shortId = require('shortid');

var user = function (username) {

	this.cid = shortId.generate();
	this.username = username;
	this.avatar = false;
	this.score = 0;
}

module.exports = user;