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
                controllerUrl: 'home/homeCtrl', // new attribute for ajax load controller js
                controller: 'homeCtrl'
            })
            .state('users', app.route({
                url: '/users',
                templateUrl: 'users/users.html',
                controllerUrl: 'users/usersCtrl', // new attribute for ajax load controller js
                controller: 'usersCtrl',

                /* 
                // customize to load dependencies
                resolve: {
                    dummy: app.load([
                        'users/usersCtrl', // controller
                        'services/usersService' // service
                        // filters, directives, ...
                    ])
                }
                */
            }));
    }]);
});
