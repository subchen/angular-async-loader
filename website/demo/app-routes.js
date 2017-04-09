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
                 // new attribute for ajax load controller
                controllerUrl: 'home/homeCtrl',
                controller: 'homeCtrl'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/users.html',
                 // new attribute for ajax load controller
                controllerUrl: 'users/usersCtrl',
                controller: 'usersCtrl',
                // load more controllers, services, filters, ...
                dependencies: ['services/usersService']
            })
            .state('components', {
                url: '/components',
                templateUrl: 'components/components.html',
                 // new attribute for ajax load controller
                controllerUrl: 'components/componentsCtrl',
                controller: 'componentsCtrl'
            });
    }]);
});
