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
