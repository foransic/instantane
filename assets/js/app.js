angular.module('instantane', [])

.controller('ListCtrl', function($scope, $http) {
  $http.get('api/pictures').
    success(function(data, status, headers, config) {
      $scope.pictures = data;
    }).error(function(error) {
      console.log('An error occured : ' + error);
    });
});
