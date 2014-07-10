/**
* sbx.trivia.service.authentication Module
*
* Authentication Service
*/
angular.module('sbx.trivia.service.authentication', []).

factory('authenticationService', ['$q', function($q){

	var username;
	
	return {
		isAuthenticated: function (failureRedirect) {
			var defer =  $q.defer();
			username = localStorage.getItem('username');

			if(username){
 				defer.resolve({username:username});
			} else {
				defer.reject({redirect:failureRedirect});
			}

	 		return defer.promise;
		},

		login: function (username) {
			var defer =  $q.defer();

			localStorage.setItem('username', username);
			defer.resolve({username:username});

			return defer.promise;
		}
	};

}])