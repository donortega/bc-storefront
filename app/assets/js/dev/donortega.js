'use strict';

console.info('Don Ortega --- BigCommerce');

var app = angular.module('bcDonOrtega', ['ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui.router']);

app.config(['$stateProvider', function ($stateProvider) {
    var categoryState = {
        name: 'category',
        url: '',
        views: {
            nav: {
                templateUrl: 'views/nav.html'
            },
            content: {
                templateUrl: 'views/category.html'
            }
        }
    };

    var productState = {
        name: 'product',
        url: '/product/{productId}',
        views: {
            nav: {
                templateUrl: 'views/nav.html'
            },
            content: {
                templateUrl: 'views/product.html'
                ,
                resolve: {
                    product: function(products, $stateParams) {
                        console.log('qqq $stateParams:', $stateParams, products);
                        products.getList().then(function(data) {
                            console.log('qqq product detail:', data[$stateParams.productId]);
                            return data[$stateParams.productId];
                        });
                    }
                }
                // ,
                // controller: function($scope, product) {
                //     $scope.product = product;
                //     console.log('qqq product:', product);
                // },
                // controllerAs: '$ctrl'
            }
        }
        // ,
        // component: 'product'

    };

    var cartState = {
        name: 'cart',
        url: '/cart',
        views: {
            nav: {
                templateUrl: 'views/nav.html'
            },
            content: {
                templateUrl: 'views/cart.html'
            }
        }
    };

    $stateProvider.state(categoryState);
    $stateProvider.state(productState);
    $stateProvider.state(cartState);
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

    service.getItem = function(productId) {
        var deferred = $q.defer();

        return deferred.promise;
    };

    return service;
}]);
