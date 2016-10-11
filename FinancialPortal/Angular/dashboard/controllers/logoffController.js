(function () {
    angular.module('app')
        // Path: /
        .controller('UserAccountsController', ['$scope', '$state', '$stateParams', 'authService', 'localStorageService', '$modal', 'accountService', 'q', function ($scope, $state, $stateParams, authService, localStorageService, $modal, accountService, q) {
            $q.all([
               authService.logout($stateParams.accountId)
            ])
          .then(function (values) {
              $state.go('login');

             
          });

        }])
})();

