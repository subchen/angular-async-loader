/**
 * async loader for angular 1.x.
 *
 * https://github.com/subchen/angular-async-loader
 * subchen@gmail.com
 */
(function () {

    function factory(angular, undefined) {

        return {
            VERSION: '1.0.0',

            configure: function (app) {

                // Support require.js, sea.js, system.js
                if (app.require === undefined) {
                    if (typeof(require) === 'function') {
                        if (typeof(require.async) === 'function') {
                            app.require = require.async;
                        } else {
                            app.require = require;
                        }
                    } else if (typeof(seajs) === 'object' && typeof (seajs.use) === 'function') {
                        app.require = seajs.use;
                    } else if (typeof(System) === 'object' && typeof (System.import) === 'function') {
                        app.require = System.import;
                    }
                }

                app.provider('$asyncLoader', [
                    '$controllerProvider',
                    '$compileProvider',
                    '$provide',
                    '$filterProvider',
                    function ($controllerProvider,
                              $compileProvider,
                              $provide,
                              $filterProvider) {
                        this.$get = function () {
                            return {
                                $controllerProvider: $controllerProvider,
                                $compileProvider: $compileProvider,
                                $provide: $provide,
                                $filterProvider: $filterProvider
                            };
                        };
                    }]);

                app.run(['$asyncLoader', function ($asyncLoader) {
                    var $controllerProvider = $asyncLoader.$controllerProvider;
                    var $compileProvider = $asyncLoader.$compileProvider;
                    var $provide = $asyncLoader.$provide;
                    var $filterProvider = $asyncLoader.$filterProvider;

                    app.value = function (name, value) {
                        $provide.value.apply(null, [name, value]);
                    };

                    app.constant = function (name, value) {
                        $provide.value.apply(null, [name, value]);
                    };

                    app.factory = function (name, factory) {
                        $provide.factory.apply(null, [name, factory]);
                    };

                    app.service = function (name, service) {
                        $provide.service.apply(null, [name, service]);
                    };

                    app.filter = function (name, filter) {
                        $filterProvider.register.apply(null, [name, filter]);
                    };

                    app.directive = function (name, directive) {
                        $compileProvider.directive.apply(null, [name, directive]);
                    };

                    app.controller = function (name, controller) {
                        $controllerProvider.register.apply(null, [name, controller]);
                    };

                    app.decorator = function (name, decorator) {
                        $provide.decorator.apply(null, [name, decorator]);
                    };

                    app.provider = function (name, service) {
                        $provide.provider.apply(null, [name, service]);
                    };
                }]);


                /**
                 * Load external resources, such as Controller, Service, etc.
                 *
                 * @param {String|Array} dependencies
                 * @returns {*}
                 */
                app.load = function (dependencies) {
                    if (!angular.isArray(dependencies)) {
                        dependencies = [dependencies];
                    }

                    return ['$q', '$rootScope', function ($q, $rootScope) {
                        var defer = $q.defer();
                        app.require(dependencies, function () {
                            var out = arguments[arguments.length - 1];
                            defer.resolve(out);
                            $rootScope.$apply();
                        });
                        return defer.promise;
                    }];
                };


                var injector;

                /**
                 * Get angular injector object by name.
                 *
                 * @param {String} name
                 * @returns {*}
                 */
                app.get = function (name) {
                    if (injector === undefined) {
                        var elements = [app.element, document, 'html', 'body'];
                        for (var i = 0; i < elements.length; i++) {
                            injector = angular.element(elements[i]).injector();
                            if (injector !== undefined) {
                                break;
                            }
                        }
                    }
                    return injector.get(name);
                };

            }
        };
    }

    /**
     * @exports
     */
    if (typeof(define) === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        window.asyncLoader = factory(window.angular);
    }

}());
