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
	var authenticated = false;
	
	return {


		isAuthenticated: function (failureRedirect) {
			
			username = localStorage.getItem('username');

			if(username){
				if(!authenticated){
					console.log(this)
					authenticated = true;
					this.register(username);
				}
 				return true;
			} else {
				return false;
			}

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