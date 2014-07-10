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
			console.log('success!');
			$location.path('/');
		}

		var failure = function () {
			console.log('failure');
			//username was probably taken
		}

		$scope.createTeam = function (){
			if($scope.username){
				authenticationService.register($scope.username).then(success, failure)
			}
		}
	}
]);