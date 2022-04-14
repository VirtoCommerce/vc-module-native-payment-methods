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
                    name: 'code',
                    isRequired: true,
                    isReadOnly: blade.currentEntityId,
                    title: "NativePaymentMethods.blades.method-details.labels.code",
                    valueType: "ShortText"
                },
                {
                    name: 'name',
                    isRequired: true,
                    isReadOnly: false,
                    title: "NativePaymentMethods.blades.method-details.labels.name",
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
                                    message: "Only PNG, JPG or SVG files are allowed.",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsbURBQW1EO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7Ozs7Ozs7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywyQkFBMkI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsaUJBQWlCO0FBQzVEO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7Ozs7Ozs7OztBQzlGVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsNEJBQTRCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0Esa0RBQWtELEdBQUc7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7Ozs7Ozs7OztBQ3ZGTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGlCQUFpQjtBQUM1RDtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsMkNBQTJDLHdCQUF3QjtBQUNuRTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFVBQVU7QUFDL0M7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7Ozs7Ozs7OztBQ3ZFVDtBQUNBO0FBQ0EseURBQXlEO0FBQ3pELHNCQUFzQixxREFBcUQ7QUFDM0UsdUJBQXVCLHNEQUFzRDtBQUM3RSxvQkFBb0I7QUFDcEIsU0FBUztBQUNULEtBQUs7Ozs7Ozs7OztBQ1BMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvbW9kdWxlLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL2JsYWRlcy9tZXRob2QtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWxvZ28uanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvYmxhZGVzL21ldGhvZHMtbGlzdC5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9yZXNvdXJjZXMvbmF0aXZlLXBheW1lbnQtbWV0aG9kcy1hcGkuanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvd2lkZ2V0cy9wYXltZW50LWxvZ28td2lkZ2V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENhbGwgdGhpcyB0byByZWdpc3RlciB5b3VyIG1vZHVsZSB0byBtYWluIGFwcGxpY2F0aW9uXHJcbnZhciBtb2R1bGVOYW1lID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzJztcclxuXHJcbmlmIChBcHBEZXBlbmRlbmNpZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgQXBwRGVwZW5kZW5jaWVzLnB1c2gobW9kdWxlTmFtZSk7XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtdKVxyXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAgICAgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpID0+IHtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnd29ya3NwYWNlLk5hdGl2ZVBheW1lbnRNZXRob2RzU3RhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL05hdGl2ZVBheW1lbnRNZXRob2RzJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJyQoUGxhdGZvcm0pL1NjcmlwdHMvY29tbW9uL3RlbXBsYXRlcy9ob21lLnRwbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICckc2NvcGUnLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsICgkc2NvcGUsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnQtbWV0aG9kcy1saXN0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kc0xpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ01vZHVsZXMvJChWaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzKS9TY3JpcHRzL2JsYWRlcy9tZXRob2RzLWxpc3QudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvc2luZ0Rpc2FibGVkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUobmV3QmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgXSlcclxuICAgIC5ydW4oWydwbGF0Zm9ybVdlYkFwcC5tYWluTWVudVNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAud2lkZ2V0U2VydmljZScsICckc3RhdGUnLFxyXG4gICAgICAgIChtYWluTWVudVNlcnZpY2UsIHdpZGdldFNlcnZpY2UsICRzdGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAvL1JlZ2lzdGVyIG1vZHVsZSBpbiBtYWluIG1lbnVcclxuICAgICAgICAgICAgdmFyIG1lbnVJdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgcGF0aDogJ2Jyb3dzZS9OYXRpdmVQYXltZW50TWV0aG9kcycsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEgZmEtbW9uZXknLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZW51LWl0ZW0tbmFtZScsXHJcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogMTAwLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAoKSA9PiB7ICRzdGF0ZS5nbygnd29ya3NwYWNlLk5hdGl2ZVBheW1lbnRNZXRob2RzU3RhdGUnKTsgfSxcclxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246ICdOYXRpdmVQYXltZW50TWV0aG9kczphY2Nlc3MnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1haW5NZW51U2VydmljZS5hZGRNZW51SXRlbShtZW51SXRlbSk7XHJcblxyXG4gICAgICAgICAgICAvL1JlZ2lzdGVyIHdpZGdldHNcclxuICAgICAgICAgICAgd2lkZ2V0U2VydmljZS5yZWdpc3RlcldpZGdldCh7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudExvZ29XaWRnZXRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvd2lkZ2V0cy9wYXltZW50LWxvZ28td2lkZ2V0Lmh0bWwnXHJcbiAgICAgICAgICAgIH0sICduYXRpdmVQYXltZW50RGV0YWlscycpO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZERldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLm9iakNvbXBhcmVTZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgb2JqQ29tcGFyZVNlcnZpY2UsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChibGFkZS5jdXJyZW50RW50aXR5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0QnlJZCh7IGlkOiBibGFkZS5jdXJyZW50RW50aXR5SWQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gcmVzdWx0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0geyBpc0VuYWJsZWQ6IHRydWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZS50aXRsZSA9IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5uZXctbWV0aG9kXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2V0Rm9ybSA9IChmb3JtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5mb3JtU2NvcGUgPSBmb3JtO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc0RpcnR5KCkgJiYgKCFibGFkZS5mb3JtU2NvcGUgfHwgYmxhZGUuZm9ybVNjb3BlLiR2YWxpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxhZGUub3JpZ2luYWxFbnRpdHkgJiYgIW9iakNvbXBhcmVTZXJ2aWNlLmVxdWFsKGJsYWRlLm9yaWdpbmFsRW50aXR5LCBibGFkZS5jdXJyZW50RW50aXR5KSAmJiAhYmxhZGUuaXNOZXcgJiYgYmxhZGUuaGFzVXBkYXRlUGVybWlzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5tZXRhRmllbGRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb2RlJyxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk6IGJsYWRlLmN1cnJlbnRFbnRpdHlJZCxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLmNvZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiU2hvcnRUZXh0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ25hbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZWFkT25seTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiBcIlNob3J0VGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdpc0VuYWJsZWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMuaXNFbmFibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiBcIkJvb2xlYW5cIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZGVzY3JpcHRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMuZGVzY3JpcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiTG9uZ1RleHRcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUudG9vbGJhckNvbW1hbmRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMucmVmcmVzaFwiLCBpY29uOiAnZmEgZmEtcmVmcmVzaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4geyBibGFkZS5yZWZyZXNoKCkgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuc2F2ZVwiLCBpY29uOiAnZmEgZmEtc2F2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuc2F2ZShibGFkZS5jdXJyZW50RW50aXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaXN0QmxhZGUgPSAkc2NvcGUuJHBhcmVudC4kcGFyZW50LmJsYWRlcy5maW5kKHggPT4geC5pZCA9PT0gXCJwYXltZW50LW1ldGhvZHMtbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLmNsb3NlQmxhZGUoYmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RCbGFkZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGNhblNhdmVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZXNldFwiLCBpY29uOiAnZmEgZmEtdW5kbycsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkoYmxhZGUub3JpZ2luYWxFbnRpdHksIGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogaXNEaXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBibGFkZS51cGRhdGVQZXJtaXNzaW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLnBheW1lbnREZXRhaWxzTG9nb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdGaWxlVXBsb2FkZXInLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC5kaWFsb2dTZXJ2aWNlJyxcclxuICAgICAgICAoJHNjb3BlLCBGaWxlVXBsb2FkZXIsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UsIGRpYWxvZ1NlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG4gICAgICAgICAgICBibGFkZS50aXRsZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMucGF5bWVudC1sb2dvLnRpdGxlJztcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNjb3BlLmxvZ29VcGxvYWRlcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9nb1VwbG9hZGVyID0gJHNjb3BlLmxvZ29VcGxvYWRlciA9IG5ldyBGaWxlVXBsb2FkZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9VcGxvYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyczogW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ltYWdlRmlsdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm46IChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHByb3ZhbCA9IC9eLipcXC4ocG5nfGpwZ3xzdmcpJC8udGVzdChpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhcHByb3ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpYWxvZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRmlsZXR5cGUgZXJyb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJPbmx5IFBORywgSlBHIG9yIFNWRyBmaWxlcyBhcmUgYWxsb3dlZC5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nU2VydmljZS5zaG93RXJyb3JEaWFsb2coZGlhbG9nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHByb3ZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dvVXBsb2FkZXIudXJsID0gJ2FwaS9hc3NldHM/Zm9sZGVyVXJsPW5hdGl2ZXBheW1lbnRsb2dvcyc7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nb1VwbG9hZGVyLm9uU3VjY2Vzc0l0ZW0gPSAoXywgdXBsb2FkZWRJbWFnZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5LmxvZ29VcmwgPSB1cGxvYWRlZEltYWdlc1swXS51cmw7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZ29VcGxvYWRlci5vbkVycm9ySXRlbSA9IChlbGVtZW50LCByZXNwb25zZSwgc3RhdHVzLCBfKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zZXRFcnJvcihlbGVtZW50Ll9maWxlLm5hbWUgKyAnIGZhaWxlZDogJyArIChyZXNwb25zZS5tZXNzYWdlID8gcmVzcG9uc2UubWVzc2FnZSA6IHN0YXR1cyksIGJsYWRlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5vcmlnaW5hbEVudGl0eSA9IGJsYWRlLmN1cnJlbnRFbnRpdHk7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IGZvcm1TY29wZTtcclxuICAgICAgICAgICAgJHNjb3BlLnNldEZvcm0gPSAoZm9ybSkgPT4geyBmb3JtU2NvcGUgPSBmb3JtOyB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYnJvd3NlRmlsZXMgPSAoaWQpID0+IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKS5jbGljaygpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIWFuZ3VsYXIuZXF1YWxzKGJsYWRlLmN1cnJlbnRFbnRpdHksIGJsYWRlLm9yaWdpbmFsRW50aXR5KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc0RpcnR5KCkgJiYgZm9ybVNjb3BlICYmIGZvcm1TY29wZS4kdmFsaWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnNhdmVDaGFuZ2VzID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHksIGJsYWRlLm9yaWdpbmFsRW50aXR5KTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ibGFkZUNsb3NlKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5zYXZlXCIsIGljb246ICdmYXMgZmEtc2F2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogYmxhZGUuc2F2ZUNoYW5nZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogY2FuU2F2ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnNldC10by1kZWZhdWx0XCIsIGljb246ICdmYSBmYS11bmRvJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkubG9nb1VybCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS5vbkNsb3NlID0gKGNsb3NlQ2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0NvbmZpcm1hdGlvbklmTmVlZGVkKGlzRGlydHkoKSwgY2FuU2F2ZSgpLCBibGFkZSwgYmxhZGUuc2F2ZUNoYW5nZXMsIGNsb3NlQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgXCJOYXRpdmVQYXltZW50TWV0aG9kcy5kaWFsb2dzLnBheW1lbnQtZGV0YWlscy1zYXZlLnRpdGxlXCIsIFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuZGlhbG9ncy5wYXltZW50LWRldGFpbHMtc2F2ZS5tZXNzYWdlXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZHNMaXN0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ05hdGl2ZVBheW1lbnRNZXRob2RzLndlYkFwaScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJyxcclxuICAgICAgICAoJHNjb3BlLCBhcGksIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkSXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBibGFkZSA9ICRzY29wZS5ibGFkZTtcclxuICAgICAgICAgICAgYmxhZGUudGl0bGUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZHMtbGlzdC50aXRsZSc7XHJcbiAgICAgICAgICAgIGJsYWRlLmhlYWRJY29uID0gJ2ZhIGZhLW1vbmV5JztcclxuICAgICAgICAgICAgYmxhZGUudG9vbGJhckNvbW1hbmRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMucmVmcmVzaFwiLCBpY29uOiAnZmEgZmEtcmVmcmVzaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4geyBibGFkZS5yZWZyZXNoKCkgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuYWRkXCIsIGljb246ICdmYSBmYS1wbHVzJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IHNob3dEZXRhaWxzQmxhZGUobnVsbCkgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuZGVsZXRlXCIsIGljb246ICdmYSBmYS10cmFzaCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWRzID0gc2VsZWN0ZWRJdGVtcy5tYXAoeCA9PiB4LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5kZWxldGUoeyBpZHM6IGlkcyB9LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogKCkgPT4gc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGFwaS5nZXQoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5kYXRhID0gZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLnNlbGVjdGVkQWxsID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMgPSBibGFkZS5kYXRhLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RBbGwgPSAoc2VsZWN0ZWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChibGFkZS5kYXRhLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNlbGVjdGlvbkxpc3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdE5vZGUgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkTm9kZUlkID0gbm9kZS5pZDtcclxuXHJcbiAgICAgICAgICAgICAgICBzaG93RGV0YWlsc0JsYWRlKG5vZGUuaWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzaG93RGV0YWlsc0JsYWRlIChpdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZXRhaWxzQmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdwYXltZW50LW1ldGhvZC1kZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kRGV0YWlsc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL21ldGhvZC1kZXRhaWxzLnRwbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW50aXR5SWQ6IGl0ZW1JZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShkZXRhaWxzQmxhZGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmZhY3RvcnkoJ05hdGl2ZVBheW1lbnRNZXRob2RzLndlYkFwaScsIFsnJHJlc291cmNlJywgKCRyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2RzJywge30sIHtcclxuICAgICAgICAgICAgZGVsZXRlOiB7IG1ldGhvZDogJ0RFTEVURScsIHVybDogJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2RzJyB9LFxyXG4gICAgICAgICAgICBnZXRCeUlkOiB7IG1ldGhvZDogJ0dFVCcsIHVybDogJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2RzLzppZCcgfSxcclxuICAgICAgICAgICAgc2F2ZTogeyBtZXRob2Q6ICdQT1NUJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnIH1cclxuICAgICAgICB9KTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3BsYXRmb3JtV2ViQXBwJylcclxuICAgIC5jb250cm9sbGVyKCdOYXRpdmVQYXltZW50TWV0aG9kcy5wYXltZW50TG9nb1dpZGdldENvbnRyb2xsZXInLCBbJyRzY29wZScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkge1xyXG4gICAgICAgIHZhciBibGFkZSA9ICRzY29wZS5ibGFkZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9wZW5CbGFkZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld0JsYWRlID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdwYXltZW50RGV0YWlsc0xvZ28nLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEVudGl0eTogYmxhZGUuY3VycmVudEVudGl0eSxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5wYXltZW50RGV0YWlsc0xvZ29Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL21ldGhvZC1sb2dvLmh0bWwnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSwgYmxhZGUpO1xyXG4gICAgICAgIH07XHJcbn1dKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9