angular.module('sbx.trivia', [
	'ngRoute',
	'ngAnimate',
	'ngTouch',
	'sbx.trivia.templates',
	'sbx.trivia.directive.header',
	'sbx.trivia.controller.login',
	'sbx.trivia.controller.board',
	'sbx.trivia.controller.home',
	'sbx.trivia.controller.game',
	'sbx.trivia.controller.photo',
	'sbx.trivia.service.authentication'
])

.config(['$routeProvider', function($routeProvider){

	var authResolver = ['authenticationService', '$location', function(authenticationService, $location){
 		if(!authenticationService.isAuthenticated()){
 			$location.path('/login')
 		}
 	}]

	$routeProvider

		.when('/', {
			controller: 'homeController',
			templateUrl: 'views/home/home.tpl.html',
			resolve: {

			 	//make sure the user is logged in before showing the home screen
			 	authenticated: authResolver
			}
		})

		.when('/login', {
			controller: 'loginController',
			templateUrl: 'views/login/login.tpl.html',
			resolve: {

				//don't let the user login again
			 	authenticated: ['authenticationService', '$location', function(authenticationService, $location){
			 		if(authenticationService.isAuthenticated()){
			 			$location.path('/');
			 		}
			 	}]
			}
		})

		.when('/photo', {
			controller: 'photoController',
			templateUrl: 'views/photo/photo.tpl.html',
			resolve: {
			 	//make sure the user is logged in before showing the home screen
			 	authenticated: authResolver
			}
		})

		.when('/game/:id', {
			controller: 'gameController',
			templateUrl: 'views/game/game.tpl.html',
			resolve: {
			 	//make sure the user is logged in before showing the home screen
			 	authenticated: authResolver
			}
		})

		.when('/board', {
			controller: 'boardController',
			templateUrl: 'views/board/board.tpl.html'
		})

		.otherwise({ 
	        redirectTo: '/'
	    });

}])

.controller('appController', ['$rootScope', '$location', function($rootScope, $location){

}])