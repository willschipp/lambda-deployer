angular.module('lambda').controller('functionController',['$scope','FileUploader','$http','$mdSidenav','$state','$mdDialog',function($scope,FileUploader,$http,$mdSidenav,$state,$mdDialog){

  $scope.appConfig = {};
  $scope.selectedStep = 0;

  var editor = null;

  $scope.uploader = new FileUploader({
    url:'/api/upload'
  });


  function enableEditor() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/javascript");
  }

  $scope.captureApplicationName = function() {
    $scope.selectedStep = $scope.selectedStep + 1;
    return true;
  }

  $scope.captureType = function() {
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

  $scope.buildApp = function(ev) {
    //encode the function
    $scope.appConfig.function = window.btoa($scope.appConfig.function);
    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Accepted for creation')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');

    //send
    return $http({method:'POST',url:'/api/docker/build',data:$scope.appConfig}).then(function(resp){
      $mdDialog.show(confirm).then(function() {
        $state.go('list');
      },function() {
        $state.go('list');
      });
    },function(err){
      console.log(err);
      alert('Failure');
    });
  }

}]);
