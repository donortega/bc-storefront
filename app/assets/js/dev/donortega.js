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


app.controller('StoreCtrl', ['$scope', function($scope) {
    'use strict';

    var self = this;

    self.cartCount = 0;

}]);
