app.controller('StoreCtrl', ['$scope', 'products', function($scope, products) {
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

    self.qtyDecrease = function() {
        if (self.qtyToAdd > 1) {
            self.qtyToAdd--;
        }
    };

    self.addCart = function(product, qtyToAdd) {
        // { product, qtyToAdd }
        var index = self.cart.findIndex(function(element) {
            return angular.equals(element.product, product);
        });

        if (index === -1) {
            self.cart.push({
                product: product,
                qty: qtyToAdd
            });
        } else {
            self.cart[index].qty = self.cart[index].qty + qtyToAdd;
        }

        sessionStorage.setItem('bigcommerce-cart', JSON.stringify(self.cart));
    };

}]);
