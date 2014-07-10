angular.module('sbx.trivia', [
	'ngRoute',
	'sbx.trivia.templates',
	'sbx.trivia.controller.login',
	'sbx.trivia.controller.board',
	'sbx.trivia.service.authentication'
])

.config(['$routeProvider', function($routeProvider){

	$routeProvider

		.when('/', {
			templateUrl: 'home.html',
			 resolve: {

			 	//make sure the user is logged in before showing the home screen
			 	loggedIn: ['authenticationService', function(authenticationService){
			 		return authenticationService.isAuthenticated('/login');
			 	}]
			 }
		})

		.when('/login', {
			controller: 'loginController',
			templateUrl: 'views/login/login.tpl.html',
			resolve: {

				//don't let the user login again
			 	authenticated: ['authenticationService', '$location', function(authenticationService, $location){
			 		authenticationService.isAuthenticated().then(function(){
			 			$location.path('/');
			 		})
			 	}]
			}
		})

		.when('/board', {
			controller: 'boardController',
			templateUrl: 'views/board/board.tpl.html',
		})

		.otherwise({ 
	        redirectTo: '/'
	    });

}])

.controller('appController', ['$rootScope', '$location', function($rootScope, $location){

	//catches rejected route resolve promises
	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
		if(rejection && rejection.redirect){
			$location.path(rejection.redirect);
		}
	})

}])