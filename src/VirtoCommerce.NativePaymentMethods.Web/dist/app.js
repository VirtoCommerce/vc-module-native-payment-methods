/******/ (() => { // webpackBootstrap
/******/ 	/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************!*\
  !*** ./Scripts/module.js ***!
  \***************************/
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
                        '$scope', 'platformWebApp.bladeNavigationService', ($scope, bladeNavigationService) => {
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

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./Scripts/blades/method-details.js ***!
  \******************************************/
angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.methodDetailsController', ['$scope', 'NativePaymentMethods.webApi', 'platformWebApp.objCompareService', 'platformWebApp.bladeNavigationService',
        ($scope, api, objCompareService, bladeNavigationService) => {
            var blade = $scope.blade;

            blade.headIcon = 'fa fa-money';

            blade.refresh = () => {
                if (blade.currentEntityId) {
                    api.getById({ id: blade.currentEntityId },
                        (result) => {
                            blade.currentEntity = result;
                            blade.originalEntity = angular.copy(blade.currentEntity);

                            blade.title = result.name;
                        });
                } else {
                    blade.currentEntity = { isEnabled: true }
                    blade.originalEntity = angular.copy(blade.currentEntity);

                    blade.title = "NativePaymentMethods.blades.method-details.labels.new-method";
                }

                blade.isLoading = false;
            };

            $scope.setForm = (form) => {
                blade.formScope = form;
            };

            function canSave() {
                return isDirty() && (!blade.formScope || blade.formScope.$valid);
            }

            function isDirty() {
                return blade.originalEntity && !objCompareService.equal(blade.originalEntity, blade.currentEntity) && !blade.isNew && blade.hasUpdatePermission();
            }

            blade.metaFields = [
                {
                    name: 'name',
                    isRequired: true,
                    isReadOnly: false,
                    title: "NativePaymentMethods.blades.method-details.labels.name",
                    valueType: "ShortText"
                },
                {
                    name: 'code',
                    isRequired: true,
                    isReadOnly: false,
                    title: "NativePaymentMethods.blades.method-details.labels.code",
                    valueType: "ShortText"
                },
                {
                    name: 'isEnabled',
                    title: "NativePaymentMethods.blades.method-details.labels.isEnabled",
                    valueType: "Boolean"
                },
                {
                    name: 'description',
                    title: "NativePaymentMethods.blades.method-details.labels.description",
                    valueType: "LongText"
                }
            ];

            blade.toolbarCommands = [
                {
                    name: "platform.commands.refresh", icon: 'fa fa-refresh',
                    executeMethod: () => { blade.refresh() },
                    canExecuteMethod: () => true
                },
                {
                    name: "platform.commands.save", icon: 'fa fa-save',
                    executeMethod: () => {
                        api.save(blade.currentEntity,
                            (result) => {
                                var listBlade = $scope.$parent.$parent.blades.find(x => x.id === "payment-methods-list");
                                bladeNavigationService.closeBlade(blade);
                                listBlade.refresh();
                            });
                    },
                    canExecuteMethod: canSave
                },
                {
                    name: "platform.commands.reset", icon: 'fa fa-undo',
                    executeMethod: () => {
                        angular.copy(blade.originalEntity, blade.currentEntity);
                    },
                    canExecuteMethod: isDirty,
                    permission: blade.updatePermission
                }
            ];

            blade.refresh();
        }]);

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************!*\
  !*** ./Scripts/blades/method-logo.js ***!
  \***************************************/
angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.paymentDetailsLogoController', ['$scope', 'FileUploader', 'platformWebApp.bladeNavigationService', 'platformWebApp.dialogService',
        ($scope, FileUploader, bladeNavigationService, dialogService) => {
            var blade = $scope.blade;
            blade.title = 'NativePaymentMethods.blades.payment-logo.title';

            if (!$scope.logoUploader) {
                const logoUploader = $scope.logoUploader = new FileUploader({
                    scope: $scope,
                    headers: { Accept: 'application/json' },
                    autoUpload: true,
                    removeAfterUpload: true,
                    filters: [{
                        name: 'imageFilter',
                        fn: (item) => {
                            const approval = /^.*\.(png|jpg|svg)$/.test(item.name);
                            if (!approval) {
                                const dialog = {
                                    title: "Filetype error",
                                    message: "Only PNG, GIF or SVG files are allowed.",
                                }
                                dialogService.showErrorDialog(dialog);
                            }
                            return approval;
                        }
                    }]
                });

                logoUploader.url = 'api/assets?folderUrl=nativepaymentlogos';

                logoUploader.onSuccessItem = (_, uploadedImages) => {
                    blade.currentEntity.logoUrl = uploadedImages[0].url;
                };

                logoUploader.onErrorItem = (element, response, status, _) => {
                    bladeNavigationService.setError(element._file.name + ' failed: ' + (response.message ? response.message : status), blade);
                };
            }

            blade.refresh = () => {
                blade.originalEntity = blade.currentEntity;
                blade.currentEntity = angular.copy(blade.currentEntity);

                blade.isLoading = false;
            };

            let formScope;
            $scope.setForm = (form) => { formScope = form; }

            $scope.browseFiles = (id) => {
                window.document.querySelector(`#${id}`).click()
            }

            function isDirty() {
                return !angular.equals(blade.currentEntity, blade.originalEntity);
            }

            function canSave() {
                return isDirty() && formScope && formScope.$valid;
            }

            blade.saveChanges = () => {
                angular.copy(blade.currentEntity, blade.originalEntity);
                $scope.bladeClose();
            };

            blade.toolbarCommands = [
                {
                    name: "platform.commands.save", icon: 'fas fa-save',
                    executeMethod: blade.saveChanges,
                    canExecuteMethod: canSave
                },
                {
                    name: "platform.commands.set-to-default", icon: 'fa fa-undo',
                    executeMethod: () => {
                        blade.currentEntity.logoUrl = null;
                    },
                    canExecuteMethod: () => true
                }
            ];

            blade.onClose = (closeCallback) => {
                bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, blade.saveChanges, closeCallback,
                    "NativePaymentMethods.dialogs.payment-details-save.title", "NativePaymentMethods.dialogs.payment-details-save.message");
            };

            blade.refresh();
    }]);

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************!*\
  !*** ./Scripts/blades/methods-list.js ***!
  \****************************************/
angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.methodsListController', ['$scope', 'NativePaymentMethods.webApi', 'platformWebApp.bladeNavigationService',
        ($scope, api, bladeNavigationService) => {
            var selectedItems = [];

            var blade = $scope.blade;
            blade.title = 'NativePaymentMethods.blades.methods-list.title';
            blade.headIcon = 'fa fa-money';
            blade.toolbarCommands = [
                {
                    name: "platform.commands.refresh", icon: 'fa fa-refresh',
                    executeMethod: () => { blade.refresh() },
                    canExecuteMethod: () => true
                },
                {
                    name: "platform.commands.add", icon: 'fa fa-plus',
                    executeMethod: () => { showDetailsBlade(null) },
                    canExecuteMethod: () => true
                },
                {
                    name: "platform.commands.delete", icon: 'fa fa-trash',
                    executeMethod: () => {
                        var ids = selectedItems.map(x => x.id);

                        api.delete({ ids: ids }, (result) => {
                            blade.refresh();
                        });
                    },
                    canExecuteMethod: () => selectedItems.length > 0
                }
            ];

            blade.refresh = () => {
                blade.isLoading = true;
                api.get((data) => {
                    blade.data = data.results;
                    blade.selectedAll = false;

                    blade.isLoading = false;
                });
            };

            $scope.updateSelectionList = () => {
                selectedItems = blade.data.filter((item) => item.selected);
            }

            $scope.selectAll = (selected) => {
                angular.forEach(blade.data, (item) => {
                    item.selected = selected;
                });
                $scope.updateSelectionList();
            }

            $scope.selectNode = (node) => {
                $scope.selectedNodeId = node.id;

                showDetailsBlade(node.id);
            }

            function showDetailsBlade (itemId) {
                var detailsBlade = {
                    id: 'payment-method-details',
                    controller: 'NativePaymentMethods.methodDetailsController',
                    template: 'Modules/$(VirtoCommerce.NativePaymentMethods)/Scripts/blades/method-details.tpl.html',
                    currentEntityId: itemId
                };

                bladeNavigationService.showBlade(detailsBlade);
            }

            blade.refresh();
        }]);

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./Scripts/resources/native-payment-methods-api.js ***!
  \*********************************************************/
angular.module('NativePaymentMethods')
    .factory('NativePaymentMethods.webApi', ['$resource', ($resource) => {
        return $resource('api/native-payment-methods', {}, {
            delete: { method: 'DELETE', url: 'api/native-payment-methods' },
            getById: { method: 'GET', url: 'api/native-payment-methods/:id' },
            save: { method: 'POST', url: 'api/native-payment-methods' }
        });
    }]);

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************!*\
  !*** ./Scripts/widgets/payment-logo-widget.js ***!
  \************************************************/
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsbURBQW1EO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7Ozs7Ozs7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsaUJBQWlCO0FBQzVEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7Ozs7Ozs7OztBQzlGVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsNEJBQTRCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0Esa0RBQWtELEdBQUc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7Ozs7Ozs7OztBQ3ZGTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGlCQUFpQjtBQUM1RDtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsMkNBQTJDLHdCQUF3QjtBQUNuRTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFVBQVU7QUFDL0M7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7Ozs7Ozs7OztBQ3ZFVDtBQUNBO0FBQ0EseURBQXlEO0FBQ3pELHNCQUFzQixxREFBcUQ7QUFDM0UsdUJBQXVCLHNEQUFzRDtBQUM3RSxvQkFBb0I7QUFDcEIsU0FBUztBQUNULEtBQUs7Ozs7Ozs7OztBQ1BMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvbW9kdWxlLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL2JsYWRlcy9tZXRob2QtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWxvZ28uanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvYmxhZGVzL21ldGhvZHMtbGlzdC5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9yZXNvdXJjZXMvbmF0aXZlLXBheW1lbnQtbWV0aG9kcy1hcGkuanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvd2lkZ2V0cy9wYXltZW50LWxvZ28td2lkZ2V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENhbGwgdGhpcyB0byByZWdpc3RlciB5b3VyIG1vZHVsZSB0byBtYWluIGFwcGxpY2F0aW9uXHJcbnZhciBtb2R1bGVOYW1lID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzJztcclxuXHJcbmlmIChBcHBEZXBlbmRlbmNpZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgQXBwRGVwZW5kZW5jaWVzLnB1c2gobW9kdWxlTmFtZSk7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtdKVxyXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAgICAgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpID0+IHtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnd29ya3NwYWNlLk5hdGl2ZVBheW1lbnRNZXRob2RzU3RhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL05hdGl2ZVBheW1lbnRNZXRob2RzJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJyQoUGxhdGZvcm0pL1NjcmlwdHMvY29tbW9uL3RlbXBsYXRlcy9ob21lLnRwbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICckc2NvcGUnLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsICgkc2NvcGUsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnQtbWV0aG9kcy1saXN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kc0xpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ01vZHVsZXMvJChWaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzKS9TY3JpcHRzL2JsYWRlcy9tZXRob2RzLWxpc3QudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2luZ0Rpc2FibGVkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUobmV3QmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgXSlcclxuICAgIC5ydW4oWydwbGF0Zm9ybVdlYkFwcC5tYWluTWVudVNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAud2lkZ2V0U2VydmljZScsICckc3RhdGUnLFxyXG4gICAgICAgIChtYWluTWVudVNlcnZpY2UsIHdpZGdldFNlcnZpY2UsICRzdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAvL1JlZ2lzdGVyIG1vZHVsZSBpbiBtYWluIG1lbnVcclxuICAgICAgICAgICAgdmFyIG1lbnVJdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogJ2Jyb3dzZS9OYXRpdmVQYXltZW50TWV0aG9kcycsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEgZmEtbW9uZXknLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZW51LWl0ZW0tbmFtZScsXHJcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogMTAwLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB7ICRzdGF0ZS5nbygnd29ya3NwYWNlLk5hdGl2ZVBheW1lbnRNZXRob2RzU3RhdGUnKTsgfSxcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246ICdOYXRpdmVQYXltZW50TWV0aG9kczphY2Nlc3MnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1haW5NZW51U2VydmljZS5hZGRNZW51SXRlbShtZW51SXRlbSk7XHJcblxyXG4gICAgICAgICAgICAvL1JlZ2lzdGVyIHdpZGdldHNcclxuICAgICAgICAgICAgd2lkZ2V0U2VydmljZS5yZWdpc3RlcldpZGdldCh7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudExvZ29XaWRnZXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvd2lkZ2V0cy9wYXltZW50LWxvZ28td2lkZ2V0Lmh0bWwnXHJcbiAgICAgICAgICAgIH0sICduYXRpdmVQYXltZW50RGV0YWlscycpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZERldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLm9iakNvbXBhcmVTZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgb2JqQ29tcGFyZVNlcnZpY2UsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChibGFkZS5jdXJyZW50RW50aXR5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0QnlJZCh7IGlkOiBibGFkZS5jdXJyZW50RW50aXR5SWQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gcmVzdWx0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0geyBpc0VuYWJsZWQ6IHRydWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZS50aXRsZSA9IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5uZXctbWV0aG9kXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2V0Rm9ybSA9IChmb3JtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5mb3JtU2NvcGUgPSBmb3JtO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc0RpcnR5KCkgJiYgKCFibGFkZS5mb3JtU2NvcGUgfHwgYmxhZGUuZm9ybVNjb3BlLiR2YWxpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxhZGUub3JpZ2luYWxFbnRpdHkgJiYgIW9iakNvbXBhcmVTZXJ2aWNlLmVxdWFsKGJsYWRlLm9yaWdpbmFsRW50aXR5LCBibGFkZS5jdXJyZW50RW50aXR5KSAmJiAhYmxhZGUuaXNOZXcgJiYgYmxhZGUuaGFzVXBkYXRlUGVybWlzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5tZXRhRmllbGRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJTaG9ydFRleHRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29kZScsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlYWRPbmx5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLmNvZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiU2hvcnRUZXh0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2lzRW5hYmxlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5pc0VuYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiQm9vbGVhblwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5kZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJMb25nVGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5zYXZlXCIsIGljb246ICdmYSBmYS1zYXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zYXZlKGJsYWRlLmN1cnJlbnRFbnRpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RCbGFkZSA9ICRzY29wZS4kcGFyZW50LiRwYXJlbnQuYmxhZGVzLmZpbmQoeCA9PiB4LmlkID09PSBcInBheW1lbnQtbWV0aG9kcy1saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UuY2xvc2VCbGFkZShibGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogY2FuU2F2ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnJlc2V0XCIsIGljb246ICdmYSBmYS11bmRvJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShibGFkZS5vcmlnaW5hbEVudGl0eSwgYmxhZGUuY3VycmVudEVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBpc0RpcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IGJsYWRlLnVwZGF0ZVBlcm1pc3Npb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudERldGFpbHNMb2dvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZpbGVVcGxvYWRlcicsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLmRpYWxvZ1NlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIEZpbGVVcGxvYWRlciwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSwgZGlhbG9nU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcbiAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5wYXltZW50LWxvZ28udGl0bGUnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc2NvcGUubG9nb1VwbG9hZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2dvVXBsb2FkZXIgPSAkc2NvcGUubG9nb1VwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b1VwbG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVBZnRlclVwbG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaW1hZ2VGaWx0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbjogKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcHJvdmFsID0gL14uKlxcLihwbmd8anBnfHN2ZykkLy50ZXN0KGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFwcHJvdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlhbG9nID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaWxldHlwZSBlcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk9ubHkgUE5HLCBHSUYgb3IgU1ZHIGZpbGVzIGFyZSBhbGxvd2VkLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dTZXJ2aWNlLnNob3dFcnJvckRpYWxvZyhkaWFsb2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcHJvdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZ29VcGxvYWRlci51cmwgPSAnYXBpL2Fzc2V0cz9mb2xkZXJVcmw9bmF0aXZlcGF5bWVudGxvZ29zJztcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dvVXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IChfLCB1cGxvYWRlZEltYWdlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkubG9nb1VybCA9IHVwbG9hZGVkSW1hZ2VzWzBdLnVybDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nb1VwbG9hZGVyLm9uRXJyb3JJdGVtID0gKGVsZW1lbnQsIHJlc3BvbnNlLCBzdGF0dXMsIF8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNldEVycm9yKGVsZW1lbnQuX2ZpbGUubmFtZSArICcgZmFpbGVkOiAnICsgKHJlc3BvbnNlLm1lc3NhZ2UgPyByZXNwb25zZS5tZXNzYWdlIDogc3RhdHVzKSwgYmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYmxhZGUuY3VycmVudEVudGl0eTtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgZm9ybVNjb3BlO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2V0Rm9ybSA9IChmb3JtKSA9PiB7IGZvcm1TY29wZSA9IGZvcm07IH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5icm93c2VGaWxlcyA9IChpZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApLmNsaWNrKClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoYmxhZGUuY3VycmVudEVudGl0eSwgYmxhZGUub3JpZ2luYWxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5TYXZlKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRGlydHkoKSAmJiBmb3JtU2NvcGUgJiYgZm9ybVNjb3BlLiR2YWxpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUuc2F2ZUNoYW5nZXMgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSwgYmxhZGUub3JpZ2luYWxFbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJsYWRlQ2xvc2UoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnRvb2xiYXJDb21tYW5kcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnNhdmVcIiwgaWNvbjogJ2ZhcyBmYS1zYXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiBibGFkZS5zYXZlQ2hhbmdlcyxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBjYW5TYXZlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuc2V0LXRvLWRlZmF1bHRcIiwgaWNvbjogJ2ZhIGZhLXVuZG8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eS5sb2dvVXJsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLm9uQ2xvc2UgPSAoY2xvc2VDYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93Q29uZmlybWF0aW9uSWZOZWVkZWQoaXNEaXJ0eSgpLCBjYW5TYXZlKCksIGJsYWRlLCBibGFkZS5zYXZlQ2hhbmdlcywgY2xvc2VDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgICAgICBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmRpYWxvZ3MucGF5bWVudC1kZXRhaWxzLXNhdmUudGl0bGVcIiwgXCJOYXRpdmVQYXltZW50TWV0aG9kcy5kaWFsb2dzLnBheW1lbnQtZGV0YWlscy1zYXZlLm1lc3NhZ2VcIik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kc0xpc3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG4gICAgICAgICAgICBibGFkZS50aXRsZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kcy1saXN0LnRpdGxlJztcclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5hZGRcIiwgaWNvbjogJ2ZhIGZhLXBsdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgc2hvd0RldGFpbHNCbGFkZShudWxsKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5kZWxldGVcIiwgaWNvbjogJ2ZhIGZhLXRyYXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHMgPSBzZWxlY3RlZEl0ZW1zLm1hcCh4ID0+IHguaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmRlbGV0ZSh7IGlkczogaWRzIH0sIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYXBpLmdldCgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmRhdGEgPSBkYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuc2VsZWN0ZWRBbGwgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTZWxlY3Rpb25MaXN0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IGJsYWRlLmRhdGEuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdEFsbCA9IChzZWxlY3RlZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGJsYWRlLmRhdGEsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Tm9kZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWROb2RlSWQgPSBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIHNob3dEZXRhaWxzQmxhZGUobm9kZS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dEZXRhaWxzQmxhZGUgKGl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRldGFpbHNCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnQtbWV0aG9kLWRldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2REZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWRldGFpbHMudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHlJZDogaXRlbUlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKGRldGFpbHNCbGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuZmFjdG9yeSgnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgWyckcmVzb3VyY2UnLCAoJHJlc291cmNlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnLCB7fSwge1xyXG4gICAgICAgICAgICBkZWxldGU6IHsgbWV0aG9kOiAnREVMRVRFJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnIH0sXHJcbiAgICAgICAgICAgIGdldEJ5SWQ6IHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMvOmlkJyB9LFxyXG4gICAgICAgICAgICBzYXZlOiB7IG1ldGhvZDogJ1BPU1QnLCB1cmw6ICdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcycgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncGxhdGZvcm1XZWJBcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLnBheW1lbnRMb2dvV2lkZ2V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG5cclxuICAgICAgICAkc2NvcGUub3BlbkJsYWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnREZXRhaWxzTG9nbycsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RW50aXR5OiBibGFkZS5jdXJyZW50RW50aXR5LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdGl2ZVBheW1lbnRNZXRob2RzLnBheW1lbnREZXRhaWxzTG9nb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWxvZ28uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKG5ld0JsYWRlLCBibGFkZSk7XHJcbiAgICAgICAgfTtcclxufV0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=