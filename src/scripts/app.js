angular.module('sbx.trivia', ['btford.socket-io'])

.factory('quizSocket', ['socketFactory', function (socketFactory) {
  return socketFactory();
}]);