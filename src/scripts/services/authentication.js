/**
* sbx.trivia.service.authentication Module
*
* Authentication Service
*/
angular.module('sbx.trivia.service.authentication', ['sbx.trivia.resource.user']).

factory('authenticationService', [
			'$q', 'User', 
	function($q, User){

	var username;
	
	return {

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


		register: function (username) {

			var defer =  $q.defer();

			//create a new user resource
			var user = new User({username: username});	

			//save the user
			user.$save().then(function(data){
				if(data.success){
					localStorage.setItem('username', username);
					defer.resolve();
				} else {
					defer.reject();
				}
			})	

			//return the promise
			return defer.promise;
		
		}
	};

}])