angular.module('lambda').controller('homeController',['$scope','FileUploader','$http','$mdSidenav','$scope',function($scope,FileUploader,$http,$mdSidenav,$scope){

  $scope.appConfig = {};
  $scope.selectedStep = 0;

  var editor = null;

  $scope.uploader = new FileUploader({
    url:'/api/upload'
  });


  function enableEditor() {
    console.log('invoked');
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
  }

  $scope.captureApplicationName = function() {
    console.log($scope.appConfig);
    $scope.selectedStep = $scope.selectedStep + 1;
    return true;
  }

  $scope.captureType = function() {
    console.log($scope.appConfig);
    $scope.selectedStep = $scope.selectedStep + 1;
    enableEditor();
    return true;
  }

  $scope.captureCode = function() {

    $scope.appConfig.function = editor.getValue();
    $scope.selectedStep = $scope.selectedStep + 1;
    return true;
  }

  $scope.captureDependencies = function() {
    $scope.selectedStep = $scope.selectedStep + 1;
    return true;
  }

  $scope.buildApp = function() {
    //encode the function
    $scope.appConfig.function = window.btoa($scope.appConfig.function);
    console.log($scope.appConfig);
    //send
    return $http({method:'POST',url:'/api/docker/build',data:$scope.appConfig}).then(function(resp){
      alert('Accepted');
      $scope.go('/list');
    },function(err){
      console.log(err);
      alert('Failure');
    });
  }

}]);
