/**
* sbx.trivia.controller.board Module
*
* Description
*/
angular.module('sbx.trivia.controller.board', ['sbx.trivia.service.socket', 'sbx.trivia.directive.countdown-chart'])

.controller('boardController', 
		  	['$scope', 'socket', '$interval',
	function ($scope,   socket,   $interval){

		$scope.getGridPos = function($index){
			

			var row = Math.floor($index/8);
			var column = $index%8

			return 'row-'+row + ' column-' + column;
		}

		socket.emit('board:register');

		socket.on('users:list', function(data){
			$scope.users = data;
			$scope.visibleUsers = $scope.users.splice(0,8*8);
		});

		$interval(function(){
			if($scope.users.length){
				var randomIndex = Math.floor((Math.random() * $scope.visibleUsers.length))
				var old = $scope.visibleUsers[randomIndex];
				$scope.visibleUsers[randomIndex] = $scope.users.pop();
				$scope.users.push(old);

				// console.log($scope.visibleUsers[randomIndex]);
			}
		}, 5000);

		socket.on('games:list', function(games){
			$scope.game = games[0];
		})

		socket.on('game:question', function(question){
			$scope.question = question;
		})

	}
]);