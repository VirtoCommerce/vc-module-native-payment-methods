angular.module('NativePaymentMethods')
    .factory('NativePaymentMethods.webApi', ['$resource', function ($resource) {
        return $resource('api/native-payment-methods', {
                delete: { method: 'DELETE', url: 'api/native-payment-method' }
            });
    }]);
