(function () {
    angular.module('app')
        // Path: /
        .controller('HouseholdController', ['$scope', '$state', '$stateParams', 'accountService', 'authService', 'localStorageService', '$rootScope', '$q', function ($scope, $state, $stateParams, accountService, authService, localStorageService, $rootScope, $q) {


            $q.all([
              accountService.seeInvite($rootScope.user.userName)
            ])
          .then(function (values) {
              $scope.availableinvite = values[0].data;

          });


            $scope.usersInHousehold = authService.GetUsersForHousehold();
            $scope.errormessage = '';
            $scope.userid = localStorageService.get('userid');
            $scope.user = {};
            $scope.accept = function () {
                accountService.AcceptInvite().then(function (response) {
                    authService.logout();
                });
            }
            $scope.decline = function () {
                accountService.DeclineInvite().then(function (response) {
                    authService.logout();
                });
            }
            $scope.leaveHousehold = function () {
                accountService.LeaveHousehold().then(function (response) {
                    $state.go($state.current, {}, { reload: true });
                });
            }

            $scope.invite = function () {
                accountService.InsertInvite($scope.user.email).then(function (response) {
                    var h = response.data;
                    localStorageService.set('household', h);
                    $state.go($state.current, {}, { reload: true });
                });
            }

        }])
})();