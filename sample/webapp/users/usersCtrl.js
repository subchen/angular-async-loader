define(function (require) {
    var app = require('../app');

    // dynamic load services here or add into dependencies of state config
    // require('../services/usersService');

    app.controller('usersCtrl', ['$scope', function ($scope) {
        $scope.userList = app.get('usersService').list();
    }]);

});
