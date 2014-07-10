/**
* sbx.trivia.controller.login Module
*
* Description
*/
angular.module('sbx.trivia.controller.login', ['sbx.trivia.service.authentication'])

.controller('loginController', 
		  	['$scope', 'authenticationService', '$location',
	function ($scope,   authenticationService,   $location){

		var success = function () {
			$location.path('/');
		}

		var failure = function () {
			console.log('failure');
		}

		$scope.createTeam = function (){
			if($scope.username){
				authenticationService.login($scope.username).then(success, failure)
			}
		}
	}
]);