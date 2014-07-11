angular.module('sbx.trivia.directive.photo-upload', [])

.controller('photoUploadController', ['$scope', function($scope){
	
	var file;
    var dataUrl;
    var filetypes = ['png', 'gif', 'jpg', 'jpeg'];

    $scope.upload = function () {
      $scope.input.click();
    };

    $scope.uploadImage = function (event) {
      console.log(event.target);
      dataUrl = event.target.result;
      $scope.image.src = dataUrl;
    };

    $scope.imageUploaded = function () {
      var obj = {
        file: file,
        dataUrl: dataUrl,
        width: $scope.image.width,
        height: $scope.image.height
      };

      $scope.$apply(function(){
        $scope.uploadCallback({data:obj});
      });
    }

    $scope.onFileChange = function (event) {
      file = event.target.files[0];
      var check = false;
      for(var i in filetypes) {
        var filetype = '.' + filetypes[i];
        if (file.name.indexOf(filetype, (file.name.length - filetype.length)) > 0) {
          check = true;
        }
      }
      if (check == false) {
        alertManager.error = 'This file type is not supported';
        $scope.$apply();
      } else {
        $scope.reader.readAsDataURL(event.target.files[0]);
      }
    };
}])

.directive('photoUpload', [function(){
	// Runs during compile
	return {
		scope: {
        	uploadCallback: '&'
    	},
		restrict: 'EA',
		replace: true,
		controller: 'photoUploadController',
		transclude: true,
		templateUrl: 'directives/photo-upload/photo-upload.tpl.html',
		link: function($scope, el, attrs) {

			var children = el.children();

			$scope.input = children[1];
			$scope.reader = new FileReader();
       		$scope.image = new Image();

       		angular.element($scope.input).bind('change', $scope.onFileChange);
       		$scope.reader.onload = $scope.uploadImage;
        	$scope.image.onload = $scope.imageUploaded;

		}
	};
}]);

