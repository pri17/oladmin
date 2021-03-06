'use strick';

angular.module('ciApp').controller('waitCtrl', ['$scope', 'ServiceTask' , function($scope, ServiceTask){
        $scope.value=[];
        $scope.taskAll = function(){
            var promesa = ServiceTask.getTaskWait('taskWait');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    if(data.task != null && data.task != "" ){
                        $scope.value = data.task;
                    }
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        };
        
        $scope.taskAll();
        
        //-------- 分页(page) ----------
        $scope.itemsPerPageOptions=[10, 20, 50, 100];
        $scope.itemsPerPage=20;
        $scope.totalPage=1;
        $scope.pageNumOptions = [];
        $scope.currentPage = 1;
        
        
       $scope.value=[];
        $scope.taskWait = function(){
           var promesa = ServiceTask.getTaskWait('taskWait');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    if(data.task != null && data.task != "" ){
                        $scope.value = data.task;
                    }
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        };
        
        $scope.taskWait();
        
        $scope.$watchGroup(['itemsPerPage', 'value'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.value.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
        }, true);
        
        $scope.previousPage = function() {
    	$scope.currentPage --;
        };
    
        $scope.nextPage = function (){
    	$scope.currentPage ++;
        }
        
}]);



