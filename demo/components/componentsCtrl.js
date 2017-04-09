define(function (require) {
    var app = require('../app');

    // dynamic load angular-ui-mask plugins for UI
    require('angular-ui-mask');
    app.useModule('ui.mask');

    // dynamic load ng-tags-input plugins for UI
    require('ng-tags-input');
    app.useModule('ngTagsInput');

    // dynamic load ng-file-upload plugins for UI
    require('ng-file-upload');
    app.useModule('ngFileUpload');

    app.controller('componentsCtrl', ['$scope', function ($scope) {
        $scope.name = 'UI Components';

        $scope.countries = [
            { "name": "Algeria", "flag": "Algeria.png", "confederation": "CAF", "rank": 21 },
            { "name": "Argentina", "flag": "Argentina.png", "confederation": "CONMEBOL", "rank": 5 },
            { "name": "Australia", "flag": "Australia.png", "confederation": "AFC", "rank": 32 },
            { "name": "Belgium", "flag": "Belgium.png", "confederation": "UEFA", "rank": 11 },
            { "name": "Bosnia and Herzegovina", "flag": "Bosnia-and-Herzegovina.png", "confederation": "UEFA", "rank": 20 },
            { "name": "Brazil", "flag": "Brazil.png", "confederation": "CONMEBOL", "rank": 3 },
            { "name": "Cameroon", "flag": "Cameroon.png", "confederation": "CAF", "rank": 30 },
            { "name": "Chile", "flag": "Chile.png", "confederation": "CONMEBOL", "rank": 14 },
            { "name": "Colombia", "flag": "Colombia.png", "confederation": "CONMEBOL", "rank": 8 },
            { "name": "Costa Rica", "flag": "Costa-Rica.png", "confederation": "CONCACAF", "rank": 24 },
            { "name": "Croatia", "flag": "Croatia.png", "confederation": "UEFA", "rank": 17 }
        ];
    }]);

});
