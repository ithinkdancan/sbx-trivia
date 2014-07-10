/**
* sbx.trivia.controller.board Module
*
* Description
*/
angular.module('sbx.trivia.controller.board', ['sbx.trivia.service.socket'])

.controller('boardController', 
		  	['$scope', 'socket',
	function ($scope,   socket){

		socket.emit('board:register');

		socket.on('users:list', function(data){
			console.log('users:list', data)
		});

	}
]);