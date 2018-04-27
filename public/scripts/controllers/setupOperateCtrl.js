'use strict';

angular.module('ciApp').controller('setupOperateCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$interval', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $interval){

    $scope.action = {
        'type': 'L2D',
        'slot': 0,
        'drive': 0,
        'progress': 0,
        'done': 1,
    };
	
	//toast
	var last = 'bottom left';
    
	$scope.doAction = function() {
		//console.log('formatAction: ');
		//console.log(raid);
		
		var param = {};
		param.req = $scope.action.type;
		param.slot = $scope.action.slot;
		param.drvie = $scope.action.drive;
		
		console.log(param);
		
		$scope.sendCommand('robot', $scope.getRobotResponse, param);
		$scope.action.progress = 0;
		$scope.action.done = 0;
	};
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    //event.preventDefault();
	    // transitionTo() promise will be rejected with
	    // a 'transition prevented' error
	    //$interval.cancel($scope.dmesg_timer);
	});
	
	$scope.setCommand = function(command) {
		var promesa = ServiceSetup.setCmd(command);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("setCommand" + command + " successfully");
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
	
	$scope.sendCommand = function(command, callback, param) {
		var promesa = ServiceSetup.sendCmd(command, param);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("sendCommand" + command + " successfully");
				 callback(); //call once now to reduce delay 
				 $scope.response_timer = $interval(function(){
					callback();
				}, 1000);
			}
			
		}
		,function(error)
		{
			console.log("sendCommand: " + command + "Error " + error);
		});
		
	};
	
	$scope.getRobotResponse = function() {
		var promesa = ServiceSetup.getCmd('robot');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.data.status;
				if(status == 'DONE' || status == 'ERROR')
				{
					$interval.cancel($scope.response_timer);
					if(status == 'ERROR')
					{
						$mdToast.show(
					      $mdToast.simple()
					        .textContent($filter('translate')('Call robot failed!'))
					        .position(last)
					        .hideDelay(2000)
					        );
					}
					$scope.action.done = 1;
					$scope.action.progress = data.data.progress;
					
				}
				else if(status == 'BUSY')
				{
					console.log("robot busy at " + now);
					console.log(data);
					$scope.action.progress = data.data.progress;
				}
			}
		},
		function(error) {
			console.log("getRobotResponse error: " + error);	
		});
	};
	
	$scope.checkRunCmd = function(command) {
		var promesa = ServiceSetup.queryCmd(command);
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				if(data.data.status == 'ERROR') //the command daemon is no up.
				    $scope.setCommand(command);
				else
				    console.log(command + " is running now, dont start again");
			}
			//console.log("getDmesg :" + data.data + " at " + now);
		},
		function(error) {
			console.log("checkCmdRun error: " + error);	
		});
	};
	
	$scope.checkRunCmd('robot');
	
}]);

