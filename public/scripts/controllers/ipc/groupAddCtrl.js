'use strick';

angular.module('ciApp').controller('groupAddCtrl', ['$scope', 'ServiceIpc', '$state', '$mdDialog', 'ServiceSetup', '$filter', function($scope, ServiceIpc, $state, $mdDialog, ServiceSetup, $filter){
        
        $scope.name = '';
        $scope.camera = '';
        $scope.ipcs = [];
        $scope.groups = [];
        
        $scope.submitGroup = function(){
            if($scope.decideNUll()){
                var param = {'name': $scope.name,'camera': $scope.camera};
                var promesa = ServiceIpc.setGroup(param, 'group');
                promesa.then(function(data){
                    if(data.status == 'OK'){
                        $scope.alert('Submit successfully');
                        $state.transitionTo('ipc.group');
                    }
                },function(error){
                    $scope.alert("Error " + error);
                });
            }
        };
        
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
        
        
        $scope.allgroup = function(){
            var promesa = ServiceIpc.getGroup('group');
            promesa.then(function(data){
		var text = '';
		if(data.status == 'OK'){
                    $scope.groups = data.data;
		}
            }
            ,function(error){
                alert("Error " + error);
            });
        };
        
        $scope.allgroup();
        
        $scope.decideNUll = function(){
            var result = true;
            if($scope.name == null||$scope.name == ""){
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
        
        $scope.repeat = function(){
            var result = true;
            var num = $scope.groups.length;
                for(var i=0;i<num;i++){
                    if($scope.groups[i].name == $scope.name){
                        result = false;
                    }
                }
            return result;
        }
        
        $scope.reload();
        
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


