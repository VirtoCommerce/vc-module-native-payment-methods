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
                                controller: 'NativePaymentMethods.helloWorldController',
                                template: 'Modules/$(VirtoCommerce.NativePaymentMethods)/Scripts/blades/hello-world.html',
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
                icon: 'fa fa-cube',
                title: 'NativePaymentMethods',
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
/*!***************************************!*\
  !*** ./Scripts/blades/hello-world.js ***!
  \***************************************/
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

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./Scripts/resources/native-payment-methods-api.js ***!
  \*********************************************************/
angular.module('NativePaymentMethods')
    .factory('NativePaymentMethods.webApi', ['$resource', function ($resource) {
        return $resource('api/NativePaymentMethods');
}]);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLG1EQUFtRDtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBLEtBQUs7Ozs7Ozs7OztBQ2RMO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9WaXJ0b0NvbW1lcmNlLk5hdGl2ZVBheW1lbnRNZXRob2RzLy4vU2NyaXB0cy9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vVmlydG9Db21tZXJjZS5OYXRpdmVQYXltZW50TWV0aG9kcy8uL1NjcmlwdHMvYmxhZGVzL2hlbGxvLXdvcmxkLmpzIiwid2VicGFjazovL1ZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMvLi9TY3JpcHRzL3Jlc291cmNlcy9uYXRpdmUtcGF5bWVudC1tZXRob2RzLWFwaS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDYWxsIHRoaXMgdG8gcmVnaXN0ZXIgeW91ciBtb2R1bGUgdG8gbWFpbiBhcHBsaWNhdGlvblxudmFyIG1vZHVsZU5hbWUgPSAnTmF0aXZlUGF5bWVudE1ldGhvZHMnO1xuXG5pZiAoQXBwRGVwZW5kZW5jaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBBcHBEZXBlbmRlbmNpZXMucHVzaChtb2R1bGVOYW1lKTtcbn1cblxuYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSwgW10pXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnd29ya3NwYWNlLk5hdGl2ZVBheW1lbnRNZXRob2RzU3RhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9OYXRpdmVQYXltZW50TWV0aG9kcycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnJChQbGF0Zm9ybSkvU2NyaXB0cy9jb21tb24vdGVtcGxhdGVzL2hvbWUudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJHNjb3BlJywgJ3BsYXRmb3JtV2ViQXBwLmJsYWRlTmF2aWdhdGlvblNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBibGFkZU5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0JsYWRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogJ2JsYWRlMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdOYXRpdmVQYXltZW50TWV0aG9kcy5oZWxsb1dvcmxkQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnTW9kdWxlcy8kKFZpcnRvQ29tbWVyY2UuTmF0aXZlUGF5bWVudE1ldGhvZHMpL1NjcmlwdHMvYmxhZGVzL2hlbGxvLXdvcmxkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3NpbmdEaXNhYmxlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhZGVOYXZpZ2F0aW9uU2VydmljZS5zaG93QmxhZGUobmV3QmxhZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICBdKVxuICAgIC5ydW4oWydwbGF0Zm9ybVdlYkFwcC5tYWluTWVudVNlcnZpY2UnLCAncGxhdGZvcm1XZWJBcHAud2lkZ2V0U2VydmljZScsICckc3RhdGUnLFxuICAgICAgICBmdW5jdGlvbiAobWFpbk1lbnVTZXJ2aWNlLCB3aWRnZXRTZXJ2aWNlLCAkc3RhdGUpIHtcbiAgICAgICAgICAgIC8vUmVnaXN0ZXIgbW9kdWxlIGluIG1haW4gbWVudVxuICAgICAgICAgICAgdmFyIG1lbnVJdGVtID0ge1xuICAgICAgICAgICAgICAgIHBhdGg6ICdicm93c2UvTmF0aXZlUGF5bWVudE1ldGhvZHMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYSBmYS1jdWJlJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ05hdGl2ZVBheW1lbnRNZXRob2RzJyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogMTAwLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyAkc3RhdGUuZ28oJ3dvcmtzcGFjZS5OYXRpdmVQYXltZW50TWV0aG9kc1N0YXRlJyk7IH0sXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogJ05hdGl2ZVBheW1lbnRNZXRob2RzOmFjY2VzcydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtYWluTWVudVNlcnZpY2UuYWRkTWVudUl0ZW0obWVudUl0ZW0pO1xuICAgICAgICB9XG4gICAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnTmF0aXZlUGF5bWVudE1ldGhvZHMnKVxuICAgIC5jb250cm9sbGVyKCdOYXRpdmVQYXltZW50TWV0aG9kcy5oZWxsb1dvcmxkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ05hdGl2ZVBheW1lbnRNZXRob2RzLndlYkFwaScsIGZ1bmN0aW9uICgkc2NvcGUsIGFwaSkge1xuICAgICAgICB2YXIgYmxhZGUgPSAkc2NvcGUuYmxhZGU7XG4gICAgICAgIGJsYWRlLnRpdGxlID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzJztcblxuICAgICAgICBibGFkZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBpLmdldChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGJsYWRlLnRpdGxlID0gJ05hdGl2ZVBheW1lbnRNZXRob2RzLmJsYWRlcy5oZWxsby13b3JsZC50aXRsZSc7XG4gICAgICAgICAgICAgICAgYmxhZGUuZGF0YSA9IGRhdGEucmVzdWx0O1xuICAgICAgICAgICAgICAgIGJsYWRlLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYmxhZGUucmVmcmVzaCgpO1xuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdOYXRpdmVQYXltZW50TWV0aG9kcycpXG4gICAgLmZhY3RvcnkoJ05hdGl2ZVBheW1lbnRNZXRob2RzLndlYkFwaScsIFsnJHJlc291cmNlJywgZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKCdhcGkvTmF0aXZlUGF5bWVudE1ldGhvZHMnKTtcbn1dKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==