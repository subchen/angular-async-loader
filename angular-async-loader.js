/**
 * Load modules and components asynchronously for angular 1.x application.
 *
 * https://github.com/subchen/angular-async-loader
 *
 * subchen@gmail.com
 */
(function() {

    function factory(angular, undefined) {

        var VERSION = '1.3.1';

        // Support require.js, sea.js, system.js
        var amdRequire = (function() {
            if (typeof(require) === 'function') {
                if (typeof(require.async) === 'function') {
                    return require.async;
                } else {
                    return require;
                }
            } else if (typeof(seajs) === 'object' && typeof(seajs.use) === 'function') {
                return seajs.use;
            } else if (typeof(System) === 'object' && typeof(System.amdRequire) === 'function') {
                return System.amdRequire;
            }
            throw new Error('No amd/cmd module loader found.');
        }());

        /**
         * Load external dependencies, such as Controller, Service, etc.
         *
         * @private
         * @param {String|Array} dependencies
         * @returns {*} a promised function to ajax load dependencies
         */
        function resolveDependencies(dependencies) {
            if (typeof(dependencies) === 'string') {
                dependencies = [dependencies];
            }
            return ['$q', function($q) {
                var defer = $q.defer();
                amdRequire(dependencies, function() {
                    defer.resolve(arguments);
                });
                return defer.promise;
            }];
        }

        /**
         * Rewrite route config for $routeProvider.when or $stateProvider.state.
         *
         * Transform 'controllerUrl' and 'dependencies' attrs into resolve object.
         *
         * @private
         * @param {Object} config
         * @returns {Object} the modified config
         */
        function route(config) {

            function rewriteConfig(config) {
                if (config.hasOwnProperty('controllerUrl') || config.hasOwnProperty('dependencies')) {
                    var dependencies = config.dependencies;
                    if (dependencies === undefined) {
                        dependencies = [];
                    } else if (typeof(dependencies) === 'string') {
                        dependencies = [dependencies];
                    }
                    if (config.controllerUrl) {
                        dependencies.push(config.controllerUrl);
                    }
                    delete config.dependencies;
                    delete config.controllerUrl;

                    var resolve = config.resolve || {};
                    resolve['$dummy'] = resolveDependencies(dependencies);
                    config.resolve = resolve;
                }
            }

            // multiple views support
            if (config.hasOwnProperty('views')) {
                Object.keys(config.views).forEach(function(view) {
                    rewriteConfig(config.views[view]);
                });
            } else {
                rewriteConfig(config);
            }

            return config;
        }


        return {
            /**
             * Version of npm package.
             */
            VERSION: VERSION,

            /**
             * Configure angular module instance to support async load components.
             *
             * @param {angular.Module} app
             */
            configure: function(app) {

                app.provider('ngProviders', ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$injector',
                    function($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
                        this.$get = function() {
                            return {
                                $controllerProvider: $controllerProvider,
                                $compileProvider: $compileProvider,
                                $filterProvider: $filterProvider,
                                $provide: $provide,
                                $injector: $injector
                            };
                        };
                    }
                ]);

                app.run(['ngProviders', '$injector', function(ngProviders, $injector) {
                    var $controllerProvider = ngProviders.$controllerProvider;
                    var $compileProvider = ngProviders.$compileProvider;
                    var $filterProvider = ngProviders.$filterProvider;
                    var $provide = ngProviders.$provide;

                    /**
                     * Register an angular module for dependency.
                     *
                     * @param {String} name - module name
                     */
                    app.useModule = function (name) {
                        var module = angular.module(name);

                        if (module.requires) {
                            for (var i = 0; i < module.requires.length; i++) {
                                app.useModule(module.requires[i]);
                            }
                        }
                        angular.forEach(module._invokeQueue, function(args) {
                            var provider = ngProviders[args[0]] || $injector.get(args[0]);
                            provider[args[1]].apply(provider, args[2]);
                        });
                        angular.forEach(module._configBlocks, function(args) {
                            var provider = ngProviders.$injector.get(args[0]);
                            provider[args[1]].apply(provider, args[2]);
                        });
                        angular.forEach(module._runBlocks, function(args) {
                            $injector.invoke(args);
                        });

                        return app;
                    };

                    app.value = function(name, value) {
                        $provide.value(name, value);
                        return app;
                    };

                    app.constant = function(name, value) {
                        $provide.constant(name, value);
                        return app;
                    };

                    app.factory = function(name, factory) {
                        $provide.factory(name, factory);
                        return app;
                    };

                    app.service = function(name, service) {
                        $provide.service(name, service);
                        return app;
                    };

                    app.filter = function(name, filter) {
                        $filterProvider.register(name, filter);
                        return app;
                    };

                    app.directive = function(name, directive) {
                        $compileProvider.directive(name, directive);
                        return app;
                    };

                    app.controller = function(name, controller) {
                        $controllerProvider.register(name, controller);
                        return app;
                    };

                    app.decorator = function(name, decorator) {
                        $provide.decorator(name, decorator);
                        return app;
                    };

                    app.provider = function(name, service) {
                        $provide.provider(name, service);
                        return app;
                    };

                    /**
                     * Get angular injector object by name in module scope.
                     *
                     * @param {String} name
                     * @returns {*} the injected object
                     */
                    app.get = function(name) {
                        return $injector.get(name);
                    };

                }]);

                // rewrite $routeProvider.when
                if (app.requires && app.requires.indexOf('ngRoute') !== -1) {
                    app.config(['$routeProvider', function($routeProvider) {
                        var whenFn = $routeProvider.when;
                        $routeProvider.when = function(path, config) {
                            return whenFn.call($routeProvider, path, route(config));
                        };
                    }]);
                }
                // rewrite $stateProvider.state
                if (app.requires && app.requires.indexOf('ui.router') !== -1) {
                    app.config(['$stateProvider', function($stateProvider) {
                        var stateFn = $stateProvider.state;
                        $stateProvider.state = function(state, config) {
                            return stateFn.call($stateProvider, state, route(config));
                        };
                    }]);
                }
            }
        };
    }

    /**
     * @exports
     */
    if (typeof(define) === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        window.asyncLoader = factory(window.angular);
    }

}());
