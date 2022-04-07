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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsbURBQW1EO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkJBQTJCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsa0JBQWtCO0FBQ2xCLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGlCQUFpQjtBQUM1RDtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHFCQUFxQjtBQUNyQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOzs7Ozs7Ozs7QUM5RlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxpQkFBaUI7QUFDNUQ7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkU7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxVQUFVO0FBQy9DO0FBQ0EseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOzs7Ozs7Ozs7QUN2RVQ7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCxzQkFBc0IscURBQXFEO0FBQzNFLHVCQUF1QixzREFBc0Q7QUFDN0Usb0JBQW9CO0FBQ3BCLFNBQVM7QUFDVCxLQUFLIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvbW9kdWxlLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL2JsYWRlcy9tZXRob2QtZGV0YWlscy5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kcy1saXN0LmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL3Jlc291cmNlcy9uYXRpdmUtcGF5bWVudC1tZXRob2RzLWFwaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDYWxsIHRoaXMgdG8gcmVnaXN0ZXIgeW91ciBtb2R1bGUgdG8gbWFpbiBhcHBsaWNhdGlvblxyXG52YXIgbW9kdWxlTmFtZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcyc7XHJcblxyXG5pZiAoQXBwRGVwZW5kZW5jaWVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgIEFwcERlcGVuZGVuY2llcy5wdXNoKG1vZHVsZU5hbWUpO1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShtb2R1bGVOYW1lLCBbXSlcclxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3dvcmtzcGFjZS5OYXRpdmVQYXltZW50TWV0aG9kc1N0YXRlJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9OYXRpdmVQYXltZW50TWV0aG9kcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICckKFBsYXRmb3JtKS9TY3JpcHRzL2NvbW1vbi90ZW1wbGF0ZXMvaG9tZS50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdwYXltZW50LW1ldGhvZHMtbGlzdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZHNMaXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kcy1saXN0LnRwbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NpbmdEaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKG5ld0JsYWRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIF0pXHJcbiAgICAucnVuKFsncGxhdGZvcm1XZWJBcHAubWFpbk1lbnVTZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLndpZGdldFNlcnZpY2UnLCAnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAobWFpbk1lbnVTZXJ2aWNlLCB3aWRnZXRTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAgICAgLy9SZWdpc3RlciBtb2R1bGUgaW4gbWFpbiBtZW51XHJcbiAgICAgICAgICAgIHZhciBtZW51SXRlbSA9IHtcclxuICAgICAgICAgICAgICAgIHBhdGg6ICdicm93c2UvTmF0aXZlUGF5bWVudE1ldGhvZHMnLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhIGZhLW1vbmV5JyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTmF0aXZlUGF5bWVudE1ldGhvZHMubWVudS1pdGVtLW5hbWUnLFxyXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6IDEwMCxcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyAkc3RhdGUuZ28oJ3dvcmtzcGFjZS5OYXRpdmVQYXltZW50TWV0aG9kc1N0YXRlJyk7IH0sXHJcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiAnTmF0aXZlUGF5bWVudE1ldGhvZHM6YWNjZXNzJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtYWluTWVudVNlcnZpY2UuYWRkTWVudUl0ZW0obWVudUl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1ldGhvZERldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLm9iakNvbXBhcmVTZXJ2aWNlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgb2JqQ29tcGFyZVNlcnZpY2UsIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG5cclxuICAgICAgICAgICAgYmxhZGUucmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChibGFkZS5jdXJyZW50RW50aXR5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0QnlJZCh7IGlkOiBibGFkZS5jdXJyZW50RW50aXR5SWQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUuY3VycmVudEVudGl0eSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gcmVzdWx0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBibGFkZS5jdXJyZW50RW50aXR5ID0geyBpc0VuYWJsZWQ6IHRydWUgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLm9yaWdpbmFsRW50aXR5ID0gYW5ndWxhci5jb3B5KGJsYWRlLmN1cnJlbnRFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBibGFkZS50aXRsZSA9IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5uZXctbWV0aG9kXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2V0Rm9ybSA9IGZ1bmN0aW9uIChmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5mb3JtU2NvcGUgPSBmb3JtO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc0RpcnR5KCkgJiYgKCFibGFkZS5mb3JtU2NvcGUgfHwgYmxhZGUuZm9ybVNjb3BlLiR2YWxpZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxhZGUub3JpZ2luYWxFbnRpdHkgJiYgIW9iakNvbXBhcmVTZXJ2aWNlLmVxdWFsKGJsYWRlLm9yaWdpbmFsRW50aXR5LCBibGFkZS5jdXJyZW50RW50aXR5KSAmJiAhYmxhZGUuaXNOZXcgJiYgYmxhZGUuaGFzVXBkYXRlUGVybWlzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBibGFkZS5tZXRhRmllbGRzID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICduYW1lJyxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVhZE9ubHk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk5hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5tZXRob2QtZGV0YWlscy5sYWJlbHMubmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJTaG9ydFRleHRcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29kZScsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpc1JlYWRPbmx5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kLWRldGFpbHMubGFiZWxzLmNvZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiU2hvcnRUZXh0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2lzRW5hYmxlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5pc0VuYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IFwiQm9vbGVhblwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZC1kZXRhaWxzLmxhYmVscy5kZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogXCJMb25nVGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5zYXZlXCIsIGljb246ICdmYSBmYS1zYXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zYXZlKGJsYWRlLmN1cnJlbnRFbnRpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RCbGFkZSA9ICRzY29wZS4kcGFyZW50LiRwYXJlbnQuYmxhZGVzLmZpbmQoeCA9PiB4LmlkID09PSBcInBheW1lbnQtbWV0aG9kcy1saXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2UuY2xvc2VCbGFkZShibGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuRXhlY3V0ZU1ldGhvZDogY2FuU2F2ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3JtLmNvbW1hbmRzLnJlc2V0XCIsIGljb246ICdmYSBmYS11bmRvJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShibGFkZS5vcmlnaW5hbEVudGl0eSwgYmxhZGUuY3VycmVudEVudGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiBpc0RpcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IGJsYWRlLnVwZGF0ZVBlcm1pc3Npb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuY29udHJvbGxlcignTmF0aXZlUGF5bWVudE1ldGhvZHMubWV0aG9kc0xpc3RDb250cm9sbGVyJywgWyckc2NvcGUnLCAnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLFxyXG4gICAgICAgICgkc2NvcGUsIGFwaSwgYmxhZGVOYXZpZ2F0aW9uU2VydmljZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGJsYWRlID0gJHNjb3BlLmJsYWRlO1xyXG4gICAgICAgICAgICBibGFkZS50aXRsZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcy5ibGFkZXMubWV0aG9kcy1saXN0LnRpdGxlJztcclxuICAgICAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG4gICAgICAgICAgICBibGFkZS50b29sYmFyQ29tbWFuZHMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7IGJsYWRlLnJlZnJlc2goKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5hZGRcIiwgaWNvbjogJ2ZhIGZhLXBsdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgc2hvd0RldGFpbHNCbGFkZShudWxsKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbkV4ZWN1dGVNZXRob2Q6ICgpID0+IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5kZWxldGVcIiwgaWNvbjogJ2ZhIGZhLXRyYXNoJyxcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHMgPSBzZWxlY3RlZEl0ZW1zLm1hcCh4ID0+IHguaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmRlbGV0ZSh7IGlkczogaWRzIH0sIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYXBpLmdldCgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJsYWRlLmRhdGEgPSBkYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuc2VsZWN0ZWRBbGwgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxhZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVTZWxlY3Rpb25MaXN0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IGJsYWRlLmRhdGEuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdEFsbCA9IChzZWxlY3RlZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGJsYWRlLmRhdGEsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0Tm9kZSA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWROb2RlSWQgPSBub2RlLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgIHNob3dEZXRhaWxzQmxhZGUobm9kZS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dEZXRhaWxzQmxhZGUgKGl0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRldGFpbHNCbGFkZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJ3BheW1lbnQtbWV0aG9kLWRldGFpbHMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2REZXRhaWxzQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdNb2R1bGVzLyQoVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcykvU2NyaXB0cy9ibGFkZXMvbWV0aG9kLWRldGFpbHMudHBsLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbnRpdHlJZDogaXRlbUlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGJsYWRlTmF2aWdhdGlvblNlcnZpY2Uuc2hvd0JsYWRlKGRldGFpbHNCbGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJsYWRlLnJlZnJlc2goKTtcclxuICAgICAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXHJcbiAgICAuZmFjdG9yeSgnTmF0aXZlUGF5bWVudE1ldGhvZHMud2ViQXBpJywgWyckcmVzb3VyY2UnLCBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnLCB7fSwge1xyXG4gICAgICAgICAgICBkZWxldGU6IHsgbWV0aG9kOiAnREVMRVRFJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMnIH0sXHJcbiAgICAgICAgICAgIGdldEJ5SWQ6IHsgbWV0aG9kOiAnR0VUJywgdXJsOiAnYXBpL25hdGl2ZS1wYXltZW50LW1ldGhvZHMvOmlkJyB9LFxyXG4gICAgICAgICAgICBzYXZlOiB7IG1ldGhvZDogJ1BPU1QnLCB1cmw6ICdhcGkvbmF0aXZlLXBheW1lbnQtbWV0aG9kcycgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfV0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=