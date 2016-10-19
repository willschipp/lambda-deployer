angular.module('lambda').factory('listService',['$http',function($http) {

  var o = {
    images:[],
    containers:[]
  };

  o.getImages = function() {
    return $http({method:'GET',url:'/api/docker/list'}).then(function(resp){
      o.images = [];
      angular.forEach(resp.data,function(val,key) {
        if (val.Labels.FaaS != undefined) {
          o.images.push(val);
        }//end if
      });
      return o.images;
    },function(err) {
      console.log(err);
      return;
    });
  }

  o.getContainers = function() {
    return $http({method:'GET',url:'/api/docker/containers'}).then(function(resp) {
      o.containers = [];
      angular.forEach(resp.data,function(val,key){
        if (val.Labels.FaaS != undefined) {
          o.containers.push(val);
        }//end if
      });
      return o.containers;
    },function(err) {
      console.log(err);
      return;
    });
  }

  return o;

}]);
