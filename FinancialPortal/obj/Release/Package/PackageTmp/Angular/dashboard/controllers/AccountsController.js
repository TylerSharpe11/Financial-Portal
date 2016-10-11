(function () {
    angular.module('app')
        // Path: /
        .controller('AccountsController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', '$modal', '$rootScope', 'ngTableParams', '$filter', function ($scope, $state, $stateParams, accountService, localStorageService, $modal, $rootScope, ngTableParams, $filter) {
            $scope.faccounts = $rootScope.accounts;
            $scope.errormessage = '';
            $scope.faccount = Object;
            $scope.account = {};


            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    Name: 'asc'     // initial sorting
                }
            }, {
                total: $scope.faccounts.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.faccounts, params.orderBy()) :
                                        $scope.faccounts;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.account.household = localStorageService.get('household');
            
            $scope.goToTransaction = function (id) {
                $state.go('transactions', { 'accountId':id });
            }
            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/CreateAccountModal.html',
                    controller: 'ModalCreateAccountCtrl',
                    size: 'lg',
                });
            };


            $scope.Delete = function (id) {
                accountService.DeleteAccount(id).then(function (response) {
                    $state.go('dashboard');

                });
            }

        }])
})();

angular.module('app').controller('ModalCreateAccountCtrl', function ($scope, $modalInstance, $state, accountService, $rootScope) {


    $scope.account = {};
    $scope.makeaccount = function () {
        accountService.makeaccount($scope.account.Name, $scope.account.Balance, $scope.account.ReconciledBalance).then(function (response) {
            $modalInstance.dismiss('cancel');
            $rootScope.accounts = accountService.getAccountsFromDB();
            $state.go('dashboard');
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});