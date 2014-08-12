/**
* sbx.trivia.directive.leaderboard Module
*
* countdown module
*/
angular.module('sbx.trivia.directive.leaderboard', [])
.directive('leaderboard', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		scope: {
			users: '='
		},
		controller: 'leaderboardController',
		templateUrl: 'directives/leaderboard/leaderboard.tpl.html'
	};
}])
.controller('leaderboardController', ['$scope', '$filter', function($scope, $filter){
		
}])