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
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('workspace.NativePaymentMethodsState', {
                    url: '/NativePaymentMethods',
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        '$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
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
        function (mainMenuService, widgetService, $state) {
            //Register module in main menu
            var menuItem = {
                path: 'browse/NativePaymentMethods',
                icon: 'fa fa-money',
                title: 'NativePaymentMethods.menu-item-name',
                priority: 100,
                action: function () { $state.go('workspace.NativePaymentMethodsState'); },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7Ozs7Ozs7O0FDdkVUO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQsc0JBQXNCLHFEQUFxRDtBQUMzRSx1QkFBdUIsc0RBQXNEO0FBQzdFLG9CQUFvQjtBQUNwQixTQUFTO0FBQ1QsS0FBSzs7Ozs7Ozs7O0FDUEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvYmxhZGVzL21ldGhvZC1kZXRhaWxzLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL2JsYWRlcy9tZXRob2QtbG9nby5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kcy1saXN0LmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL3Jlc291cmNlcy9uYXRpdmUtcGF5bWVudC1tZXRob2RzLWFwaS5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy93aWRnZXRzL3BheW1lbnQtbG9nby13aWRnZXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ2FsbCB0aGlzIHRvIHJlZ2lzdGVyIHlvdXIgbW9kdWxlIHRvIG1haW4gYXBwbGljYXRpb25cclxudmFyIG1vZHVsZU5hbWUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMnO1xyXG5cclxuaWYgKEFwcERlcGVuZGVuY2llcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBBcHBEZXBlbmRlbmNpZXMucHVzaChtb2R1bGVOYW1lKTtcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSwgW10pXHJcbiAgICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCd3b3Jrc3BhY2UuTmF0aXZlUGF5bWVudE1ldGhvZHNTdGF0ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvTmF0aXZlUGF5bWVudE1ldGhvZHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnJChQbGF0Zm9ybSkvU2NyaXB0cy9jb21tb24vdGVtcGxhdGVzL2hvbWUudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJyRzY29wZScsICdwbGF0Zm9ybVdlYkFwcC5ibGFkZU5hdmlnYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JsYWRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAncGF5bWVudC1tZXRob2RzLWxpc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2RzTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL21ldGhvZHMtbGlzdC50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zaW5nRGlzYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICBdKVxyXG4gICAgLnJ1bihbJ3BsYXRmb3JtV2ViQXBwLm1haW5NZW51U2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC53aWRnZXRTZXJ2aWNlJywgJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKG1haW5NZW51U2VydmljZSwgd2lkZ2V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgbW9kdWxlIGluIG1haW4gbWVudVxyXG4gICAgICAgICAgICB2YXIgbWVudUl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnYnJvd3NlL05hdGl2ZVBheW1lbnRNZXRob2RzJyxcclxuICAgICAgICAgICAgICAgIGljb246ICdmYSBmYS1tb25leScsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1lbnUtaXRlbS1uYW1lJyxcclxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAxMDAsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgJHN0YXRlLmdvKCd3b3Jrc3BhY2UuTmF0aXZlUGF5bWVudE1ldGhvZHNTdGF0ZScpOyB9LFxyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogJ05hdGl2ZVBheW1lbnRNZXRob2RzOmFjY2VzcydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbWFpbk1lbnVTZXJ2aWNlLmFkZE1lbnVJdGVtKG1lbnVJdGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgd2lkZ2V0c1xyXG4gICAgICAgICAgICB3aWRnZXRTZXJ2aWNlLnJlZ2lzdGVyV2lkZ2V0KHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5wYXltZW50TG9nb1dpZGdldENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy93aWRnZXRzL3BheW1lbnQtbG9nby13aWRnZXQuaHRtbCdcclxuICAgICAgICAgICAgfSwgJ25hdGl2ZVBheW1lbnREZXRhaWxzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdOYXRpdmVQYXltZW50TWV0aG9kcy53ZWJBcGknLCAncGxhdGZvcm1XZWJBcHAub2JqQ29tcGFyZVNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsXHJcbiAgICAgICAgKCRzY29wZSwgYXBpLCBvYmpDb21wYXJlU2VydmljZSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5oZWFkSWNvbiA9ICdmYSBmYS1tb25leSc7XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJsYWRlLmN1cnJlbnRFbnRpdHlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRCeUlkKHsgaWQ6IGJsYWRlLmN1cnJlbnRFbnRpdHlJZCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUub3JpZ2luYWxFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUudGl0bGUgPSByZXN1bHQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmN1cnJlbnRFbnRpdHkgPSB7IGlzRW5hYmxlZDogdHJ1ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUub3JpZ2luYWxFbnRpdHkgPSBhbmd1bGFyLmNvcHkoYmxhZGUuY3VycmVudEVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLm5ldy1tZXRob2RcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZXRGb3JtID0gZnVuY3Rpb24gKGZvcm0pIHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmZvcm1TY29wZSA9IGZvcm07XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5TYXZlKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRGlydHkoKSAmJiAoIWJsYWRlLmZvcm1TY29wZSB8fCBibGFkZS5mb3JtU2NvcGUuJHZhbGlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibGFkZS5vcmlnaW5hbEVudGl0eSAmJiAhb2JqQ29tcGFyZVNlcnZpY2UuZXF1YWwoYmxhZGUub3JpZ2luYWxFbnRpdHksIGJsYWRlLmN1cnJlbnRFbnRpdHkpICYmICFibGFkZS5pc05ldyAmJiBibGFkZS5oYXNVcGRhdGVQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLm1ldGFGaWVsZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ25hbWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZWFkT25seTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiBcIlNob3J0VGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb2RlJyxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMuY29kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJTaG9ydFRleHRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnaXNFbmFibGVkJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLmlzRW5hYmxlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJCb29sZWFuXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Rlc2NyaXB0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLmRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUeXBlOiBcIkxvbmdUZXh0XCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnRvb2xiYXJDb21tYW5kcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnJlZnJlc2hcIiwgaWNvbjogJ2ZhIGZhLXJlZnJlc2gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgYmxhZGUucmVmcmVzaCgpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogKCkgPT4gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnNhdmVcIiwgaWNvbjogJ2ZhIGZhLXNhdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNhdmUoYmxhZGUuY3VycmVudEVudGl0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdEJsYWRlID0gJHNjb3BlLiRwYXJlbnQuJHBhcmVudC5ibGFkZXMuZmluZCh4ID0+IHguaWQgPT09IFwicGF5bWVudC1tZXRob2RzLWxpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5jbG9zZUJsYWRlKGJsYWRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0QmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBjYW5TYXZlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMucmVzZXRcIiwgaWNvbjogJ2ZhIGZhLXVuZG8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KGJsYWRlLm9yaWdpbmFsRW50aXR5LCBibGFkZS5jdXJyZW50RW50aXR5KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGlzRGlydHksXHJcbiAgICAgICAgICAgICAgICAgICAgcGVybWlzc2lvbjogYmxhZGUudXBkYXRlUGVybWlzc2lvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ05hdGl2ZVBheW1lbnRNZXRob2RzJylcclxuICAgIC5jb250cm9sbGVyKCdOYXRpdmVQYXltZW50TWV0aG9kcy5wYXltZW50RGV0YWlsc0xvZ29Db250cm9sbGVyJywgWyckc2NvcGUnLCAnRmlsZVVwbG9hZGVyJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAuZGlhbG9nU2VydmljZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgRmlsZVVwbG9hZGVyLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLCBkaWFsb2dTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgIHZhciBibGFkZSA9ICRzY29wZS5ibGFkZTtcclxuICAgICAgICAgICAgYmxhZGUudGl0bGUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLnBheW1lbnQtbG9nby50aXRsZSc7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5sb2dvVXBsb2FkZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvZ29VcGxvYWRlciA9ICRzY29wZS5sb2dvVXBsb2FkZXIgPSBuZXcgRmlsZVVwbG9hZGVyKHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvVXBsb2FkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUFmdGVyVXBsb2FkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdpbWFnZUZpbHRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwcm92YWwgPSAvXi4qXFwuKHBuZ3xnaWZ8c3ZnKSQvLnRlc3QoaXRlbS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXBwcm92YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWFsb2cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZpbGV0eXBlIGVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiT25seSBQTkcsIEdJRiBvciBTVkcgZmlsZXMgYXJlIGFsbG93ZWQuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpYWxvZ1NlcnZpY2Uuc2hvd0Vycm9yRGlhbG9nKGRpYWxvZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXBwcm92YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nb1VwbG9hZGVyLnVybCA9ICdhcGkvYXNzZXRzP2ZvbGRlclVybD1wYXltZW50TG9nb3MnO1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZ29VcGxvYWRlci5vblN1Y2Nlc3NJdGVtID0gZnVuY3Rpb24gKF8sIHVwbG9hZGVkSW1hZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eS5sb2dvVXJsID0gdXBsb2FkZWRJbWFnZXNbMF0udXJsO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dvVXBsb2FkZXIub25FcnJvckl0ZW0gPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVzcG9uc2UsIHN0YXR1cywgXykge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2V0RXJyb3IoZWxlbWVudC5fZmlsZS5uYW1lICsgJyBmYWlsZWQ6ICcgKyAocmVzcG9uc2UubWVzc2FnZSA/IHJlc3BvbnNlLm1lc3NhZ2UgOiBzdGF0dXMpLCBibGFkZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYmxhZGUub3JpZ2luYWxFbnRpdHkgPSBibGFkZS5jdXJyZW50RW50aXR5O1xyXG4gICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eSA9IGFuZ3VsYXIuY29weShibGFkZS5jdXJyZW50RW50aXR5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmb3JtU2NvcGU7XHJcbiAgICAgICAgICAgICRzY29wZS5zZXRGb3JtID0gZnVuY3Rpb24gKGZvcm0pIHsgZm9ybVNjb3BlID0gZm9ybTsgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmJyb3dzZUZpbGVzID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7aWR9YCkuY2xpY2soKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBpc0RpcnR5KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFhbmd1bGFyLmVxdWFscyhibGFkZS5jdXJyZW50RW50aXR5LCBibGFkZS5vcmlnaW5hbEVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhblNhdmUoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNEaXJ0eSgpICYmIGZvcm1TY29wZSAmJiBmb3JtU2NvcGUuJHZhbGlkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5zYXZlQ2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShibGFkZS5jdXJyZW50RW50aXR5LCBibGFkZS5vcmlnaW5hbEVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYmxhZGVDbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYmxhZGUudG9vbGJhckNvbW1hbmRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuc2F2ZVwiLCBpY29uOiAnZmFzIGZhLXNhdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6IGJsYWRlLnNhdmVDaGFuZ2VzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6IGNhblNhdmVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5zZXQtdG8tZGVmYXVsdFwiLCBpY29uOiAnZmEgZmEtdW5kbycsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5LmxvZ29VcmwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUub25DbG9zZSA9IGZ1bmN0aW9uIChjbG9zZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dDb25maXJtYXRpb25JZk5lZWRlZChpc0RpcnR5KCksIGNhblNhdmUoKSwgYmxhZGUsIGJsYWRlLnNhdmVDaGFuZ2VzLCBjbG9zZUNhbGxiYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuZGlhbG9ncy5wYXltZW50LWRldGFpbHMtc2F2ZS50aXRsZVwiLCBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmRpYWxvZ3MucGF5bWVudC1kZXRhaWxzLXNhdmUubWVzc2FnZVwiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ05hdGl2ZVBheW1lbnRNZXRob2RzJylcclxuICAgIC5jb250cm9sbGVyKCdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2RzTGlzdENvbnRyb2xsZXInLCBbJyRzY29wZScsICdOYXRpdmVQYXltZW50TWV0aG9kcy53ZWJBcGknLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsXHJcbiAgICAgICAgKCRzY29wZSwgYXBpLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEl0ZW1zID0gW107XHJcblxyXG4gICAgICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcbiAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2RzLWxpc3QudGl0bGUnO1xyXG4gICAgICAgICAgICBibGFkZS5oZWFkSWNvbiA9ICdmYSBmYS1tb25leSc7XHJcbiAgICAgICAgICAgIGJsYWRlLnRvb2xiYXJDb21tYW5kcyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnJlZnJlc2hcIiwgaWNvbjogJ2ZhIGZhLXJlZnJlc2gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgYmxhZGUucmVmcmVzaCgpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogKCkgPT4gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLmFkZFwiLCBpY29uOiAnZmEgZmEtcGx1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZU1ldGhvZDogKCkgPT4geyBzaG93RGV0YWlsc0JsYWRlKG51bGwpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogKCkgPT4gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLmRlbGV0ZVwiLCBpY29uOiAnZmEgZmEtdHJhc2gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkcyA9IHNlbGVjdGVkSXRlbXMubWFwKHggPT4geC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuZGVsZXRlKHsgaWRzOiBpZHMgfSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBhcGkuZ2V0KChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuZGF0YSA9IGRhdGEucmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5zZWxlY3RlZEFsbCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZVNlbGVjdGlvbkxpc3QgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gYmxhZGUuZGF0YS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0QWxsID0gKHNlbGVjdGVkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goYmxhZGUuZGF0YSwgKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVTZWxlY3Rpb25MaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3ROb2RlID0gKG5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZE5vZGVJZCA9IG5vZGUuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc2hvd0RldGFpbHNCbGFkZShub2RlLmlkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvd0RldGFpbHNCbGFkZSAoaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGV0YWlsc0JsYWRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAncGF5bWVudC1tZXRob2QtZGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZERldGFpbHNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ01vZHVsZXMvJChWaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzKS9TY3JpcHRzL2JsYWRlcy9tZXRob2QtZGV0YWlscy50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEVudGl0eUlkOiBpdGVtSWRcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUoZGV0YWlsc0JsYWRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ05hdGl2ZVBheW1lbnRNZXRob2RzJylcclxuICAgIC5mYWN0b3J5KCdOYXRpdmVQYXltZW50TWV0aG9kcy53ZWJBcGknLCBbJyRyZXNvdXJjZScsIGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKCdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcycsIHt9LCB7XHJcbiAgICAgICAgICAgIGRlbGV0ZTogeyBtZXRob2Q6ICdERUxFVEUnLCB1cmw6ICdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcycgfSxcclxuICAgICAgICAgICAgZ2V0QnlJZDogeyBtZXRob2Q6ICdHRVQnLCB1cmw6ICdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcy86aWQnIH0sXHJcbiAgICAgICAgICAgIHNhdmU6IHsgbWV0aG9kOiAnUE9TVCcsIHVybDogJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2RzJyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdwbGF0Zm9ybVdlYkFwcCcpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudExvZ29XaWRnZXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAncGxhdGZvcm1XZWJBcHAuYmxhZGVOYXZpZ2F0aW9uU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuQmxhZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiAncGF5bWVudERldGFpbHNMb2dvJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHk6IGJsYWRlLmN1cnJlbnRFbnRpdHksXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMucGF5bWVudERldGFpbHNMb2dvQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ01vZHVsZXMvJChWaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzKS9TY3JpcHRzL2JsYWRlcy9tZXRob2QtbG9nby5odG1sJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUobmV3QmxhZGUsIGJsYWRlKTtcclxuICAgICAgICB9O1xyXG59XSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==