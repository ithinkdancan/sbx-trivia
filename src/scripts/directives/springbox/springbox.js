/**
* sbx.trivia.directive.springbox Module
*
* Spring BOX
*/
angular.module('sbx.trivia.directive.springbox', [])
.directive('springbox', [function(){
	// Runs during compile
	return {
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'directives/springbox/springbox.tpl.html',
	};
}])
.controller('springboxController', ['$scope', function($scope){
	
}])