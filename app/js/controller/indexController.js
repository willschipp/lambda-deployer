angular.module('lambda').controller('indexController',['$scope','$mdSidenav',function($scope,$mdSidenav){
  
  $scope.toggleLeft = function() {
    console.log('invoked');
    $mdSidenav('left').toggle();
  }

}]);
