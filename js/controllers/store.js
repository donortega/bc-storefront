app.controller('StoreCtrl', ['$scope', 'products', function($scope, products) {
    'use strict';

    var self = this;

    self.cartCount = 0;

    products.getList().then(function(data) {
        self.productList = data;
    });

}]);
