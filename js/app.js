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
        url: '/product/{productId}',
        views: {
            nav: {
                templateUrl: 'views/nav.html'
            },
            content: {
                templateUrl: 'views/product.html'
                ,
                resolve: {
                    product: function(products, $stateParams) {
                        console.log('qqq $stateParams:', $stateParams, products);
                        products.getList().then(function(data) {
                            console.log('qqq product detail:', data[$stateParams.productId]);
                            return data[$stateParams.productId];
                        });
                    }
                }
                // ,
                // controller: function($scope, product) {
                //     $scope.product = product;
                //     console.log('qqq product:', product);
                // },
                // controllerAs: '$ctrl'
            }
        }
        // ,
        // component: 'product'

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
