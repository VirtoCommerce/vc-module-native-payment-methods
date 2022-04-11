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
