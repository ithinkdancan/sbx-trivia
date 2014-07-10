/**
* sbx.trivia.service.authentication Module
*
* Authentication Service
*/
angular.module('sbx.trivia.service.authentication', ['sbx.trivia.service.socket']).

factory('authenticationService', [
			'$q', 'socket', 
	function($q, socket){

	var username;
	
	return {

		getUsername: function () {

		},

		isAuthenticated: function (failureRedirect) {
			var defer =  $q.defer();
			username = localStorage.getItem('username');

			if(username){
				this.register(username);
 				defer.resolve({username:username});
			} else {
				defer.reject({redirect:failureRedirect});
			}

	 		return defer.promise;
		},

		login: function (username) {
			var defer =  $q.defer();

			this.register(username);
			localStorage.setItem('username', username);
			defer.resolve({username:username});

			return defer.promise;
		},

		register: function (username) {
			socket.emit('client',{ action: 'register', team: username });
		}
	};

}])