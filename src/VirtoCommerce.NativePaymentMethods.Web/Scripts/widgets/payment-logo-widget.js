angular.module('platformWebApp')
    .controller('NativePaymentMethods.paymentLogoWidgetController', ['$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
        var blade = $scope.blade;

        $scope.openBlade = function () {
            var newBlade = {
                id: 'paymentDetailsLogo',
                currentEntity: blade.currentEntity,
                controller: 'NativePaymentMethods.paymentDetailsLogoController',
                template: 'Modules/$(VirtoCommerce.NativePaymentMethods)/Scripts/blades/method-logo.html'
            };

            bladeNavigationService.showBlade(newBlade, blade);
        };
}]);
