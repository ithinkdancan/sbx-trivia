/**
* sbx.trivia.service.socket Module
*
* Description
*/
angular.module('sbx.trivia.service.socket', ['btford.socket-io'])
.factory('socket', ['socketFactory', function (socketFactory) {
  return socketFactory();
}]);