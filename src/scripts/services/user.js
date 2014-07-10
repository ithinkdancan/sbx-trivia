angular.module('sbx.trivia.resource.user', ['ngResource'])
  
.factory('User', ['$resource', function ($resource) {
  return $resource('/api/users/:id', {});
}]);