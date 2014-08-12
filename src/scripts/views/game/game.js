/**
* sbx.trivia.controller.game Module
*
* Home Controller
*/
angular.module('sbx.trivia.controller.game', [
	'sbx.trivia.service.socket', 
	'sbx.trivia.service.authentication', 
	'sbx.trivia.directive.countdown',
	'sbx.trivia.directive.question'
])

.controller('gameController', 
	['$scope', 'socket', '$routeParams', 'authenticationService', '$location',
	function($scope, socket, $routeParams, authenticationService, $location){

	$scope.game = false;

	var user = false;
	var gameId = $routeParams.id;

	var updateGame = function (game) {
	 	$scope.game = game;
	 	console.log('game update:', $scope.game )

	 	//redirect if game is completed
	 	if($scope.game.completed){
	 		$location.path('/');
	 	} 
	}

	var leaveGame = function () {
		$location.path('/');
	}

	//Change the question
	var updateQuestion = function (data) {
		console.log('question updates: ', data);
		$scope.selectedAnswer = false;
		$scope.correctAnswer = false;
		$scope.question = data;
	}

	//Show the correct answer
	var showResult = function (data) {
		console.log('show result:', data);
		$scope.correctAnswer = data.correctAnswer;
	}

	//user has selected an answer
	$scope.selectAnswer = function (index) {
		
		if($scope.correctAnswer !== false) { return; }

		$scope.selectedAnswer = index;

		socket.emit('question:answer', {
			username: user.username, 
			id: gameId,
			questionId: $scope.question.id,
			answer: $scope.selectedAnswer
		});
	}
	

	//join the game once a user is activated
	$scope.$watch(function(){ 
		return authenticationService.getCurrentUser(); 
	}, function(data){
	 	if(data.username){
	 		user = data;
	 		socket.emit('game:join', {username: user.username, id: gameId});
	 	}
	});

	//leave the game if the route changes
	$scope.$on('$locationChangeStart', function(){
	 	if(gameId){
	 		socket.emit('game:leave', {username: user.username, id: gameId});
	 	}
	});


	//socket events
	socket.on('game:update', updateGame);
	socket.on('game:question', updateQuestion);
	socket.on('game:result', showResult);
	socket.on('game:leave', leaveGame);
	socket.on('game:over', leaveGame);

	$scope.$on('$destroy', function(){
		socket.removeListener('game:update', updateGame);
		socket.removeListener('game:question', updateQuestion);
		socket.removeListener('game:result', showResult);
		socket.removeListener('game:leave', leaveGame);
		socket.removeListener('game:over', leaveGame);
	})
	
}])