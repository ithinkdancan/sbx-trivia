var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./user.js');
var router = express.Router();
var bodyParser = require('body-parser');

var users = [];

//create the server
http.listen(8080);

//set up the static resources (HTML, JS, CSS)
app.use(express.static(__dirname + '/dist/'));

//set up the api
app.use(bodyParser.json());

router.route('/users')
	.post(function(req, res) {

		var username = req.body.username;
		
		//check if the username is already in use
		if( users.filter(function(){ return this.username = username }).length > 0 ){
			res.json({ success: false });
		} else {
			users.push(new User(username))
			res.json({ success: true });
		}
		
	})


app.use('/api', router);



// registerClient = function (data){

// 	//check if there is already a user
// 	if( users.filter(function(){ return this.username = data.username }).length > 0 ){

// 	}

// 	var user = new User(data.username);
// 	users.push(user);

// 	console.log(users);

// }


// //SOCKETS!!!
io.on('connection', function(socket){

});

