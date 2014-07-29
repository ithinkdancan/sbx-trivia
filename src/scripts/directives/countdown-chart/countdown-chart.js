/**
* sbx.trivia.directive.countdown Module
*
* countdown module
*/
angular.module('sbx.trivia.directive.countdown-chart', [])
.directive('countdownChart', [function(){

	return {
		restrict: 'EA',
		scope: {
			countdownChart: '=',
			base: '='
		},
		transclude: true,
		controller: 'countdownChartController',
		templateUrl: 'directives/countdown-chart/countdown-chart.tpl.html',
		link: function($scope, element, attributes){
			console.log('LINKING!');

			var diameter = 380;
			var radius = diameter/2;
			var twoPi = 2 * Math.PI;

			var arc = d3.svg.arc()
			    .startAngle(0)
			    .innerRadius(radius - 30)
			    .outerRadius(radius);

			var arcTween = function (transition, newAngle) {

				transition.attrTween("d", function(d) {

					//bounds checking
					if(isNaN(newAngle)){
						newAngle = 0;
					}

					var interpolate = d3.interpolate(d.endAngle, newAngle);

					return function(t) {
						d.endAngle = interpolate(t);
						return arc(d);
					};
				 });
			};

			var svg = d3.select(element[0]).append("svg")
				.attr("width", diameter)
				.attr("height", diameter);

			var container = svg.append("g")
		    	.attr("transform", "translate("+ diameter/2+","+diameter/2+")");

		     var meter = container.append("g")
    			.attr("class", "progress-meter");


	    	var render = function (timeRemaining) {
	    		console.log('timeRemaining', timeRemaining);

	    		meter.selectAll('*').remove();

	    		if(!timeRemaining){ return; }

	    		var foreground = meter.append("path")
    				.attr("class", "foreground")
    				.datum({endAngle: 0})
    				.transition()
    				.duration(timeRemaining)
    				.ease("linear")
    				.call(arcTween, twoPi);
			
			}

			$scope.$watch('diff', render);


		}
	};
}])
.controller('countdownChartController', ['$scope', '$interval', function($scope, $interval){

	$scope.offset = 0;
	$scope.diff = 0;

	var calculateOffset = function (base){
		if(!base){ return; }
		$scope.offset = $scope.base - (Date.now());
	}

	var calculate = function () {

		if(!$scope.countdownChart) { 
			$scope.diff = 0;
			return; 
		}

		$scope.diff = Math.floor($scope.countdownChart - Date.now() - $scope.offset);

	}

	// countdownInterval = $interval(calculate, 1000);

	// $scope.$on('$destroy', function(){
	// 	$interval.cancel(countdownInterval)
	// })

	$scope.$watch('base', calculateOffset);
	$scope.$watch('countdownChart', calculate);
	
	
}])