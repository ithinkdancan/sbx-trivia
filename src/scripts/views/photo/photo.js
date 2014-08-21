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
			$scope.user = user;
		})


		$scope.$watch(function(){ 
			return authenticationService.isUploading(); 
		}, function(loading){
			$scope.loading = loading;
		})

	}
]);