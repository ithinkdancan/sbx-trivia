angular.module('sbx.trivia.directive.header', [
	'sbx.trivia.service.authentication',
	'sbx.trivia.directive.photo-upload'
])

.directive('sbxHeader', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		controller: 'sbxHeaderController',
		templateUrl: 'directives/header/header.tpl.html',
	};
}])

.controller('sbxHeaderController', ['$scope', 'authenticationService', function($scope, authenticationService){

		//watch for user changes
		$scope.$watch(function(){ 
			return authenticationService.getCurrentUser(); 
		}, function(user){
			$scope.user = user;
		})

		//watch for authentication
		$scope.$watch(function(){ 
			return authenticationService.isAuthenticated(); 
		}, function(authenticated){
			$scope.authenticated = authenticated;
		})

}]);