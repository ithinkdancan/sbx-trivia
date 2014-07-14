angular.module('sbx.trivia.directive.header', [
	'sbx.trivia.service.authentication', 
	'sbx.trivia.directive.photo-upload'
])

.directive('sbxHeader', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		controller: 'sbxHeaderController',
		templateUrl: 'directives/header/header.tpl.html',
	};
}])

.controller('sbxHeaderController', ['$scope', 'authenticationService', function($scope, authenticationService){
		

		var resize = function () {
			console.log(this)			
		}

		$scope.onPhotoUpload = function(data){

			var mpCanvas = document.createElement('canvas');
			var img = new Image();
  		
  			img.onload = function() {

  				EXIF.getData(img, function() {
                    var orientation = EXIF.getTag(this, "Orientation") || 0;

                    var mpImg = new MegaPixImage(img);
	  				mpImg.render(mpCanvas, { maxWidth: 200, maxHeight: 200, orientation: orientation });

	  				authenticationService.uploadPhoto(mpCanvas.toDataURL());

                });
  			}

  			img.src = data.dataUrl;
		}

		

		//watch for user changes
		$scope.$watch(function(){ 
			return authenticationService.getCurrentUser(); 
		}, function(user){
			$scope.user = user;
		})

		//watch for authentication
		$scope.$watch(function(){ 
			return authenticationService.isAuthenticated(); 
		}, function(authenticated){
			$scope.authenticated = authenticated;
		})

}]);