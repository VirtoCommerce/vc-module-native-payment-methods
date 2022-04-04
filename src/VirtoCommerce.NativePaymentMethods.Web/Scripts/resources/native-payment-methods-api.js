angular.module('NativePaymentMethods')
    .factory('NativePaymentMethods.webApi', ['$resource', function ($resource) {
        return $resource('api/NativePaymentMethods');
}]);
