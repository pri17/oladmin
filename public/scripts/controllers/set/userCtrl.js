'use strick';

angular.module('ciApp').controller('userCtrl', ['$scope', 'ServiceUser', '$state', '$mdDialog', '$mdToast', '$filter', function($scope, ServiceUser, $state, $mdDialog, $mdToast, $filter){
        
        $scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
	
        $scope.users = [];
        $scope.users_config = [];
	
	$scope.$watchGroup(['itemsPerPage', 'users'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.users.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
	
	$scope.reload = function () {
		var promesa = ServiceUser.getUserModel('user');//var promesa = ServiceUser.getUserModel('user');
	
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.users_config = data.data;
                                $scope.users = $scope.users_config[0].users;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	}
	
	$scope.reload();
	
	$scope.add = function(){
		$state.transitionTo('setup.addUser');
	};
	
	$scope.edit = function(item){
	    var idx = $scope.users.indexOf(item);
            $state.transitionTo('setup.editUser', {'id': idx});
	};

    
	$scope.del = function(user, ev) {
		console.log("user del:" + angular.toJson(user, true));
		var confirm = $mdDialog.confirm()
                    .title($filter('translate')('Would you like to delete the item?'))
                    .textContent(' ')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok($filter('translate')('OK'))
                    .cancel($filter('translate')('No!'));
                $mdDialog.show(confirm).then(function() {
	        var idx = $scope.users.indexOf(user);
	        $scope.users.splice(idx, 1);
	        
	      	$scope.save();
			
	    }, function() {
	      console.log("You cancel the deletion operation!");
	    });
		
	};
	
	
	$scope.save = function() {
            
            $scope.users_config[0].users = $scope.users;
	    var promesa = ServiceUser.setUserModel('user', $scope.users_config);
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				text = 'Save successfully!';
			}
			else
			{
                            text = 'Failed';
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent($filter('translate')(text))
                                .position('bottom left')
                                .hideDelay
                                );
			}
		
			
			console.log(text);
		}
		,function(error)
		{
			alert("Error " + error);
		});  
	};
	
    $scope.previousPage = function() {
    	$scope.currentPage --;
    };
    
    $scope.nextPage = function (){
    	$scope.currentPage ++;
    }
    
    $scope.addScan = function(){
        $state.transitionTo('resource.canva');
    };
        
}]);




