app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        var deferred = $q.defer();

        // check if products JSON has already been cached in sessionStorage
        if (!sessionStorage.getItem('bc-productList')) {
            // products JSON not in sessionStorage, go fetch data then place in sessionStorage
            $http.get('/assets/json/products.json').then(
                function(response) {
                    // success
                    sessionStorage.setItem('bc-productList', JSON.stringify(response.data));
                    deferred.resolve(JSON.parse(sessionStorage.getItem('bc-productList')));
                },
                function(response) {
                    // failure
                    console.error('Failed to retrieve JSON:', response);
                    deferred.reject(response);
                }
            );
        } else {
            // retrieve cached products JSON from sessionStorage
            deferred.resolve(JSON.parse(sessionStorage.getItem('bc-productList')));
        }

        return deferred.promise;
    };

    return service;
}]);
