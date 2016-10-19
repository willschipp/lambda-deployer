angular.module('lambda').controller('indexController',['$scope','$mdSidenav',function($scope,$mdSidenav){

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle();
  }

}]);
