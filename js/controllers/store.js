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
