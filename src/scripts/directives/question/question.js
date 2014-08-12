/**
* sbx.trivia.directive.question Module
*
* countdown module
*/
angular.module('sbx.trivia.directive.question', [])
.directive('question', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		scope: {
			question: '=',
			correctAnswer: '=',
			selectedAnswer: '=',
			selectAnswer: '&'
		},
		controller: 'questionController',
		templateUrl: 'directives/question/question.tpl.html'
	};
}])
.controller('questionController', ['$scope', function($scope) {
	
	$scope.$watch('question', function(data){
		console.log('question changed!', data);
	})

}])