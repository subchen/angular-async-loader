define(function (require) {
    var app = require('./app');

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.html',
                controller: 'homeCtrl',
                resolve: {
                    deps: app.load('./home/homeCtrl')
                }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/users.html',
                controller: 'usersCtrl',
                resolve: {
                    deps: app.load('./users/usersCtrl')
                }
            });
    }]);
});
