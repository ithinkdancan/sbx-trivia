/**
* sbx.trivia.controller.home Module
*
* Home Controller
*/
angular.module('sbx.trivia.controller.home', ['sbx.trivia.directive.springbox', 'sbx.trivia.service.socket'])

.controller('homeController', 
	['$scope', 'socket',
	function($scope, socket){

	 $scope.games = false;

	 var updateGames = function (games) {
	 	console.log('games update', games)
	 	$scope.games = games;
	 }

	 socket.emit('user:register');

	 socket.on('games:list', updateGames)
	
}])