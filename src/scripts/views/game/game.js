/**
* sbx.trivia.controller.game Module
*
* Home Controller
*/
angular.module('sbx.trivia.controller.game', ['sbx.trivia.service.socket', 'sbx.trivia.service.authentication'])

.controller('gameController', 
	['$scope', 'socket', '$routeParams', 'authenticationService',
	function($scope, socket, $routeParams, authenticationService){

	$scope.game = false;

	var user = false;
	var gameId = $routeParams.id;

	var updateGame = function (game) {
	 	$scope.game = game;
	}

	var updateQuestion = function () {

	}

	var showResult = function () {
		
	}
	

	//join the game once a user is activated
	$scope.$watch(function(){ 
		return authenticationService.getCurrentUser(); 
	}, function(data){
	 	if(data.username){
	 		console.log('joining game', gameId);
	 		var user = data;
	 		socket.emit('game:join', {username: user.username, id: gameId});
	 	}
	});

	//leave the game if the route changes
	$scope.$on('$locationChangeStart', function(){
	 	if(gameId){
	 		console.log('leaving game', gameId);
	 		socket.emit('game:leave', {username: user.username, id: gameId});
	 	}
	});


	//socket events
	socket.on('game:update', updateGame);
	socket.on('game:question', updateQuestion);
	socket.on('game:result', showResult)
	
}])