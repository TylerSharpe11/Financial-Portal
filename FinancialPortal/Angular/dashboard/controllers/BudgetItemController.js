(function () {
    angular.module('app')
        // Path: /
        .controller('BudgetItemController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', '$modal', '$filter', 'ngTableParams', '$rootScope', function ($scope, $state, $stateParams, accountService, localStorageService, $modal, $filter, ngTableParams, $rootScope) {
            $scope.expenses = $rootScope.expenses;
            $scope.income = $rootScope.income;
            $scope.budgetitem = {};
            $scope.editbudgetitem = {};

            $scope.EtableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    Amount: 'asc'     // initial sorting
                }
            }, {
                total: $scope.expenses.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.expenses, params.orderBy()) :
                                        $scope.expenses;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.ItableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    Amount: 'asc'     // initial sorting
                }
            }, {
                total: $scope.income.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.income, params.orderBy()) :
                                        $scope.income;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.FindExpensesByHousehold = function () {
                accountService.FindExpensesByHousehold().then(function (response) {
                    return response;
                });
            }
            $scope.FindIncomeByHousehold = function () {
                accountService.FindIncomeByHousehold().then(function (response) {
                    return response;
                });
            }

            $scope.openIncome = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/CreateBudgetItemIncomeModal.html',
                    controller: 'ModalCreateBudgetItemIncomeCtrl',
                    size: 'lg',
                });
            };
            $scope.openEditExpense = function (b) {
                $scope.editbudgetitem = b;
                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/EditBudgetItemModal.html',
                    controller: 'ModalEditBudgetItemExpenseCtrl',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return $scope.editbudgetitem;
                        }
                    }
                });
            };
            $scope.Delete = function (id) {
                accountService.DeleteBudgetItem(id).then(function (response) {
                    $state.go($state.current, {}, { reload: true });

                });
            }
            $scope.openEditIncome = function (b) {
                $scope.editbudgetitem = b;
                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/EditBudgetItemModal.html',
                    controller: 'ModalEditBudgetItemIncomeCtrl',
                    size: 'lg',
                    resolve: {
                        item: function () {
                            return $scope.editbudgetitem;
                        }
                    }
                });
            };
            $scope.openExpense = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/CreateBudgetItemExpenseModal.html',
                    controller: 'ModalCreateBudgetItemExpenseCtrl',
                    size: 'lg',
                });
            };
        }])
})();

angular.module('app').controller('ModalCreateBudgetItemIncomeCtrl', function ($scope, $modalInstance, $state, accountService, $rootScope) {


    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};
    $scope.budgetitem = {};

    $scope.InsertBudgetItemAndCategory = function () {
        if ($scope.budgetitem.Amount < 0) {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        accountService.InsertBudgetItemAndCategory($scope.budgetitem.Amount, $scope.budgetitem.AnnualFrequency, $scope.budgetitem.categoryname).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.income = accountService.FindIncomeByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.InsertBudgetItem = function () {
        if ($scope.budgetitem.Amount < 0) {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        accountService.InsertBudgetItem($scope.budgetitem.Amount, $scope.budgetitem.AnnualFrequency, $scope.selectedCategory.Id).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.income = accountService.FindIncomeByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
angular.module('app').controller('ModalCreateBudgetItemExpenseCtrl', function ($scope, $modalInstance, $state, accountService, $rootScope) {


    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};
    $scope.budgetitem = {};

    $scope.InsertBudgetItemAndCategory = function () {
        if ($scope.budgetitem.Amount > 0) {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        accountService.InsertBudgetItemAndCategory($scope.budgetitem.Amount, $scope.budgetitem.AnnualFrequency, $scope.budgetitem.categoryname).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.expenses = accountService.FindExpensesByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.InsertBudgetItem = function () {
        if ($scope.budgetitem.Amount > 0) {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        accountService.InsertBudgetItem($scope.budgetitem.Amount, $scope.budgetitem.AnnualFrequency, $scope.selectedCategory.Id).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.expenses = accountService.FindExpensesByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('app').controller('ModalEditBudgetItemExpenseCtrl', function ($scope, $modalInstance, $state, accountService, item, $rootScope) {

    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};
    $scope.budgetitem = item;

    $scope.EditBudgetItem = function () {
        if ($scope.budgetitem.Amount > 0)
        {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        accountService.EditBudgetItem($scope.budgetitem).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.expenses = accountService.FindExpensesByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
angular.module('app').controller('ModalEditBudgetItemIncomeCtrl', function ($scope, $modalInstance, $state, accountService, item, $rootScope) {

    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};
    $scope.budgetitem = item;

    $scope.EditBudgetItem = function () {
        if ($scope.budgetitem.Amount < 0) {
            $scope.budgetitem.Amount = $scope.budgetitem.Amount * -1;
        }
        $scope.budgetitem.CategoryId = $scope.selectedCategory.Id;
        accountService.EditBudgetItem($scope.budgetitem).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.income = accountService.FindIncomeByHousehold();
            $state.go('dashboard');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
