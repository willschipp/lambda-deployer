angular.module('lambda').controller('listController',['$scope','listService','$http',function($scope,listService,$http){

  $scope.images = listService.images;
  $scope.containers = listService.containers;

  $scope.runContainer = function(container) {
    return $http({method:'POST',url:'/api/docker/container/' + container.Id + '/start'}).then(function(resp) {
      alert('Starting');
      return listService.getContainers();
    },function(err) {
      console.log(err);
      return;
    }).then(function(result) {
      $scope.containers = result;
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

  $scope.stopContainer = function(container) {
    return $http({method:'PUT',url:'/api/docker/container/' + container.Id + '/stop'}).then(function(resp) {
      alert('Stopped');
      return listService.getContainers();
    },function(err){
      console.log(err);
      return;
    }).then(function(result) {
      $scope.containers = result;
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

  $scope.startContainer = function(container) {
    return $http({method:'PUT',url:'/api/docker/container/' + container.Id + '/start'}).then(function(resp) {
      alert('Stopped');
      return listService.getContainers();
    },function(err){
      console.log(err);
      return;
    }).then(function(result) {
      $scope.containers = result;
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

  $scope.createContainer = function(name) {

    var payload = {
      "appName":name.substring(0,name.indexOf(":"))
    }
    return $http({method:'POST',url:'/api/docker/container',data:payload}).then(function(resp){
      alert('Created');
      return listService.getContainers();
    },function(err){
      console.log(err);
      return;
    }).then(function(result) {
      $scope.containers = result;
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

  $scope.deleteContainer = function(container) {
    return $http({method:'DELETE',url:'/api/docker/container/' + container.Id}).then(function(resp) {
      alert('Deleted');
      return listService.getContainers();
    },function(err){
      console.log(err);
      return;
    }).then(function(result) {
      $scope.containers = result;
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

  $scope.action = function(container) {
    console.log(container.Names[0].substring(1));
    return $http({method:'POST',url:'/api/function?functionName=' + container.Names[0].substring(1)}).then(function(resp) {
      alert(resp.data);
      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

}]);
