'use strict';

angular.module('ciApp').controller('ipcEditCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$state', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $state){

    $scope.ipcs_config = [];
    $scope.ipc = {};
	$scope.reload = function () {
		var promesa = ServiceSetup.getConfig('ipc');
		//var promesa = ServiceCheckins.getBatchByIndex('studentno','*', 100, '');
	
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs_config = data.data;
				var ipc = $scope.ipcs_config[$stateParams.id];
				if(angular.isArray(ipc.uri))
				    ipc.uri = ipc.uri[0];
				$scope.ipc = ipc;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	};
	
	$scope.reload();

	//toast
	var last = 'bottom left';
    
    
	$scope.submitAction = function() {
		console.log("ipc edit:" + angular.toJson($scope.ipc, true));
		var promesa = ServiceSetup.setConfig('ipc', $scope.ipcs_config);
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				text = 'Submit successfully!';
				$state.transitionTo('ipc.manage');
			}
			else
			{
				text = 'Failed';
				$mdToast.show(
		        $mdToast.simple()
		        .textContent($filter('translate')(text))
		        .position(last)
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
}]);

