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


app.controller('StoreCtrl', ['$scope', '$timeout', 'products', function($scope, $timeout, products) {
    'use strict';

    var self = this;

    self.cartCount = 0;
    self.qtyToAdd = 1;

    if (!sessionStorage.getItem('bigcommerce-cart')) {
        self.cart = [];
    } else {
        self.cart = JSON.parse(sessionStorage.getItem('bigcommerce-cart'));
    }

    products.getList().then(function(data) {
        self.productList = data;
    });

    self.getProductIndex = function(product) {
        return self.productList.findIndex(function(element) {
            return angular.equals(element, product);
        });
    };

    self.qtyDecrease = function() {
        if (self.qtyToAdd > 1) {
            self.qtyToAdd--;
        }
    };

    self.changeCart = function(action, product, qtyToAdd, triggerCartPopup, $event) {
        // { product, qtyToAdd }
        var index = self.cart.findIndex(function(element) {
            return angular.equals(element.product, product);
        });

        if (action === 'add') {
            if (index === -1) {
                self.cart.push({
                    product: product,
                    qty: qtyToAdd
                });
            } else {
                self.cart[index].qty = self.cart[index].qty + qtyToAdd;
            }

            if (triggerCartPopup) {
                $timeout(function() {
                    angular.element( document.getElementById('MyCart') ).triggerHandler('click');
                });
            }
        } else if (action === 'remove') {
            self.cart.splice(index, 1);
            $event.stopPropagation();
        }

        sessionStorage.setItem('bigcommerce-cart', JSON.stringify(self.cart));
    };

    self.calculateTotal = function() {
        var total = 0;

        self.cart.forEach(function(item) {
            total = total + (item.product.price * item.qty);
        });

        return total;
    };

}]);


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
