angular.module('NativePaymentMethods')
    .controller('NativePaymentMethods.paymentDetailsLogoController', ['$scope', 'FileUploader', 'platformWebApp.bladeNavigationService', 'platformWebApp.dialogService',
        function($scope, FileUploader, bladeNavigationService, dialogService){
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
                            const approval = /^.*\.(png|jpg|svg)$/.test(item.name.toLowerCase());
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
