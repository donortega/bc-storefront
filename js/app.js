'use strict';

console.info('Don Ortega --- BigCommerce');

var app = angular.module('bcDonOrtega', ['ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    var states = [
        {
            name: 'store',
            url: '/',
            templateUrl: 'views/category.html'
        },
        {
            name: 'category',
            url: '/',
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

    $urlRouterProvider.otherwise('/');

}]);
