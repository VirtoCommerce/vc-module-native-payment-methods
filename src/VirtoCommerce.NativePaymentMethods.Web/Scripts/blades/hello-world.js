angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.helloWorldController', ['$scope', 'NativePaymentMethods.webApi', function ($scope, api) {
        var blade = $scope.blade;
        blade.title = 'NativePaymentMethods';

        blade.refresh = function () {
            api.get(function (data) {
                blade.title = 'NativePaymentMethods.blades.hello-world.title';
                blade.data = data.result;
                blade.isLoading = false;
            });
        };

        blade.refresh();
    }]);
