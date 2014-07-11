angular.module('sbx.trivia.directive.header', ['sbx.trivia.service.authentication'])

.directive('sbxHeader', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		controller: 'sbxHeaderController',
		templateUrl: 'directives/header/header.tpl.html',
	};
}])

.controller('sbxHeaderController', ['$scope', 'authenticationService', function($scope, authenticationService){
		
		//watch for authentication
		$scope.$watch(function(){ 
			return authenticationService.isAuthenticated(); 
		}, function(authenticated){
			$scope.authenticated = authenticated;
		})

}])