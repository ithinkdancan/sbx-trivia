/**
* sbx.trivia.controller.photo Module
*
* Description
*/
angular.module('sbx.trivia.controller.photo', ['sbx.trivia.service.authentication'])

.controller('photoController', 
		  	['$scope', 'authenticationService', '$location',
	function ($scope,   authenticationService,   $location){

		//watch for user changes
		$scope.$watch(function(){ 
			return authenticationService.getCurrentUser(); 
		}, function(user){
			console.log('user', user);
			$scope.user = user;
		})

	}
]);