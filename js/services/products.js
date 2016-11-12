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
                    deferred.resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));
                },
                function(response) {
                    // failure
                    console.error('Failed to retrieve JSON:', response);
                }
            );
        } else {
            deferred.resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));
        }

        return deferred.promise;
    };

    return service;
}]);
