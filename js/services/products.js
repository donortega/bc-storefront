app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        var deferred = $q.defer();

        if (!sessionStorage.getItem('bigcommerce-productList')) {
            $http.get('/assets/json/products.json').then(
                function(response) {
                    // success
                    sessionStorage.setItem('bigcommerce-productList', JSON.stringify(response.data));
                },
                function(response) {
                    // failure
                }
            );
        }

        deferred.resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));

        return deferred.promise;
    };

    service.getItem = function(productId) {
        var deferred = $q.defer();

        return deferred.promise;
    };

    return service;
}]);
