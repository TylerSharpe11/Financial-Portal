



angular.module('app').controller("ChartController", ['$scope', 'accountService', '$rootScope', function ($scope, accountService, $rootScope) {
        $scope.chartObject = {};
        $scope.expenses = $rootScope.expenses.$$state.value.data

        $scope.income = $rootScope.income.$$state.value.data;
        $scope.onions = [
            { v: "Onions" },
            { v: 3 },
        ];
        $scope.processArray= function(json) {
            var chartData = [];
            for(var i=0; i<json.length;i++) {
                chartData.push({
                    c: [{ v: json[i].Category.Name },
                { v: json[i].Amount}]});
            }
            return chartData;
        }
        
        $scope.incomeData = $scope.processArray($scope.income);

        $scope.expenseData = $scope.processArray($scope.expenses);
        $scope.chartObject.data =  {
                "cols": [
                   { label: "Category", type: "string" },
                   { label: "Amount", type: "number" }
                ], "rows": $scope.incomeData
        };
        $scope.chartObject.type = "PieChart";
        $scope.chartObject.options = {
            'title': 'Expenses'
        }
}]);