angular.module('lambda').controller('listController',['$scope','listService','$http','$mdDialog',function($scope,listService,$http,$mdDialog){

  $scope.images = listService.images;
  $scope.containers = listService.containers;

  $scope.refresh = function() {
    return reload();
  }


  function reload() {
    return listService.getContainers().then(function(result) {
      $scope.containers = result;
      return listService.getImages();
    }).then(function(result) {
      $scope.images = result;
      return;
    });
  }

  $scope.runContainer = function(container,ev) {
    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Running')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');

    return $http({method:'POST',url:'/api/docker/container/' + container.Id + '/start'}).then(function(resp) {
      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });
    },function(err) {
      console.log(err);
      return;
    });
  }



  $scope.stopContainer = function(container,ev) {
    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Stopping')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');

    return $http({method:'PUT',url:'/api/docker/container/' + container.Id + '/stop'}).then(function(resp) {
      // alert('Stopped');
      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });
    },function(err){
      console.log(err);
      return;
    });
  }

  $scope.createContainer = function(name,ev) {

    var payload = {
      "appName":name.substring(0,name.indexOf(":"))
    }

    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Creating')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');


    return $http({method:'POST',url:'/api/docker/container',data:payload}).then(function(resp){
      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });
    },function(err){
      console.log(err);
      return;
    });
  }

  $scope.deleteContainer = function(container,ev) {
    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Deleteing')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');


    return $http({method:'DELETE',url:'/api/docker/container/' + container.Id}).then(function(resp) {
      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });
    },function(err){
      console.log(err);
      return;
    });
  }

  $scope.deleteImage = function(image,ev) {
    var confirm = $mdDialog.confirm().title('Done')
            .textContent('Deleteing')
            .ariaLabel('ok')
            .targetEvent(ev)
            .ok('Next');

    return $http({method:'DELETE',url:'/api/docker/image/' + image.Id}).then(function(resp) {
      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });
    },function(err){
      console.log(err);
      return;
    });
  }

  $scope.action = function(container,ev) {

    console.log(container.Names[0].substring(1));
    return $http({method:'POST',url:'/api/function?functionName=' + container.Names[0].substring(1)}).then(function(resp) {

      var confirm = $mdDialog.confirm().title('Actioned')
              .textContent(resp.data)
              .ariaLabel('ok')
              .targetEvent(ev)
              .ok('Next');

      $mdDialog.show(confirm).then(function(){
        return reload();
      },function(){
        return reload();
      });

      return;
    },function(err) {
      console.log(err);
      return;
    });
  }

}]);
