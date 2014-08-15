/**
* sbx.trivia.controller.home Module
*
* Home Controller
*/
angular.module('sbx.trivia.controller.home', [
	'sbx.trivia.directive.countdown', 
	'sbx.trivia.service.socket',
	'sbx.trivia.directive.countdown-chart'
])

.controller('homeController', 
	['$scope', 'socket',
	function($scope, socket){

	 $scope.games = false;

	 var updateGames = function (games) {
	 	console.log('games update', games)
	 	if(games.length){
	 		$scope.game = games[0];
	 	}
	 	
	 }

	 $scope.logout = function (){
	 	localStorage.removeItem('username');
	 }

	 socket.emit('user:register');

	 socket.on('games:list', updateGames)

	 //listener Cleanup
	 $scope.$on('$destroy', function(){
	 	socket.removeListener('games:list')
	 });
	
}])