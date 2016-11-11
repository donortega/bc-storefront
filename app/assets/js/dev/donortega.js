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
        url: '/product',
        views: {
            nav: {
                templateUrl: 'views/nav.html'
            },
            content: {
                templateUrl: 'views/product.html'
            }
        }
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

    products.getList().then(function(data) {
        console.log('qqq data:', data);
        self.productList = data;
    });

}]);


app.service('products', ['$http', '$q', function($http, $q) {
    'use strict';

    var service = {};

    service.getList = function() {
        var deferred = $q.defer();

        $http.get('/assets/json/products.json').then(
            function(response) {
                // success
                deferred.resolve(response.data);
            },
            function(response) {
                // failure
            }
        );

        return deferred.promise;
    };

    return service;
}]);
