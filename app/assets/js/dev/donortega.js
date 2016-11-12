'use strict';

console.info('Don Ortega --- BigCommerce');

var app = angular.module('bcDonOrtega', ['ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui.router']);

app.config(['$stateProvider', function ($stateProvider) {
    var states = [
        {
            name: 'store',
            url: '',
            templateUrl: 'views/category.html'
        },
        {
            name: 'category',
            url: '',
            // parent: 'store',
            templateUrl: 'views/category.html'
        },
        {
            name: 'product',
            url: '/product/{productId}',
            // parent: 'store',
            templateUrl: 'views/product.html',
            resolve: {
                product: function(products, $stateParams) {
                    return products.getList().then(function(data) {
                        return data[$stateParams.productId];
                    });
                }
            },
            controller: function($scope, product) {
                $scope.product = product;
            }
        },
        {
            name: 'cart',
            url: '/cart',
            // parent: 'store',
            templateUrl: 'views/cart.html'
        }
    ];

    states.forEach(function(state) {
        $stateProvider.state(state);
    });

}]);


app.controller('StoreCtrl', ['$scope', 'products', function($scope, products) {
    'use strict';

    var self = this;

    self.cartCount = 0;
    self.qtyToAdd = 1;

    products.getList().then(function(data) {
        self.productList = data;
    });

    self.qtyDecrease = function() {
        if (self.qtyToAdd > 1) {
            self.qtyToAdd--;
        }
    };

}]);


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

    return service;
}]);
