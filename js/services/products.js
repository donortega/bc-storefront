app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        var deferred = $q.defer();

        $http.get('/assets/json/products.json').then(
            function(response) {
                // success
                deferred.resolve(response.data);
            },
            function(response) {
                // failure
            }
        );

        return deferred.promise;
    };

    return service;
}]);
