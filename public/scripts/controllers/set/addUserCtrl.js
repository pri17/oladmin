'use strict';

angular.module('ciApp').controller('addUserCtrl', ['$scope', '$mdToast', '$filter', 'ServiceUser', '$state', '$mdDialog', function($scope, $mdToast, $filter, ServiceUser, $state, $mdDialog){
        
        $scope.users_config = [];
        $scope.user = {};
        $scope.user_item = {"username": "", "userpassword": "", "userphone": "", "usermail": 1, "permissionsid": []};
        $scope.users = [];
        $scope.permissions = [];
        
        $scope.reload = function () {
            var promesa = ServiceUser.getUser('user');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.users_config = data.data;
                    $scope.users = $scope.users_config[0].users;
                    $scope.permissions = $scope.users_config[0].permissions;
                }
            },function(error){
                alert("Error " + error);
            });
          
        };
        
        $scope.reload();
        
        $scope.addAction = function(){
            if($scope.decideNUll()){
                $scope.user_item.username = $scope.user.name;
                $scope.user_item.userpassword = $scope.user.password;
                $scope.user_item.userphone = $scope.user.phone;
                $scope.user_item.usermail = $scope.user.mail;
                $scope.user_item.permissionsid = $scope.user.permissionsid;
                if($scope.repeat($scope.user.name)==false){
                    $scope.users_config[0].users.push($scope.user_item);
                    var promesa = ServiceUser.setUser('user', $scope.users_config);
                    promesa.then(function(data){
                        var text = '';
                        if(data.status == 'OK'){
                                $scope.show('Submit successfully!');
                                $state.transitionTo('setup.user');
                        }else{
                            $scope.reload();
                            $scope.show('Failed');
                        }

                        console.log(text);
                     },function(error){
                        alert("Error " + error);
                    });
                }else{
                   $scope.alert('用户名重复');
                }
            }
        };
        
        
        $scope.repeat = function(name){
            var num = $scope.users.length;
            var result = false;
            for(var i=0;i<num;i++){
                if($scope.users[i].username == name){
                    result =  true;
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
        
        $scope.decideNUll = function(){
            var result = true;
            if($scope.user.name == null||$scope.user.name == ""){
                $scope.alert('usernotnull');
                result = false;
            }else if($scope.user.password == null||$scope.user.password == ""){
                $scope.alert('userpwdnotnull');
                result = false;
            }else if($scope.user.permissionsid == null||$scope.user.permissionsid == ""){
                $scope.alert('userpermissionsid');
                result = false;
            }
            return result
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



