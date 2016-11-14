app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        return $q(function(resolve, reject) {
            // check if products JSON has already been cached in sessionStorage
            if (!sessionStorage.getItem('bigcommerce-productList')) {
                // products JSON not in sessionStorage, go fetch data then place in sessionStorage
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
                // retrieve cached products JSON from sessionStorage
                resolve(JSON.parse(sessionStorage.getItem('bigcommerce-productList')));
            }
        });
    };

    return service;
}]);
