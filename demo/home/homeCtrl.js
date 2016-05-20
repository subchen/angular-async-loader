define(function (require) {
    var app = require('../app');

    app.controller('homeCtrl', ['$scope', function($scope) {
        $scope.name = 'Home';
    }]);
});
