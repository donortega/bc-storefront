app.controller('StoreCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'products', function($rootScope, $scope, $timeout, $window, products) {
    'use strict';

    var self = this;

    self.cartCount = 0;
    self.qtyToAdd = 1;

    if (!localStorage.getItem('bigcommerce-cart')) {
        self.cart = [];
    } else if ((localStorage.getItem('bigcommerce-cart').timestamp + (3.6e6)) < (new Date().getTime())) {
        self.cart = [];

        localStorage.removeItem('bigcommerce-cart');
    } else {
        self.cart = JSON.parse(localStorage.getItem('bigcommerce-cart')).cart;
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

        localStorage.setItem('bigcommerce-cart', JSON.stringify({
            cart: self.cart,
            timestamp: new Date().getTime()
        }));
    };

    self.calculateTotal = function() {
        var total = 0;

        self.cart.forEach(function(item) {
            total = total + (item.product.price * item.qty);
        });

        return total;
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        self.qtyToAdd = 1;
        $window.scrollTo(0, 0);
    });

}]);
