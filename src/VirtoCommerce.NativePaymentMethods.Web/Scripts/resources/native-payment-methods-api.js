angular.module('NativePaymentMethods')
    .factory('NativePaymentMethods.webApi', ['$resource', function ($resource){
        return $resource('api/native-payment-methods', {}, {
            delete: { method: 'DELETE', url: 'api/native-payment-methods' },
            getById: { method: 'GET', url: 'api/native-payment-methods/:id' },
            save: { method: 'POST', url: 'api/native-payment-methods' }
        });
    }]);
