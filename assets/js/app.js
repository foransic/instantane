angular.module('instantane', [])

.controller('ListCtrl', function($scope, $http) {
  $scope.pictures = [];
  $scope.limit = 3;
  $scope.lastBatch = 0;
  $scope.currentIndex = 0;

  $scope.addMore = function() {
    $http.get('api/pictures?index=' + $scope.currentIndex + '&limit=' + $scope.limit).
    success(function(data, status, headers, config) {
      $scope.lastBatch = data.length;
      $scope.pictures = $scope.pictures.concat(data);
      $scope.currentIndex += $scope.limit;

      console.log()
      if ($scope.lastBatch == $scope.limit) $scope.addMore();
     }).error(function(error) {
       console.log('An error occured : ' + error);
     });
  }

  $scope.addMore();
}).controller('ClassCtrl', function($scope) {
  $scope.isActive = false;
  $scope.zoom = function() {
    angular.element(document.querySelector('.zoom')).removeClass('zoom');
    $scope.isActive = !$scope.isActive;
  }
});
