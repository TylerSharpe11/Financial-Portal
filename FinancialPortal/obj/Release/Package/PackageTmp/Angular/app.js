(function () {
    angular.module('app', ['ui.router', 'ui.bootstrap', 'LocalStorageModule', 'tableSort', 'ngTable', 'googlechart'])
        .config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
            // UI States, URL Routing & Mapping. For more info see: https://github.com/angular-ui/ui-router
            // ------------------------------------------------------------------------------------------------------------


            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: '/Angular/dashboard/views/dashboard.html',
                    controller: "dashboardController",

                   })
            $stateProvider
                .state('register', {
                    url: '/register',
                    templateUrl: '/Angular/dashboard/views/register.html',

                })

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: '/Angular/dashboard/views/login.html',

                })
            $stateProvider
                .state('mybudget', {
                    url: '/mybudget',
                    templateUrl: '/Angular/dashboard/views/mybudget.html',
                    controller: 'BudgetItemController',

                })
            $stateProvider
                .state('accounts', {
                    url: '/accounts',
                    templateUrl: '/Angular/dashboard/views/accounts.html',
                })
            $stateProvider
                .state('transactions', {
                    url: '/transactions/:accountId',
                    templateUrl: '/Angular/dashboard/views/transactions.html',
                    controller: 'TransactionsController'

                })

            $stateProvider
                .state('household', {
                    url: '/household',
                    templateUrl: '/Angular/dashboard/views/Household.html',

                })
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });


        }])

    // Gets executed after the injector is created and are used to kickstart the application. Only instances and constants
    // can be injected here. This is to prevent further system configuration during application run time.
    .run(['$templateCache', '$rootScope', '$state', '$stateParams', 'authService', function ($templateCache, $rootScope, $state, $stateParams, authService) {
        // Allows to retrieve UI Router state information from inside templates
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;


    }]);
})();
