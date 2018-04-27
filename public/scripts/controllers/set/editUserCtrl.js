'use strict';

angular.module('ciApp').controller('editUserCtrl', ['$scope', '$mdToast', '$filter', 'ServiceUser', '$stateParams', '$state', '$mdDialog', function($scope, $mdToast, $filter, ServiceUser, $stateParams, $state, $mdDialog){
        
        $scope.users_config = [];
        $scope.users = [];
        $scope.permissions = [];
        $scope.passwords = "";
        
        $scope.reload = function () {
            var promesa = ServiceUser.getUser('user');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.users_config = data.data;
                    $scope.users = $scope.users_config[0].users[$stateParams.id];
                    $scope.permissions = $scope.users_config[0].permissions;
                    $scope.passwords = $scope.users.userpassword;
                }
            },function(error){
                alert("Error " + error);
            });
        };
        
        $scope.reload();
        
        
        $scope.submitAction = function(){
            if($scope.decideNUll()){
                if($scope.repeat($scope.users_config[0].users)==false){
                    $scope.users_config[0].users[$stateParams.id] = $scope.users;
                    console.log("user edit:" + angular.toJson($scope.users_config, true));
                    var promesa = ServiceUser.setUser('user', $scope.users_config);
                    promesa.then(function(data){
                        var text = '';
                        if(data.status == 'OK'){
                            text = 'Submit successfully!';
                            $scope.alert(text);
                            $state.transitionTo('setup.user');
                        }else{
                            $scope.show('Failed');
                        }
                    });
                    //alert('OK');
                }else{
                    $scope.alert('用户名重复');
                }
            }
        };
        
        $scope.repeat = function(users){
            var num = users.length;
            var result = false;
            for(var i=0;i<num;i++){
                if($stateParams.id != i){
                    if($scope.users.username == users[i].username){
                        result =  true;
                    }
                }
            }
            return result;
        };
        
        $scope.decideNUll = function(){
            var result = true;
            if($scope.users.username == null||$scope.users.username == ""){
                $scope.alert('usernotnull');
                result = false;
            }else if($scope.users.userpassword == null||$scope.users.userpassword == ""){
                $scope.alert('userpwdnotnull');
                result = false;
            }else if($scope.users.permissionsid == null||$scope.users.permissionsid== ""){
                $scope.alert('userpermissionsid');
                result = false;
            }
            return result
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
        
        $scope.show = function(text){
            var last = 'bottom left';
            $mdToast.show(
                $mdToast.simple()
                .textContent($filter('translate')(text))
                .position(last)
                .hideDelay
            );
        };
        
}]);



