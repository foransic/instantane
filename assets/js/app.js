angular.module('instantane', [])

.controller('ListCtrl', function($scope, $http) {
  $http.get('api/pictures').
    success(function(data, status, headers, config) {
      $scope.pictures = data;
    }).error(function(error) {
      console.log('An error occured : ' + error);
    });
}).controller('ClassCtrl', function($scope) {
  $scope.isActive = false;
  $scope.zoom = function() {
    angular.element(document.querySelector('.zoom')).removeClass('zoom');
    $scope.isActive = !$scope.isActive;
  }
});
