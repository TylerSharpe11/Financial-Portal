(function () {
    'use strict';
    angular.module('app').factory('accountService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

        var serviceBase = '/';
        var accountServiceFactory = {};
        accountServiceFactory.accounts = {};
        var _makeaccount = function (name, balance, rbalance) {
            var household = localStorageService.get('household');
            return $http.post('/api/FinancialAccount/InsertAccount?household='+household+'&name='+name+'&balance='+balance+'&rbalance='+rbalance).then(function (response) {
                return response;
            });

        };
        var clean=function cleanArray(actual) {
            var newArray = new Array();
            for (var i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
        }

        
        accountServiceFactory.FindTransactionsbyHousehold = function () {
            return $http.post('/api/Transaction/FindTransactionsbyHousehold?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.maketransaction = function (accountid, amount, description, categoryid) {
            return $http.post('/api/Transaction/InsertTransaction?accountid=' + accountid+'&amount='+amount+'&description='+description+'&categoryid='+categoryid).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.maketransactionandcategory = function (accountid, amount, description, categoryname) {
            return $http.post('/api/Transaction/InsertTransactionAndCategory?accountid=' + accountid +'&household='+localStorageService.get('household')+ '&amount=' + amount + '&description=' + description + '&categoryname=' + categoryname).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.getAccountsFromDB= function () {
            return $http.post('/api/FinancialAccount/AccountsFromHousehold?Household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.getTransactionsForAccountId = function (accountid) {
            return $http.post('/api/Transaction/FindTransactionsbyAccountId?accountid=' + accountid).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.getCategoriesForHousehold = function () {
            return $http.post('/api/Transaction/FindCategoriesByHousehold?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }

        accountServiceFactory.FindBudgetItemsByHousehold = function () {
            return $http.post('/api/Transaction/FindBudgetItemsByHousehold?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.FindRecentTransactions = function () {
            return $http.post('/api/Transaction/FindRecentTransactions?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        
        accountServiceFactory.FindExpensesByHousehold = function () {
            return $http.post('/api/Transaction/FindExpensesByHousehold?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.FindIncomeByHousehold = function () {
            return $http.post('/api/Transaction/FindIncomeByHousehold?household=' + localStorageService.get('household')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.InsertBudgetItemAndCategory = function (amount, annualfrequency, categoryname) {
            return $http.post('/api/Transaction/InsertBudgetItemAndCategory?household=' + localStorageService.get('household') + '&amount=' + amount  +'&annualfrequency=' + annualfrequency + '&categoryname=' + categoryname).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.InsertBudgetItem = function (amount, annualfrequency, categoryid) {
            return $http.post('/api/Transaction/InsertBudgetItem?household=' + localStorageService.get('household') + '&amount=' + amount +'&annualfrequency='+annualfrequency+ '&categoryid=' + categoryid).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.InsertInvite = function (email) {
            return $http.post('/api/Transaction/InsertInvite?household=' + localStorageService.get('household') +'&userid=' + localStorageService.get('userid') + '&email=' + email).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.seeInvite = function () {
            var authData = localStorageService.get('authorizationData');
            var email = authData.username;
            return $http.post('/api/Transaction/seeInvite?email=' + email).then(function (response) {
                return response;
            });
        }
        
        accountServiceFactory.AcceptInvite = function (id) {
            return $http.post('/api/Transaction/AcceptInvite?id=' + id).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.DeclineInvite = function (id) {
            return $http.post('/api/Transaction/DeclineInvite?id=' + id).then(function (response) {
                return response;
            });
        }
        
        accountServiceFactory.EditBudgetItem = function (budgetitem) {
            return $http.post('/api/Transaction/UpdateBudgetItem?budgetitem=' + budgetitem).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.EditAccount = function (account) {
            return $http.post('/api/FinancialAccount/UpdateAccount?account=' + account).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.EditTransaction = function (transaction) {
            return $http.post('/api/Transaction/UpdateTransaction?transaction=' + transaction + '&userid=' + localStorageService.get('userid')).then(function (response) {
                return response;
            });
        }
        accountServiceFactory.AssignHousehold = function (household) {
            return $http.post('/api/account/AssignHousehold?household=' + household).then(function (response) {
                return response;
            });
        };
        accountServiceFactory.LeaveHousehold = function (household) {
            return $http.post('/api/account/LeaveHousehold?userid=' + localStorageService.get('userid')).then(function (response) {
                return response;
            });
        };
        accountServiceFactory.DeleteTransaction = function (id) {
            return $http.post('/api/Transaction/DTransaction?id=' + id).then(function (response) {
                return response;
            });
        };
        accountServiceFactory.DeleteBudgetItem = function (id) {
            return $http.post('/api/Transaction/DBudgetItem?id=' + id).then(function (response) {
                return response;
            });
        };
        accountServiceFactory.DeleteAccount = function (id) {
            return $http.post('/api/FinancialAccount/DAccount?id=' + id).then(function (response) {
                return response;
            });
        };
        accountServiceFactory.setRootScope = function () {
            $rootScope.expenses = accountService.FindExpensesByHousehold();
            $rootScope.income = accountService.FindIncomeByHousehold();
            $rootScope.accounts = accountService.getAccountsFromDB();
            $rootScope.recentTransactions = accountService.FindRecentTransactions();
        };
        
        accountServiceFactory.setAccounts = function () {
            accountServiceFactory.accounts = accountServiceFactory.getAccountsFromDB();
        }
        
        accountServiceFactory.makeaccount = _makeaccount;


        return accountServiceFactory;
    }]);


})();