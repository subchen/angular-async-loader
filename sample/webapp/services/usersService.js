define(function (require) {
    var app = require('../app');

    app.service('usersService', function () {
        return {
            list: function () {
                return [
                    {
                        name: 'user-1',
                        mail: 'user-1@email.com'
                    }, {
                        name: 'user-2',
                        mail: 'user-2@email.com'
                    }
                ];
            }
        };
    });
});
