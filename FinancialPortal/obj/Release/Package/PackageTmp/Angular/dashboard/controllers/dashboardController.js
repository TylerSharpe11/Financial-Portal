(function () {
    angular.module('app')
        // Path: /
        .controller('dashboardController', ['$scope', '$state', '$stateParams', 'accountService', 'localStorageService', '$rootScope', '$q', function ($scope, $state, $stateParams, accountService, localStorageService, $rootScope, $q) {





            $q.all([
                accountService.getAccountsFromDB(), accountService.FindRecentTransactions(), accountService.FindExpensesByHousehold(), accountService.FindIncomeByHousehold()
            ])
            .then(function (values) {
                $scope.accounts = values[0].data;
                $scope.recentTransactions = values[1].data;
                $scope.expenses = values[2].data;
                $scope.income = values[3].data;
                $rootScope.accounts = $scope.accounts;
                $rootScope.recentTransactions = $scope.recentTransactions;
                $rootScope.expenses = $scope.expenses;
                $rootScope.income = $scope.income;
                $scope.incomeData = $scope.processArray($scope.income);

                $scope.expenseData = $scope.processArray($scope.expenses);
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
                    ], "rows": $scope.expenseData
                };
            });
        $scope.chartObject = {};
        $scope.chartObjectExpense = {};
         
        
        
        

        $scope.processArray= function(json) {
            var chartData = [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].Amount < 0)
                {
                    json[i].Amount = json[i].Amount * -1;
                }
                json[i].Amount = json[i].Amount * json[i].AnnualFrequency;
                chartData.push({
                    c: [{ v: json[i].Category.Name },
                { v: json[i].Amount}]});
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