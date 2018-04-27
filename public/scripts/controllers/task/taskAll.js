'use strict';

angular.module('ciApp')
 .controller('taskAllCtrl',['$scope', 'ServiceTask', function($scope, ServiceTask){
         $scope.task = {
             'all':'45',
             'complete':'15',
             'completeError':'10',
             'error':'5',
             'new':'5',
             'running':'5',
             'wait':'5',
         };
         
         $scope.tasks = function(){
             var promesa = ServiceTask.getTask('taskAll');
             promesa.then(function(data){
                 if(data.status == 'OK'){
                     $scope.task.all = data.allNum;
                     $scope.task.complete = data.completeNum;
                     $scope.task.completeError = data.completeErrorNum;
                     $scope.task.error = data.errorNum;
                     $scope.task.new = data.newNum;
                     $scope.task.running = data.runningNum;
                     $scope.task.wait = data.waitNum;
                 }
             },function(error){
                 console.log("Submit Error "+error);
             });
         }
         $scope.tasks();
}]);

