angular.module('lambda').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home',{
    url:'/home',
    templateUrl:'/partials/home.html',
    controller:'homeController'
  });

  $stateProvider.state('list',{
    url:'/list',
    templateUrl:'/partials/list.html',
    controller:'listController',
    resolve: {
      postPromise:['listService',function(listService) {
        return listService.getImages().then(function(resp){
          return listService.getContainers();
        },function(err) {
          return err;
        });
      }]
    }
  });

}]);
