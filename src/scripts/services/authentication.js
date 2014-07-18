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
	var currentUser = {};
	var authenticated = false;
	
	return {

		getCurrentUser: function () {

			if(this.isAuthenticated()){
				return currentUser;
			}

		},


		isAuthenticated: function (failureRedirect) {
			
			username = localStorage.getItem('username');

			if(username){

				//get user profile
				if(!authenticated){
					authenticated = true;
					var user = new User();
					user.$get({username: username}).then(function(data){
						currentUser = data.user;
					})
				}

 				return true;

			} else {
				return false;
			}

		},


		//create a new user
		register: function (username) {

			var defer =  $q.defer();

			//create a new user resource
			var user = new User({username: username, create: true});	

			//save the user
			user.$save().then(function(data){
				
				if(data.success){
					//save the username to LS
					localStorage.setItem('username', username);

					//set authentication
					authenticated = true;
					currentUser = data.user;

					//resolve
					defer.resolve(currentUser);
				} else {
					defer.reject();
				}

			})	

			//return the promise
			return defer.promise;
		
		},

		uploadPhoto: function(photo) {

			currentUser.avatar = photo;

			var user = new User(currentUser);

			user.$save({username: username}).then(function(data){
				if(data.success && data.user){
					currentUser = data.user;
				}
				console.log('uploadPhoto got something', arguments);
			})
		}
	};

}])