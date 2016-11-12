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
