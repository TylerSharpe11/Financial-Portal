(function () {
    angular.module('app')
        // Path: /
        .controller('dashboardController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', '$rootScope', '$q', function ($scope, $state, $stateParams, accountService, localStorageService, $rootScope, $q) {





            $q.all([
                accountService.getAccountsFromDB(), accountService.FindRecentTransactions(), accountService.FindExpensesByHousehold(), accountService.FindIncomeByHousehold(), accountService.FindTransactionsbyHousehold(), accountService.seeInvite()
            ])
            .then(function (values) {
                $scope.accounts = values[0].data;
                $scope.recentTransactions = values[1].data;
                $scope.expenses = values[2].data;
                $scope.income = values[3].data;
                $scope.transactions = values[4].data;
                $scope.seeinvite = values[5].data;


                $rootScope.accounts = $scope.accounts;
                $rootScope.recentTransactions = $scope.recentTransactions;
                $rootScope.transactions = $scope.transactions;

                $rootScope.expenses = $scope.expenses;
                $rootScope.income = $scope.income;
                $scope.incomeData = $scope.processArray($scope.income);
                $scope.transactionsData = $scope.processArrayTransactions($scope.transactions);

                $scope.expenseData = $scope.processArray($scope.expenses);
                $scope.chartdata = $scope.expenseData.concat($scope.transactionsData);

                $scope.chartObject.data = {
                    "cols": [
                       { label: "Category", type: "string" },
                       { label: "Amount", type: "number" }
                    ], "rows": $scope.incomeData
                };
                $scope.chartObjectExpense.data = {
                    "cols": [
                       { label: "Category", type: "string" },
                       { label: "Amount", type: "number" }
                    ], "rows": $scope.chartdata 
                };
            });
        $scope.chartObject = {};
        $scope.chartObjectExpense = {};
         
        
        
        

        $scope.processArray= function(json) {
            var chartData = [];
            for (var i = 0; i < json.length; i++) {

                json[i].Amount = json[i].Amount * json[i].AnnualFrequency;
                chartData.push({
                    c: [{ v: json[i].Category.Name },
                { v: json[i].Amount}]});
            }
            return chartData;
        }
        $scope.processArrayTransactions = function (json) {
            var chartData = [];
            for (var i = 0; i < json.length; i++) {

                json[i].Amount = json[i].Amount;
                chartData.push({
                    c: [{ v: json[i].Category.Name },
                { v: json[i].Amount }]
                });
            }
            return chartData;
        }
        
       
        $scope.chartObjectExpense.type = "ColumnChart";
        $scope.chartObjectExpense.cssStyle = "border:1px inset black;padding:0;display:inline-block;width:400px;";
        $scope.chartObjectExpense.options = {
            "title": "Expenses",
        };
        $scope.chartObject.type = "ColumnChart";
        $scope.chartObject.cssStyle = "border:1px inset black;padding:0;display: inline-block;width:400px";
        $scope.chartObject.options = {
            "title": "Income",
        };

}]);
            
})();