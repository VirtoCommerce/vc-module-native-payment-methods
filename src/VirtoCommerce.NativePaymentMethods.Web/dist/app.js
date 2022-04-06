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
                                id: 'blade1',
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
/*!****************************************!*\
  !*** ./Scripts/blades/methods-list.js ***!
  \****************************************/
angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.methodsListController', ['$scope', 'NativePaymentMethods.webApi', function ($scope, api) {
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
                name: "platform.commands.delete", icon: 'fa fa-trash',
                executeMethod: () => {
                    var ids = selectedItems.map(x => x.id);

                    api.delete({ ids: ids }, (result) => {
                            console.log(result);
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
        return $resource('api/native-payment-methods', {
                delete: { method: 'DELETE', url: 'api/native-payment-method' }
            });
    }]);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsbURBQW1EO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxpQkFBaUI7QUFDeEQ7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxVQUFVO0FBQzNDO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7Ozs7Ozs7O0FDakRMO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixhQUFhO0FBQ2IsS0FBSyIsInNvdXJjZXMiOlsid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL21vZHVsZS5qcyIsIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9ibGFkZXMvbWV0aG9kcy1saXN0LmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL3Jlc291cmNlcy9uYXRpdmUtcGF5bWVudC1tZXRob2RzLWFwaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDYWxsIHRoaXMgdG8gcmVnaXN0ZXIgeW91ciBtb2R1bGUgdG8gbWFpbiBhcHBsaWNhdGlvblxyXG52YXIgbW9kdWxlTmFtZSA9ICdOYXRpdmVQYXltZW50TWV0aG9kcyc7XHJcblxyXG5pZiAoQXBwRGVwZW5kZW5jaWVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgIEFwcERlcGVuZGVuY2llcy5wdXNoKG1vZHVsZU5hbWUpO1xyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZShtb2R1bGVOYW1lLCBbXSlcclxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3dvcmtzcGFjZS5OYXRpdmVQYXltZW50TWV0aG9kc1N0YXRlJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9OYXRpdmVQYXltZW50TWV0aG9kcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICckKFBsYXRmb3JtKS9TY3JpcHRzL2NvbW1vbi90ZW1wbGF0ZXMvaG9tZS50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3QmxhZGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdibGFkZTEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2RzTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL21ldGhvZHMtbGlzdC50cGwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG9zaW5nRGlzYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFkZU5hdmlnYXRpb25TZXJ2aWNlLnNob3dCbGFkZShuZXdCbGFkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICBdKVxyXG4gICAgLnJ1bihbJ3BsYXRmb3JtV2ViQXBwLm1haW5NZW51U2VydmljZScsICdwbGF0Zm9ybVdlYkFwcC53aWRnZXRTZXJ2aWNlJywgJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKG1haW5NZW51U2VydmljZSwgd2lkZ2V0U2VydmljZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgbW9kdWxlIGluIG1haW4gbWVudVxyXG4gICAgICAgICAgICB2YXIgbWVudUl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiAnYnJvd3NlL05hdGl2ZVBheW1lbnRNZXRob2RzJyxcclxuICAgICAgICAgICAgICAgIGljb246ICdmYSBmYS1tb25leScsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ05hdGl2ZVBheW1lbnRNZXRob2RzLm1lbnUtaXRlbS1uYW1lJyxcclxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAxMDAsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgJHN0YXRlLmdvKCd3b3Jrc3BhY2UuTmF0aXZlUGF5bWVudE1ldGhvZHNTdGF0ZScpOyB9LFxyXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogJ05hdGl2ZVBheW1lbnRNZXRob2RzOmFjY2VzcydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbWFpbk1lbnVTZXJ2aWNlLmFkZE1lbnVJdGVtKG1lbnVJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ05hdGl2ZVBheW1lbnRNZXRob2RzJylcclxuICAgIC5jb250cm9sbGVyKCdOYXRpdmVQYXltZW50TWV0aG9kcy5tZXRob2RzTGlzdENvbnRyb2xsZXInLCBbJyRzY29wZScsICdOYXRpdmVQYXltZW50TWV0aG9kcy53ZWJBcGknLCBmdW5jdGlvbiAoJHNjb3BlLCBhcGkpIHtcclxuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XHJcbiAgICAgICAgYmxhZGUudGl0bGUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMuYmxhZGVzLm1ldGhvZHMtbGlzdC50aXRsZSc7XHJcbiAgICAgICAgYmxhZGUuaGVhZEljb24gPSAnZmEgZmEtbW9uZXknO1xyXG4gICAgICAgIGJsYWRlLnRvb2xiYXJDb21tYW5kcyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwbGF0Zm9ybS5jb21tYW5kcy5yZWZyZXNoXCIsIGljb246ICdmYSBmYS1yZWZyZXNoJyxcclxuICAgICAgICAgICAgICAgIGV4ZWN1dGVNZXRob2Q6ICgpID0+IHsgYmxhZGUucmVmcmVzaCgpIH0sXHJcbiAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm0uY29tbWFuZHMuZGVsZXRlXCIsIGljb246ICdmYSBmYS10cmFzaCcsXHJcbiAgICAgICAgICAgICAgICBleGVjdXRlTWV0aG9kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkcyA9IHNlbGVjdGVkSXRlbXMubWFwKHggPT4geC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFwaS5kZWxldGUoeyBpZHM6IGlkcyB9LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjYW5FeGVjdXRlTWV0aG9kOiAoKSA9PiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGJsYWRlLnJlZnJlc2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGFwaS5nZXQoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGJsYWRlLmRhdGEgPSBkYXRhLnJlc3VsdHM7XHJcbiAgICAgICAgICAgICAgICBibGFkZS5zZWxlY3RlZEFsbCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcyA9IGJsYWRlLmRhdGEuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnNlbGVjdGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5zZWxlY3RBbGwgPSAoc2VsZWN0ZWQpID0+IHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGJsYWRlLmRhdGEsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlU2VsZWN0aW9uTGlzdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxyXG4gICAgLmZhY3RvcnkoJ05hdGl2ZVBheW1lbnRNZXRob2RzLndlYkFwaScsIFsnJHJlc291cmNlJywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2RzJywge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlOiB7IG1ldGhvZDogJ0RFTEVURScsIHVybDogJ2FwaS9uYXRpdmUtcGF5bWVudC1tZXRob2QnIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==