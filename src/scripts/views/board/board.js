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
		var displayedUsersThreshold = 5;
		var firstValidFrame = null;

		$scope.activeIndex = 8;
		$scope.users = [];
		$scope.gameScores = [];


		$scope.getAvatarClass = function ($index) {

			var classes = [];

			//active class
			if($index == $scope.activeIndex){
				classes.push('active current');
			
			//future class	
			} else if ($index > $scope.activeIndex) {				
				
				//future visible
				if($index <= $scope.activeIndex+displayedUsersThreshold){
					classes.push('active future future-' + ($index - $scope.activeIndex));

				//loop back	
				} else if($scope.activeIndex <= displayedUsersThreshold && $index >= $scope.displayedUsers.length - (displayedUsersThreshold-$scope.activeIndex)){
					classes.push('active past past-' + ($scope.displayedUsers.length + $scope.activeIndex - $index) );

				//future invisible
				} else {
					classes.push('future');
				}

			//Past class
			} else if ($index < $scope.activeIndex) {


				//past visible
				if($index >= $scope.activeIndex-displayedUsersThreshold){
					classes.push('active past past-' + ($scope.activeIndex - $index));
				} else if($scope.activeIndex >= $scope.displayedUsers.length - displayedUsersThreshold &&
						$index <= displayedUsersThreshold - ($scope.displayedUsers.length - $scope.activeIndex)
					) {
					classes.push('active future-' + (($index) + ($scope.displayedUsers.length-$scope.activeIndex) ));
				} else {
					classes.push('past');
				}
			}

			return classes.join(' ');

		};

		socket.on('users:list', function(data){
			$scope.users = data;

			if(!$scope.game || !$scope.game.users.length){
				$scope.displayedUsers = $scope.users;
			}
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
			if(!users){ return; }

			if(users.length){
				$scope.displayedUsers = users;
				$scope.activeIndex = $scope.displayedUsers.length-1;
			} else {
				$scope.displayedUsers = $scope.users;
				$scope.activeIndex = Math.floor($scope.users.length/2);
			}
		})

		$scope.$watch('game.scores',function(scores){
			if(!scores){ return; }
			$scope.gameScores = $scope.game.users.map(function(user){
				user.score = $scope.game.scores[user.cid] || 0;
				return user;
			});
		})

		Leap.loop(function(frame){


			if (frame.valid && frame.hands[0]) {

				if (!firstValidFrame) firstValidFrame = frame
         		var t0 = firstValidFrame.translation(frame);

				// var t = frame.hands[0].palmPosition;
				var xPercent = Math.min(Math.max(t0[0],-300),300)/300;
				var index = Math.floor(baseIndex + xPercent*5);

				//check for loop around
				index = index < 0 ? $scope.users.length + (index) : index;
				index = index >= $scope.users.length ? index%$scope.users.length : index;

				//aply new index
				$scope.$apply(function(){
					$scope.activeIndex = index;
				})

			} else {
				baseIndex = $scope.activeIndex;
			}
		});


		//Kick it off!
		socket.emit('board:register');

	}
]);