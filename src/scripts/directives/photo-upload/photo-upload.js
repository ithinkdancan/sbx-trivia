angular.module('sbx.trivia.directive.photo-upload', [
	'sbx.trivia.directive.file-upload'
])

.directive('photoUpload', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		controller: 'photoUploadController',
		transclude: true,
		templateUrl: 'directives/photo-upload/photo-upload.tpl.html',
	};
}])

.controller('photoUploadController', ['$scope', 'authenticationService', function($scope, authenticationService){
		

		$scope.onPhotoUpload = function(data){

			var mpCanvas = document.createElement('canvas');
			var img = new Image();
  		
  			img.onload = function() {
  				EXIF.getData(img, function() {
                    var orientation = EXIF.getTag(this, "Orientation") || 0;
                    var mpImg = new MegaPixImage(img);
	  				mpImg.render(mpCanvas, { maxWidth: 250, maxHeight: 250, orientation: orientation });

	  				authenticationService.uploadPhoto(mpCanvas.toDataURL());

                });
  			}

  			img.src = data.dataUrl;
		}

}]);