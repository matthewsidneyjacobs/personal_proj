angular.module('app', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('','/')
    .otherwise('/')


    $stateProvider
    .state('home', {
      templateUrl: 'views/home.html',
      url: '/'
    })
    .state('about', {
      templateUrl: 'views/about.html',
      url: '/about'
    })






})
