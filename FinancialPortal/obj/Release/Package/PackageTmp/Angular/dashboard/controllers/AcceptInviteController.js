(function () {
    angular.module('app')
        // Path: /
        .controller('AcceptInviteController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', function ($scope, $state, $stateParams, accountService, localStorageService) {
            $scope.hash = $stateParams.hash;
            $scope.id = $stateParams.id;

            $scope.errormessage = '';

            $scope.acceptinvite = function () {
                accountService.AcceptInvite($scope.hash, $scope.id).then(function (response) {
                    var h = response.data;
                    accountService.AssignHousehold(h);

                });
            }

        }])
})();