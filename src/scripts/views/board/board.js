/**
* sbx.trivia.controller.board Module
*
* Description
*/
angular.module('sbx.trivia.controller.board', [
	'sbx.trivia.service.socket', 
	'sbx.trivia.directive.countdown-chart',
	'sbx.trivia.directive.leaderboard',
	'sbx.trivia.directive.question'
])

.controller('boardController', 
		  	['$scope', 'socket', '$interval',
	function ($scope,   socket,   $interval){

		var baseIndex = 0;
		var displayedUsersThreshold = 10;

		$scope.activeIndex = 5;
		$scope.users = [];


		$scope.getAvatarClass = function ($index) {

			var classes = [];

			//active class
			if($index == $scope.activeIndex){
				classes.push('active current');
			//future class	
			} else if ($index > $scope.activeIndex) {
				classes.push('future');

				//future visible
				if($index < $scope.activeIndex+displayedUsersThreshold){
					classes.push('active future-' + ($index - $scope.activeIndex));
				}

			//Past class
			} else if ($index < $scope.activeIndex) {
				classes.push('past');

				//past visible
				if($index > $scope.activeIndex-displayedUsersThreshold){
					classes.push('active past-' + ($scope.activeIndex - $index));
				}
			}

			return classes.join(' ');

		};

		socket.emit('board:register');

		socket.on('users:list', function(data){
			$scope.users = data;
		});

		socket.on('games:list', function(games){
			$scope.game = games[0];
		})

		socket.on('game:question', function(question){
			$scope.correctAnswer = false;
			$scope.question = question;
		})

		socket.on('game:result', function(data){
			$scope.correctAnswer = data.correctAnswer;
		})

		$scope.$watch('game.users',function(users){
			if(users.length){
				$scope.displayedUsers = $scope.users.filter(function(user){
					return users.indexOf(user.username) >= 0;
				})
				$scope.activeIndex = $scope.displayedUsers.length-1;
			} else {
				$scope.displayedUsers = $scope.users;
				$scope.activeIndex = Math.floor($scope.users.length/2);
			}
		})

		Leap.loop(function(frame){
			if (frame.valid && frame.hands[0]) {	

				var t = frame.hands[0].palmPosition;
				var xPercent = Math.min(Math.max(t[0],-300),300)/300;


				$scope.$apply(function(){
					$scope.activeIndex = Math.min(Math.max(Math.floor(baseIndex + xPercent*10),0),$scope.users.length) ;
				})

			} else {
				baseIndex = $scope.activeIndex;
			}
		});

	}
]);