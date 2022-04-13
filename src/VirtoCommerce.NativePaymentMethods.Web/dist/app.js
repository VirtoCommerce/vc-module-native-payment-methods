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

            $scope.setForm = function (form) {
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
        function ($scope, FileUploader, bladeNavigationService, dialogService) {
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
                        fn: function (item) {
                            const approval = /^.*\.(png|gif|svg)$/.test(item.name);
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

                logoUploader.url = 'api/assets?folderUrl=paymentLogos';

                logoUploader.onSuccessItem = function (_, uploadedImages) {
                    blade.currentEntity.logoUrl = uploadedImages[0].url;
                };

                logoUploader.onErrorItem = function (element, response, status, _) {
                    bladeNavigationService.setError(element._file.name + ' failed: ' + (response.message ? response.message : status), blade);
                };
            }

            blade.refresh = function () {
                blade.originalEntity = blade.currentEntity;
                blade.currentEntity = angular.copy(blade.currentEntity);

                blade.isLoading = false;
            };

            let formScope;
            $scope.setForm = function (form) { formScope = form; }

            $scope.browseFiles = function (id) {
                window.document.querySelector(`#${id}`).click()
            }

            function isDirty() {
                return !angular.equals(blade.currentEntity, blade.originalEntity);
            }

            function canSave() {
                return isDirty() && formScope && formScope.$valid;
            }

            blade.saveChanges = function () {
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
                    executeMethod: function () {
                        blade.currentEntity.logoUrl = null;
                    },
                    canExecuteMethod: function () { return true; }
                }
            ];

            blade.onClose = function (closeCallback) {
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
    .factory('NativePaymentMethods.webApi', ['$resource', function ($resource) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7Ozs7Ozs7O0FDdkVUO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsc0JBQXNCLHFEQUFxRDtBQUMzRSx1QkFBdUIsc0RBQXNEO0FBQzdFLG9CQUFvQjtBQUNwQixTQUFTO0FBQ1QsS0FBSzs7Ozs7Ozs7O0FDUEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvYmxhZGVzL21ldGhvZC1kZXRhaWxzLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL2JsYWRlcy9tZXRob2QtbG9nby5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kcy1saXN0LmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL3Jlc291cmNlcy9uYXRpdmUtcGF5bWVudC1tZXRob2RzLWFwaS5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy93aWRnZXRzL3BheW1lbnQtbG9nby13aWRnZXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ2FsbCB0aGlzIHRvIHJlZ2lzdGVyIHlvdXIgbW9kdWxlIHRvIG1haW4gYXBwbGljYXRpb25cclxudmFyIG1vZHVsZU5hbWUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMnO1xyXG5cclxuaWYgKEFwcERlcGVuZGVuY2llcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBBcHBEZXBlbmRlbmNpZXMucHVzaChtb2R1bGVOYW1lKTtcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSwgW10pXHJcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCd3b3Jrc3BhY2UuTmF0aXZlUGF5bWVudE1ldGhvZHNTdGF0ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvTmF0aXZlUGF5bWVudE1ldGhvZHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnJChQbGF0Zm9ybSkvU2NyaXB0cy9jb21tb24vdGVtcGxhdGVzL2hvbWUudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJyRzY29wZScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JsYWRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAncGF5bWVudC1tZXRob2RzLWxpc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2RzTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL21ldGhvZHMtbGlzdC50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zaW5nRGlzYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICBdKVxyXG4gICAgLnJ1bihbJ3BsYXRmb3JtV2ViQXBwLm1haW5NZW51U2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC53aWRnZXRTZXJ2aWNlJywgJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKG1haW5NZW51U2VydmljZSwgd2lkZ2V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgbW9kdWxlIGluIG1haW4gbWVudVxyXG4gICAgICAgICAgICB2YXIgbWVudUl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnYnJvd3NlL05hdGl2ZVBheW1lbnRNZXRob2RzJyxcclxuICAgICAgICAgICAgICAgIGljb246ICdmYSBmYS1tb25leScsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1lbnUtaXRlbS1uYW1lJyxcclxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAxMDAsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgJHN0YXRlLmdvKCd3b3Jrc3BhY2UuTmF0aXZlUGF5bWVudE1ldGhvZHNTdGF0ZScpOyB9LFxyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogJ05hdGl2ZVBheW1lbnRNZXRob2RzOmFjY2VzcydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbWFpbk1lbnVTZXJ2aWNlLmFkZE1lbnVJdGVtKG1lbnVJdGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgd2lkZ2V0c1xyXG4gICAgICAgICAgICB3aWRnZXRTZXJ2aWNlLnJlZ2lzdGVyV2lkZ2V0KHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5wYXltZW50TG9nb1dpZGdldENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy93aWRnZXRzL3BheW1lbnQtbG9nby13aWRnZXQuaHRtbCdcclxuICAgICAgICAgICAgfSwgJ25hdGl2ZVBheW1lbnREZXRhaWxzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdOYXRpdmVQYXltZW50TWV0aG9kcy53ZWJBcGknLCAncGxhdGZvcm1XZWJBcHAub2JqQ29tcGFyZVNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsXHJcbiAgICAgICAgKCRzY29wZSwgYXBpLCBvYmpDb21wYXJlU2VydmljZSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5oZWFkSWNvbiA9ICdmYSBmYS1tb25leSc7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsYWRlLmN1cnJlbnRFbnRpdHlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRCeUlkKHsgaWQ6IGJsYWRlLmN1cnJlbnRFbnRpdHlJZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUub3JpZ2luYWxFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUudGl0bGUgPSByZXN1bHQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSB7IGlzRW5hYmxlZDogdHJ1ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUub3JpZ2luYWxFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLm5ldy1tZXRob2RcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZXRGb3JtID0gZnVuY3Rpb24gKGZvcm0pIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmZvcm1TY29wZSA9IGZvcm07XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5TYXZlKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRGlydHkoKSAmJiAoIWJsYWRlLmZvcm1TY29wZSB8fCBibGFkZS5mb3JtU2NvcGUuJHZhbGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibGFkZS5vcmlnaW5hbEVudGl0eSAmJiAhb2JqQ29tcGFyZVNlcnZpY2UuZXF1YWwoYmxhZGUub3JpZ2luYWxFbnRpdHksIGJsYWRlLmN1cnJlbnRFbnRpdHkpICYmICFibGFkZS5pc05ldyAmJiBibGFkZS5oYXNVcGRhdGVQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLm1ldGFGaWVsZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvZGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZWFkT25seTogYmxhZGUuY3VycmVudEVudGl0eUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMuY29kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJTaG9ydFRleHRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnbmFtZScsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlYWRPbmx5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiU2hvcnRUZXh0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2lzRW5hYmxlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5pc0VuYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiQm9vbGVhblwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5kZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJMb25nVGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5zYXZlXCIsIGljb246ICdmYSBmYS1zYXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zYXZlKGJsYWRlLmN1cnJlbnRFbnRpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RCbGFkZSA9ICRzY29wZS4kcGFyZW50LiRwYXJlbnQuYmxhZGVzLmZpbmQoeCA9PiB4LmlkID09PSBcInBheW1lbnQtbWV0aG9kcy1saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UuY2xvc2VCbGFkZShibGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogY2FuU2F2ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnJlc2V0XCIsIGljb246ICdmYSBmYS11bmRvJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShibGFkZS5vcmlnaW5hbEVudGl0eSwgYmxhZGUuY3VycmVudEVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBpc0RpcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IGJsYWRlLnVwZGF0ZVBlcm1pc3Npb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudERldGFpbHNMb2dvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZpbGVVcGxvYWRlcicsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLmRpYWxvZ1NlcnZpY2UnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIEZpbGVVcGxvYWRlciwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSwgZGlhbG9nU2VydmljZSkge1xyXG4gICAgICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcbiAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5wYXltZW50LWxvZ28udGl0bGUnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc2NvcGUubG9nb1VwbG9hZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2dvVXBsb2FkZXIgPSAkc2NvcGUubG9nb1VwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b1VwbG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVBZnRlclVwbG9hZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaW1hZ2VGaWx0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcHJvdmFsID0gL14uKlxcLihwbmd8Z2lmfHN2ZykkLy50ZXN0KGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFwcHJvdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlhbG9nID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJGaWxldHlwZSBlcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk9ubHkgUE5HLCBHSUYgb3IgU1ZHIGZpbGVzIGFyZSBhbGxvd2VkLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWFsb2dTZXJ2aWNlLnNob3dFcnJvckRpYWxvZyhkaWFsb2cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcHJvdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZ29VcGxvYWRlci51cmwgPSAnYXBpL2Fzc2V0cz9mb2xkZXJVcmw9cGF5bWVudExvZ29zJztcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dvVXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IGZ1bmN0aW9uIChfLCB1cGxvYWRlZEltYWdlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkubG9nb1VybCA9IHVwbG9hZGVkSW1hZ2VzWzBdLnVybDtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nb1VwbG9hZGVyLm9uRXJyb3JJdGVtID0gZnVuY3Rpb24gKGVsZW1lbnQsIHJlc3BvbnNlLCBzdGF0dXMsIF8pIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNldEVycm9yKGVsZW1lbnQuX2ZpbGUubmFtZSArICcgZmFpbGVkOiAnICsgKHJlc3BvbnNlLm1lc3NhZ2UgPyByZXNwb25zZS5tZXNzYWdlIDogc3RhdHVzKSwgYmxhZGUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYmxhZGUuY3VycmVudEVudGl0eTtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgZm9ybVNjb3BlO1xyXG4gICAgICAgICAgICAkc2NvcGUuc2V0Rm9ybSA9IGZ1bmN0aW9uIChmb3JtKSB7IGZvcm1TY29wZSA9IGZvcm07IH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5icm93c2VGaWxlcyA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApLmNsaWNrKClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhYW5ndWxhci5lcXVhbHMoYmxhZGUuY3VycmVudEVudGl0eSwgYmxhZGUub3JpZ2luYWxFbnRpdHkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5TYXZlKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRGlydHkoKSAmJiBmb3JtU2NvcGUgJiYgZm9ybVNjb3BlLiR2YWxpZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUuc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSwgYmxhZGUub3JpZ2luYWxFbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmJsYWRlQ2xvc2UoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnRvb2xiYXJDb21tYW5kcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnNhdmVcIiwgaWNvbjogJ2ZhcyBmYS1zYXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiBibGFkZS5zYXZlQ2hhbmdlcyxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBjYW5TYXZlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuc2V0LXRvLWRlZmF1bHRcIiwgaWNvbjogJ2ZhIGZhLXVuZG8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eS5sb2dvVXJsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLm9uQ2xvc2UgPSBmdW5jdGlvbiAoY2xvc2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93Q29uZmlybWF0aW9uSWZOZWVkZWQoaXNEaXJ0eSgpLCBjYW5TYXZlKCksIGJsYWRlLCBibGFkZS5zYXZlQ2hhbmdlcywgY2xvc2VDYWxsYmFjayxcclxuICAgICAgICAgICAgICAgICAgICBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmRpYWxvZ3MucGF5bWVudC1kZXRhaWxzLXNhdmUudGl0bGVcIiwgXCJOYXRpdmVQYXltZW50TWV0aG9kcy5kaWFsb2dzLnBheW1lbnQtZGV0YWlscy1zYXZlLm1lc3NhZ2VcIik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoKCk7XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kc0xpc3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG4gICAgICAgICAgICBibGFkZS50aXRsZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kcy1saXN0LnRpdGxlJztcclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5hZGRcIiwgaWNvbjogJ2ZhIGZhLXBsdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgc2hvd0RldGFpbHNCbGFkZShudWxsKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5kZWxldGVcIiwgaWNvbjogJ2ZhIGZhLXRyYXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHMgPSBzZWxlY3RlZEl0ZW1zLm1hcCh4ID0+IHguaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmRlbGV0ZSh7IGlkczogaWRzIH0sIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYXBpLmdldCgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmRhdGEgPSBkYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuc2VsZWN0ZWRBbGwgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTZWxlY3Rpb25MaXN0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IGJsYWRlLmRhdGEuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdEFsbCA9IChzZWxlY3RlZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGJsYWRlLmRhdGEsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Tm9kZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWROb2RlSWQgPSBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIHNob3dEZXRhaWxzQmxhZGUobm9kZS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dEZXRhaWxzQmxhZGUgKGl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRldGFpbHNCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnQtbWV0aG9kLWRldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2REZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWRldGFpbHMudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHlJZDogaXRlbUlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKGRldGFpbHNCbGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuZmFjdG9yeSgnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgWyckcmVzb3VyY2UnLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnLCB7fSwge1xyXG4gICAgICAgICAgICBkZWxldGU6IHsgbWV0aG9kOiAnREVMRVRFJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnIH0sXHJcbiAgICAgICAgICAgIGdldEJ5SWQ6IHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMvOmlkJyB9LFxyXG4gICAgICAgICAgICBzYXZlOiB7IG1ldGhvZDogJ1BPU1QnLCB1cmw6ICdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcycgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncGxhdGZvcm1XZWJBcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLnBheW1lbnRMb2dvV2lkZ2V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG5cclxuICAgICAgICAkc2NvcGUub3BlbkJsYWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnREZXRhaWxzTG9nbycsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50RW50aXR5OiBibGFkZS5jdXJyZW50RW50aXR5LFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdGl2ZVBheW1lbnRNZXRob2RzLnBheW1lbnREZXRhaWxzTG9nb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWxvZ28uaHRtbCdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKG5ld0JsYWRlLCBibGFkZSk7XHJcbiAgICAgICAgfTtcclxufV0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=