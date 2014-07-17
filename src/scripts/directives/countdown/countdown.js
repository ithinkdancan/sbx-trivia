/**
* sbx.trivia.directive.countdown Module
*
* countdown module
*/
angular.module('sbx.trivia.directive.countdown', [])
.directive('countdown', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		scope: {
			countdown: '='
		},
		controller: 'countdownController',
		templateUrl: 'directives/countdown/countdown.tpl.html',
	};
}])
.controller('countdownController', ['$scope', '$interval', function($scope, $interval){

	$scope.diff = 0;

	var calculate = function () {

		if(!$scope.countdown) { return; }

		diff = $scope.countdown/1000 - Date.now()/1000;

		$scope.minutes = diff < 0 ? 0 : Math.floor(diff/60)%60;
		$scope.seconds = diff < 0 ? 0 : Math.floor(diff%60);

		if($scope.seconds < 10){
			$scope.seconds = '0' + $scope.seconds;
		}

	}

	countdownInterval = $interval(calculate, 1000);

	$scope.$on('$destroy', function(){
		$interval.cancel(countdownInterval)
	})

	$scope.$watch('countdown', calculate);
	
}])