'use strick';

angular.module('ciApp').controller('groupEditCtrl', ['$scope', 'ServiceIpc', '$mdDialog', 'ServiceSetup', '$state', '$stateParams', '$filter', function($scope, ServiceIpc, $mdDialog, ServiceSetup, $state, $stateParams, $filter){
        $scope.groups = [];
        //$scope.group = [];
        $scope.ipcs = [];
        $scope.model = [];
        
        $scope.submitGroup = function(){
            //var param = {'name': $scope.name,'camera': $scope.camera};
            if($scope.decideNUll()){
                var promesa = ServiceIpc.editGroup('group', $scope.groups);
                promesa.then(function(data){
                    if(data.status == 'OK'){
                        $scope.alert('Submit successfully');
                        $state.transitionTo('ipc.group');
                    }
                },function(error){
                    $scope.alert('Failed');
                });
            }
        };
        
        
        $scope.modelGroup = function(){
            var promesa = ServiceIpc.getModelGroup('group');
            promesa.then(function(data){
                $scope.model = data.data;
                $scope.groups = $scope.model[$stateParams.id];
            },function(error){
                console.log("Submit Error "+error);
            });
        }
        
        $scope.modelGroup();
        
        $scope.reload = function(){
            var promesa = ServiceSetup.getConfig('ipc');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.ipcs = data.data;
		}
            },function(error){
                console.log("Submit Error "+error);
            });
        };
        
        $scope.reload();
        
        $scope.decideNUll = function(){
            var result = true;
            if($scope.groups.name == null||$scope.groups.name == ""){
                $scope.alert('group name not null');
                result = false;
            }else{
                if($scope.repeat()==false){
                    $scope.alert('组名重复');
                    result = false;
                }
            }
            return result;
        }
        
        $scope.repeat = function(users){
            var result = true;
            var num = $scope.model.length;
            for(var i=0;i<num;i++){
                if($stateParams.id != i){
                    if($scope.model[i].name == $scope.groups.name){
                        result =  false;
                    }
                 }
            }
            return result;
        };
        
        
        
        $scope.alert = function(text){
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent($filter('translate')(text))
                    .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
            );
        
        };
        
}]);


