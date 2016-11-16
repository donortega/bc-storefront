describe('Don Ortega --- BigCommerce TEST', function() {
    beforeEach(module('ngAnimate'));
    beforeEach(module('ngTouch'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('ui.router'));
    beforeEach(module('bcDonOrtega'));

    var $controller;
    var controller;

    var sampleProduct = {
        "title": "Blue Stripe Stoneware Plate",
        "brand": "Kiriko",
        "price": 40,
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at purus pulvinar, placerat turpis ac, interdum metus. In eget massa sed enim hendrerit auctor a eget.",
        "image": "blue-stripe-stoneware-plate.jpg"
    };

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('Store controller', function() {
        var $scope;
        var controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('StoreCtrl as ctrl', { $scope: $scope });
        });

        it('quantity-to-add should decrease by 1', function() {
            $scope.ctrl.qtyToAdd = 5;
            $scope.ctrl.qtyDecrease();
            expect($scope.ctrl.qtyToAdd).toBe(4);
        });

        it('add a new product to cart', function() {
            $scope.ctrl.init(true);
            $scope.ctrl.changeCart('add', sampleProduct, 1);
            expect($scope.ctrl.cart[0].product).toBe(sampleProduct);
            expect($scope.ctrl.cart[0].qty).toBe(1);
        });

        it('remove a product from the cart', function() {
            var $event = {
                stopPropagation: function() {
                    // do nothing for testing purposes
                }
            };

            $scope.ctrl.init(true);
            $scope.ctrl.changeCart('add', sampleProduct, 1);
            $scope.ctrl.changeCart('remove', sampleProduct, '', '', $event);
            expect($scope.ctrl.cart[0]).toBeUndefined();
        });

        it('incrementing quantity from Cart page', function() {
            $scope.ctrl.init(true);
            $scope.ctrl.changeCart('add', sampleProduct, 1);
            $scope.ctrl.changeCart('plus1', sampleProduct);
            expect($scope.ctrl.cart[0].product).toBe(sampleProduct);
            expect($scope.ctrl.cart[0].qty).toBe(2);
        });

        it('decrementing quantity from Cart page', function() {
            $scope.ctrl.init(true);
            $scope.ctrl.changeCart('add', sampleProduct, 3);
            $scope.ctrl.changeCart('minus1', sampleProduct);
            expect($scope.ctrl.cart[0].product).toBe(sampleProduct);
            expect($scope.ctrl.cart[0].qty).toBe(2);
        });

        it('calculate amounts from Cart', function() {
            var qty = 3;

            $scope.ctrl.init(true);
            $scope.ctrl.changeCart('add', sampleProduct, qty);
            expect($scope.ctrl.calculateTotal()).toBe(sampleProduct.price * qty);
        });
    });

    describe('Products service', function() {
        var $scope;
        var controller;
        var products;
        var $q;
        var deferred;

        beforeEach(inject(function($controller, _$q_, _products_) {
            $scope = {};
            controller = $controller('StoreCtrl as ctrl', { $scope: $scope });
            products = _products_;

            $q = _$q_;
            deferred = _$q_.defer();

            spyOn(products, 'getList').and.returnValue(deferred.promise);
        }));

        it('retrieves the products JSON', function() {
            $scope.ctrl.init();
            expect(products.getList).toHaveBeenCalled();
        });
    });
});
