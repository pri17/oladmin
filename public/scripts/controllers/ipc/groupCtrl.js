'use strick'

angular.module('ciApp').controller('groupCtrl', ['$scope', 'ServiceIpc', '$state', function($scope, ServiceIpc, $state){
        
        $scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
        
        $scope.groups = [];
        
        $scope.$watchGroup(['itemsPerPage', 'groups'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.groups.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
        
        
        $scope.reload = function () {
		var promesa = ServiceIpc.getGroup('group');
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.groups = data.data;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	}
	
	$scope.reload();
        
        $scope.add = function(){
		$state.transitionTo('ipc.groupadd');
	};
	
	$scope.edit = function(item){
	    var idx = $scope.groups.indexOf(item);
            $state.transitionTo('ipc.groupedit', {'id': idx});
	};
        
        $scope.del = function(group, ev) {
            //alert(user.id);
            var param = {'id':group.id};
            var promesa = ServiceIpc.delGroup('group', param);
            promesa.then(function(data){
                if(data.status == 'OK'){
                    alert('successfully!');
                    var idx = $scope.groups.indexOf(group);
                    $scope.groups.splice(idx, 1);
                }
		
            });
            
//            var idx = $scope.users.indexOf(user);
//	        $scope.users.splice(idx, 1);
            
            
        };
        
        
        $scope.previousPage = function() {
            $scope.currentPage --;
        };

        $scope.nextPage = function (){
            $scope.currentPage ++;
        }
        
}]);


