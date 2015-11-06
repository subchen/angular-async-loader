[![NPM Repo](https://img.shields.io/npm/v/angular-async-loader.svg)](https://www.npmjs.com/package/angular-async-loader)
[![License](http://img.shields.io/badge/License-Apache_2-red.svg?style=flat)](http://www.apache.org/licenses/LICENSE-2.0)

# angular-async-loader

An async loader for angular 1.x application.

Support following components to dynamic register:

* `.controller`
* `.services`
* `.filter`
* `.directive`
* `.value`
* `.constant`
* `.provider`
* `.decorator`

Support following amd/cmd loaders:

* `Require.js`
* `Sea.js`
* `System.js`

Support `controllerUrl/denpendencies` config in `angular-ui-router` and `angular-route`:

* `$stateProvider.state`
* `$routeProvider.when`


# Installation

NPM

```shell
npm install angular-async-loader
```

BOWER

```shell
bower install https://github.com/subchen/angular-async-loader.git
```

# Usage

See Sample: https://github.com/subchen/angular-async-loader/blob/master/sample/

**index.html**

```html
<script src="assets/requirejs/require.js"></script>
<script src="bootstrap.js"></script>
```

**bootstrap.js**

```js
require.config({
    baseUrl: '/',
    paths: {
        'angular': 'assets/angular/angular.min',
        'angular-ui-router': 'assets/angular-ui-router/release/angular-ui-router.min',
        'angular-async-loader': 'assets/angular-async-loader/dist/angular-async-loader.min'
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-ui-router': {deps: ['angular']}
    }
});

require(['angular', './app-routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});
```

**app.js**

```js
define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');

    var app = angular.module('app', ['ui.router']);

    // initialze app module for async loader
    asyncLoader.configure(app);

    module.exports = app;
});
```

**app-routes.js**

```js
define(function (require) {
    var app = require('./app');

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
            .state('users', app.route({
                url: '/users',
                templateUrl: 'users/users.html',
                // new attribute for ajax load controller
                controllerUrl: 'users/usersCtrl',
                controller: 'usersCtrl',
                // load more controllers, services, filters, ...
                dependencies: ['services/usersService']
            }));
    }]);
});
```

**users/usersCtrl.js**

```js
define(function (require) {
    var app = require('../app');

    // dynamic load services here or add into dependencies of state config
    // require('../services/usersService');

    app.controller('usersCtrl', ['$scope', function ($scope) {
        // shortcut to get angular injected service.
        var userServices = app.get('usersService');

        $scope.userList = usersService.list();
    }]);

});
```

# License

Released under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0).

```
Copyright 2015 Guoqiang Chen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
