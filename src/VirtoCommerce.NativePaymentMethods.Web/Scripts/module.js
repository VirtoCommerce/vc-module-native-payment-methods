// Call this to register your module to main application
var moduleName = 'NativePaymentMethods';

if (AppDependencies !== undefined) {
    AppDependencies.push(moduleName);
}

angular.module(moduleName, [])
    .config(['$stateProvider', '$urlRouterProvider',
        ($stateProvider, $urlRouterProvider) => {
            $stateProvider
                .state('workspace.NativePaymentMethodsState', {
                    url: '/NativePaymentMethods',
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        '$scope', 'platformWebApp.bladeNavigationService', function($scope, bladeNavigationService) {
                            var newBlade = {
                                id: 'payment-methods-list',
                                controller: 'NativePaymentMethods.methodsListController',
                                template: 'Modules/$(VirtoCommerce.NativePaymentMethods)/Scripts/blades/methods-list.tpl.html',
                                isClosingDisabled: true
                            };
                            bladeNavigationService.showBlade(newBlade);
                        }
                    ]
                });
        }
    ])
    .run(['platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state',
        (mainMenuService, widgetService, $state) => {
            //Register module in main menu
            var menuItem = {
                path: 'browse/NativePaymentMethods',
                icon: 'fa fa-money',
                title: 'NativePaymentMethods.menu-item-name',
                priority: 100,
                action: () => { $state.go('workspace.NativePaymentMethodsState'); },
                permission: 'NativePaymentMethods:access'
            };
            mainMenuService.addMenuItem(menuItem);

            //Register widgets
            widgetService.registerWidget({
                controller: 'NativePaymentMethods.paymentLogoWidgetController',
                template: 'Modules/$(VirtoCommerce.NativePaymentMethods)/Scripts/widgets/payment-logo-widget.html'
            }, 'nativePaymentDetails');
        }
    ]);
