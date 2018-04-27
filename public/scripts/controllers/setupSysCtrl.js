'use strict';

angular.module('ciApp').controller('setupSysCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$interval', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $interval){

    $scope.action = {
        'progress': 0,
        'done': 1,
    };
	
	//toast
	var last = 'bottom left';
    
	$scope.rebootAction = function() {
		$scope.setCommand('reboot', $scope.getRebootResponse);
		$scope.action.done = 0;
	};
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    //event.preventDefault();
	    // transitionTo() promise will be rejected with
	    // a 'transition prevented' error
	    //$interval.cancel($scope.dmesg_timer);
	});
	
	$scope.setCommand = function(command, callback, param) {
		var promesa = ServiceSetup.setCmd(command);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("setCommand" + command + " successfully");
				 callback(); //call once now to reduce delay 
				 $scope.response_timer = $interval(function(){
					callback();
				}, 1000);
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
	
	$scope.getRebootResponse = function() {
		var promesa = ServiceSetup.getCmd('reboot');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.data.status;
				if(status == 'OK' || status == 'ERROR')
				{
					$interval.cancel($scope.response_timer);
					if(status == 'ERROR')
					{
						$mdToast.show(
					      $mdToast.simple()
					        .textContent($filter('translate')('get response failed!'))
					        .position(last)
					        .hideDelay(2000)
					        );
					}
					$scope.action.done = 1;
					$scope.action.progress = data.data.progress;
					
				}
				else if(status == 'BUSY')
				{
					console.log("reboot busy at " + now);
					console.log(data);
					$scope.action.progress = data.data.progress;
				}
			}
		},
		function(error) {
			console.log("getRebootResponse error: " + error);	
		});
	};
	
	
}]);

