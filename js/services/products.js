app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        return $q(function(resolve, reject) {
            if (!sessionStorage.getItem('bigcommerce-productList')) {
                $http.get('/assets/json/products.json').then(
                    function(response) {
                        // success
                        sessionStorage.setItem('bigcommerce-productList', JSON.stringify(response.data));
                        resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));
                    },
                    function(response) {
                        // failure
                        console.error('Failed to retrieve JSON:', response);
                        reject(response);
                    }
                );
            } else {
                resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));
            }
        });
    };

    return service;
}]);
