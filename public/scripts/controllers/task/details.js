'use strict';

angular.module('ciApp').controller('detailsCtrl',['$scope', 'ServiceTask', '$stateParams', function($scope, ServiceTask, $stateParams){
        var taskNum = $stateParams.id;
        var taskType = $stateParams.type;
        
        $scope.detailsValue = [];
        
        $scope.details = function(){
            var param = {'taskNum':taskNum, 'taskType':taskType};
            var promesa = ServiceTask.getDetails("details", param);
            promesa.then(function(data){
                if(data.status == 'OK'){
                    //$scope.dateTime(data.message);
                    $scope.detailsValue =data.message;
                    //console.log("Submit "+data.message);
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        };
        
        $scope.details();
        
}]);
    

