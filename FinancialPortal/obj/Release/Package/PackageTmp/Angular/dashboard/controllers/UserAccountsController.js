(function () {
    angular.module('app')
        // Path: /
        .controller('UserAccountsController', ['$scope', '$state', '$stateParams', 'authService', 'localStorageService', '$modal', 'accountService', '$rootScope', function ($scope, $state, $stateParams, authService, localStorageService, $modal, accountService, $rootScope) {
            $scope.user = {};
            $scope.errormessage = '';
            $scope.token = {};


            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/Angular/dashboard/views/RegisterModal.html',
                    controller: 'ModalRegisterCtrl',
                    size: 'lg',
                });
            };
            $scope.login = function () {
                authService.login($scope.user).then(function (response) {
                    if (response.userName == $scope.user.userName) {
                        $rootScope.user = $scope.user;
                        $scope.token.ExternalAccessToken = response.access_token;
                        authService.getUserFromEmail($scope.user.userName).then(function (response) {
                            authService.setUser(response);
                            authService.setCookie();
                        });
                        

                       
                        
                    }
                    else {
                        $scope.errormessage = response.error_description;
                    }
                    $state.go('dashboard');
                    return response;
                });
            }
            $scope.addLogin = function () {
                authService.addLogin($scope.token).then(function (response) {
                    if (response.statusText == "OK") {
                        $state.go('dashboard')
                    }
                    else {
                        $scope.errormessage = response;
                    }
                });
            }
        }])
})();

angular.module('app').controller('ModalRegisterCtrl', function ($scope, $modalInstance, $state, authService) {


    $scope.user = {};

    $scope.register = function () {
        authService.register($scope.user).then(function (response) {
            $state.go('dashboard');

        });
    }

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $state.go($state.current, {}, { reload: true });
    };
});