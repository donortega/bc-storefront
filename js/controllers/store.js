app.controller('StoreCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'products', function($rootScope, $scope, $timeout, $window, products) {
    'use strict';

    var self = this;

    const CART_EXPIRE = 60; // in minutes

    self.cartCount = 0;
    self.qtyToAdd = 1;

    self.init = function(testing) { // 'testing' is used to determine if we are unit testing (need to force-create a new Cart)
        products.getList().then(function(data) {
            self.productList = data;
        });

        if (!localStorage.getItem('bc-cart') || testing) {
            // cart is empty
            self.cart = [];
        } else if ((JSON.parse(localStorage.getItem('bc-cart')).timestamp + (60000 * CART_EXPIRE)) < (new Date().getTime())) {
            // cart is too old
            self.cart = [];

            console.log('Cart timestamp is too old. Automatically purging Cart data.');
            localStorage.removeItem('bc-cart');
        } else {
            // cart exists
            self.cart = JSON.parse(localStorage.getItem('bc-cart')).cart;
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
            localStorage.setItem('bc-cart', JSON.stringify({
                cart: self.cart,
                timestamp: new Date().getTime()
            }));
        } else {
            // if resulting Cart is empty, just remove it from storage
            localStorage.removeItem('bc-cart');
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
