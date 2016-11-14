'use strict';

console.info('Don Ortega --- BigCommerce');

var app = angular.module('bcDonOrtega', ['ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // define application states for routing
    var states = [
        {
            name: 'store',
            url: '/',
            templateUrl: 'views/category.html'
        },
        {
            name: 'category',
            url: '/',
            templateUrl: 'views/category.html'
        },
        {
            name: 'product',
            url: '/product/{productId}',
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
            templateUrl: 'views/cart.html'
        }
    ];

    states.forEach(function(state) {
        $stateProvider.state(state);
    });

    $urlRouterProvider.otherwise('/');

}]);


app.controller('StoreCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'products', function($rootScope, $scope, $timeout, $window, products) {
    'use strict';

    var self = this;

    const CART_EXPIRE = 60; // in minutes

    self.cartCount = 0;
    self.qtyToAdd = 1;

    self.init = function() {
        products.getList().then(function(data) {
            self.productList = data;
        });

        if (!localStorage.getItem('bigcommerce-cart')) {
            // cart is empty
            self.cart = [];
        } else if ((JSON.parse(localStorage.getItem('bigcommerce-cart')).timestamp + (60000 * CART_EXPIRE)) < (new Date().getTime())) {
            // cart is too old
            self.cart = [];

            console.log('Cart timestamp is too old. Automatically purging Cart data.');
            localStorage.removeItem('bigcommerce-cart');
        } else {
            // cart exists
            self.cart = JSON.parse(localStorage.getItem('bigcommerce-cart')).cart;
        }
    };

    self.getProductIndex = function(product) {
        // assuming each product's index in the JSON suffices as a unique product-ID
        return self.productList.findIndex(function(element) {
            return angular.equals(element, product);
        });
    };

    self.qtyDecrease = function() {
        // decrease quantity to add to cart by 1 only if quanty to add is NOT already 1
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
            // adding an item to the cart
            if (index === -1) {
                self.cart.push({
                    product: product,
                    qty: qtyToAdd
                });
            } else {
                self.cart[index].qty = self.cart[index].qty + qtyToAdd;
            }

            // check to see if we need to display the Cart Popup (useful for responsiveness)
            if (triggerCartPopup) {
                $timeout(function() {
                    angular.element( document.getElementById('MyCart') ).triggerHandler('click');
                });
            }
        } else if (action === 'remove') {
            // removing an item from the cart from the Cart Popup
            self.cart.splice(index, 1);
            $event.stopPropagation();
        } else if (action === 'plus1') {
            // adding 1 to quantity from the Cart page
            self.cart[index].qty = self.cart[index].qty + 1;
        } else if (action === 'minus1') {
            // subtracting 1 from the quantity from the Cart page
            if (self.cart[index].qty > 1) {
                self.cart[index].qty = self.cart[index].qty - 1;
            }
        }

        if (self.cart.length) {
            localStorage.setItem('bigcommerce-cart', JSON.stringify({
                cart: self.cart,
                timestamp: new Date().getTime()
            }));
        } else {
            // if resulting Cart is empty, just remove it from storage
            localStorage.removeItem('bigcommerce-cart');
        }
    };

    self.calculateTotal = function() {
        // calculate Total of products in cart
        var total = 0;

        self.cart.forEach(function(item) {
            total = total + (item.product.price * item.qty);
        });

        return total;
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        // when navigating from application state-to-state:
        // * change quantity-to-add back to 1
        // * move the scrollTo position back to the top of the window
        self.qtyToAdd = 1;
        $window.scrollTo(0, 0);
    });

}]);


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
