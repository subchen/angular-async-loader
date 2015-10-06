define(function (require) {
    var app = require('../app');

    require('../services/usersService');

    app.controller('usersCtrl', ['$scope', function ($scope) {
        $scope.userList = app.get('usersService').list();
    }]);

});
