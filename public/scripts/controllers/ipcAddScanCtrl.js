
'use strict';

angular.module('ciApp').controller('ipcAddScanCtrl', ['$scope', '$filter', '$mdToast', '$mdDialog', 'ServiceSetup', '$state', '$interval', function($scope, $filter, $mdToast, $mdDialog, ServiceSetup, $state, $interval){

	$scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
	
	$scope.ipcs_config = [];
	$scope.ipcs = [
//	    {
//	        'ip': '192.168.1.169:80',
//	        'uri': ['rtsp://admin:opstor802@192.168.1.169:80/ch0_0.264',],
//	    },
	    ];
	    
	$scope.action = {
	    'eth': 'br0',
	    'ip': '192.168.1.250',
	    'usr': 'admin',
	    'pass': 'opstor802',
	    'progress': 0,
	    'done': 1
	};
	
	$scope.$watchGroup(['itemsPerPage', 'ipcs'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.ipcs.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
	
	//toast
	var last = 'bottom left';
	
	$scope.reload = function () {
		var promesa = ServiceSetup.getConfig('ipc');
		//var promesa = ServiceCheckins.getBatchByIndex('studentno','*', 100, '');
	
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs_config = data.data;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	};
	
	$scope.reload();
	
	$scope.check_config = function(){
	    for(var i = 0; i < $scope.ipcs.length; i++) {
	        var ip = $scope.ipcs[i].ip;
	        var found = false;
	        
	        for(var j = 0; j < $scope.ipcs_config.length; j++) {
	            if(ip == $scope.ipcs_config[j].ip)
	            {
	                found = true;
	                break;
	            }
	        }
	        
	        if(found == true)
	            $scope.ipcs[i].added = true;
	        else
	            $scope.ipcs[i].added = false;
	        
	    }
	};
	
	var ipc_item = {"ip": "", "uri": [], "nickname": "", "enable": 1, "class": ""};
	$scope.add = function(ipc){
	    if(ipc.added === true) return;
	    console.log("add:");
	    console.log(ipc);
	    
	    var newitem = angular.copy(ipc_item);
	    newitem.ip = ipc.ip;
	    newitem.uri = ipc.uri;
	    $scope.ipcs_config.push(newitem);
	    $scope.check_config();
	};
	
	$scope.addAll = function(){
	    console.log("addAll");
	    
	    for(var i = 0; i < $scope.ipcs.length; i++) {
	        if($scope.ipcs[i] !== true)
	            $scope.add($scope.ipcs[i]);
	    }
	    
	};
	
	$scope.save = function() {
	    var promesa = ServiceSetup.setConfig('ipc', $scope.ipcs_config);
		promesa.then(function(data)
		{
			if(data.status == 'OK')
			{
				$state.transitionTo('ipc.manage');
			}
			else {
			    $mdToast.show(
		        $mdToast.simple()
		        .textContent($filter('translate')('Save failed!'))
		        .position(last)
		        .hideDelay(2000)
		        );
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	};
	
	$scope.scan = function(){
		var param = {};
		param.req = 'PROBE';
		param.eth = $scope.action.eth;
		param.ip = $scope.action.ip;
		param.usr = $scope.action.usr;
		param.pass = $scope.action.pass;
		
		console.log(param);
		
		$scope.sendCommand('onvif', $scope.getResponse, param);
		$scope.action.progress = 0;
		$scope.action.done = 0;
	};
	
	$scope.preview = function(ipc, $event){
	    var uri;
		if(angular.isArray(ipc.uri))
		    uri = ipc.uri[0];
		else
		    uri = ipc.uri;
		    
	    $mdDialog.show({
         parent: angular.element(document.body),
         targetEvent: $event,
         templateUrl: '../../views/dialogs/ipcPreviewDialog.html',
         locals: {
           'ServiceSetup': ServiceSetup,
           'ip': ipc.ip,
           'uri': uri,
         },
         controller: dlgIpcPreviewCtrl,
         clickOutsideToClose: true
      });
	};
	
    $scope.previousPage = function() {
    	$scope.currentPage --;
    };
    
    $scope.nextPage = function (){
    	$scope.currentPage ++;
    }
    
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
	
	$scope.getResponse = function() {
		var promesa = ServiceSetup.getCmd('onvif');
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
					        .textContent($filter('translate')('Call robot failed!'))
					        .position(last)
					        .hideDelay(2000)
					        );
					}
					$scope.ipcs = data.data.data;
					$scope.action.done = 1;
					$scope.action.progress = data.data.progress;
					$scope.check_config();
					
				}
				else if(status == 'BUSY')
				{
					console.log("robot busy at " + now);
					console.log(data);
					$scope.action.progress = data.data.progress;
					$scope.ipcs = data.data.data;
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
	
	$scope.checkRunCmd('onvif');
	$scope.checkRunCmd('ipcpreview');
	

}]);

