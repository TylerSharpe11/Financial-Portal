(function () {
    angular.module('app')
        // Path: /
        .controller('TransactionsController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', '$modal', 'ngTableParams', '$rootScope', '$filter', '$q', function ($scope, $state, $stateParams, accountService, localStorageService, $modal, ngTableParams, $rootscope, $filter, $q) {



            $q.all([
               accountService.getTransactionsForAccountId($stateParams.accountId)
            ])
          .then(function (values) {
              $scope.transactions = values[0].data;
              $scope.tableParams = new ngTableParams({
                  page: 1,            // show first page
                  count: 10,          // count per page
                  sorting: {
                      name: 'asc'     // initial sorting
                  }
              }, {
                  total: $scope.transactions.length, // length of data

                  getData: function ($defer, params) {
                      var filteredData = params.filter() ?
                    $filter('filter')($scope.transactions, params.filter()) :
                   $scope.transactions;
                      // use build-in angular filter
                      var orderedData = params.sorting() ?
                                          $filter('orderBy')($scope.transactions, params.orderBy()) :
                                          $scope.transactions;
                      params.total(orderedData.length); // set total for recalc pagination
                      $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });

          });



            $scope.accountid = $stateParams.accountId;



            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/CreateTransactionModal.html',
                    controller: 'ModalCreateTransactionCtrl',
                    size: 'lg',
                    resolve: {
                        accountid: function () {
                            return $scope.accountid;
                        }
                    }
                });
            };
            $scope.openEdit = function (t) {
                $scope.transaction = t;
                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/ModalEditTransaction.html',
                    controller: 'ModalEditTransactionCtrl',
                    size: 'lg',
                    resolve: {
                        transaction: function () {
                            return $scope.transaction;
                        }
                    }
                });
            };
            $scope.Delete = function (id) {
                accountService.DeleteTransaction(id).then(function (response) {
                    $state.go($state.current, {}, { reload: true });

                });
            }
            

        }])
})();
angular.module('app').controller('ModalCreateTransactionCtrl', function ($scope, $modalInstance, $state, accountService, accountid) {


    $scope.accountid = accountid;
    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};
    $scope.transaction = {};

    $scope.maketransactionandcategory = function () {
        accountService.maketransactionandcategory($scope.accountid, $scope.transaction.Amount, $scope.transaction.Description, $scope.transaction.categoryname).then(function (response) {
            $modalInstance.dismiss('cancel');
            $state.go($state.current, {}, { reload: true });
        });
    }

    $scope.maketransaction = function () {
        accountService.maketransaction($scope.accountid, $scope.transaction.Amount, $scope.transaction.Description, $scope.selectedCategory.Id).then(function (response) {
            $modalInstance.dismiss('cancel');
            $state.go($state.current, {}, { reload: true });
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('app').controller('ModalEditTransactionCtrl', function ($scope, $modalInstance, $state, accountService, transaction) {


    $scope.transaction = transaction;
    $scope.categories = accountService.getCategoriesForHousehold();
    $scope.selectedCategory = {};



    $scope.edittransaction = function () {
        $scope.transaction.CategoryId = $scope.selectedCategory.Id;
        accountService.EditTransaction($scope.transaction).then(function (response) {
            $modalInstance.dismiss('cancel');
            $state.go($state.current, {}, { reload: true });
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});