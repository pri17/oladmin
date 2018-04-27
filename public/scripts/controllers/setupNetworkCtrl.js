'use strict';

angular.module('ciApp').controller('setupNetworkCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$interval', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $interval){
//*
	$scope.devices = [];
/*/
    $scope.devices = [
        {
            "device": "eth0:1",
            "newname": "eth0:1",
            "proto": "static",
            "ip": "192.168.103.251",
            "mask": "255.255.255.0",
            "gateway": "192.168.103.1"
        },
        {
            "device": "eth0",
            "newname": "eth0",
            "proto": "dhcp",
        },
        {
            "device": "br0",
            "newname": "br0",
            "type": "bridge",
            "component": [
            	{'c_device':'eth1'},
            	],
            "proto": "static",
            "ip": "192.168.0.100",
            "mask": "255.255.255.0",
            "gateway": "192.168.0.1"
        },
        
    ];
//*/

    var device_item = {"device": "eth0", "newname": "eth0", "proto": "dhcp", "dhcp": true};
    $scope.combineDevices = function(new_devices) {
    	console.log("new devices: " + angular.toJson(new_devices));
    	
    	//first, add new devices
    	for(var i=0; i<new_devices.length; i++)
    	{
    		var dev_name = new_devices[i].device;
    		var found = false;
    		
    		for(var j=0; j<$scope.devices.length; j++)
    		{
    			if($scope.devices[j].newname == dev_name)
    			{
    				found = true;
    				$scope.devices[j].mac = new_devices[i].mac;
    			}
    		}
    		
    		if(found == false)
    		{
    			var newitem = angular.copy(device_item);
    			newitem.device = dev_name;
    			newitem.newname = dev_name;
    			$scope.devices.push(newitem);
    		}
    	}
    	
    	//second, delete the wrong devices
    	for(var j=0; j<$scope.devices.length; j++)
    	{
    		var dev_name = $scope.devices[j].newname;
    		var found = false;
    		for(var i =0; i<new_devices.length; i++)
    		{
    			if(new_devices[i].device == dev_name)
    				found = true;
    		}
    		
    		if($scope.devices[j].type == 'bridge')
    			found = true;
    		
    		if(found == false)
    		{
    			//delete the wrong device
    			$scope.devices.splice(j, 1);
    			j--; //because of removal
    		}
    	}
    };
	
    
    var bridge_component_item = {'c_device':'eth1'};
	
	$scope.addBridgeComponentAction = function(bridge) {
		var newitem = angular.copy(bridge_component_item);
		var idx = bridge.component.indexOf(newitem);
		if(idx < 0) //not duplicated
			bridge.component.push(newitem);
	};
	
	$scope.delBridgeComponentAction = function(bridge, item) {
		var idx = bridge.component.indexOf(item);
		if (idx > -1) {
		  bridge.component.splice(idx, 1);
		}
	};
	
    
    $scope.refresh_devices = function() {
          for(var i=0; i<$scope.devices.length; i++)
          {
              $scope.devices[i].dhcp = false;
              if($scope.devices[i].proto == 'dhcp')
                $scope.devices[i].dhcp = true;

          }
    };
    
//    $scope.refresh_devices();

	$scope.defautlNetworkChange = function(device) {
		//console.log("default network changed: ");
		//console.log(device);
		var cur_value = device.default;
		for(var i=0; i<$scope.devices.length; i++)
        {
            $scope.devices[i].default = false;
        }
        device.default = cur_value;
          
	};
	
	//toast
	var last = 'bottom left';
    
    $scope.getConfig = function() {
    	var promesa = ServiceSetup.getConfig('network', $scope.devices);
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.devices = data.data;
				$scope.refresh_devices();
				//get real devices
				$scope.setCommand('ifconfig');
			}
			else
			{
				text = 'Get config failed';
			
				$mdToast.show(
			      $mdToast.simple()
			        .textContent($filter('translate')(text))
			        .position(last)
			        .hideDelay(2000)
		    	);
			}
		}
		,function(error)
		{
			console.log("Submit Error " + error);
		});
    };
    
    $scope.getConfig();
    
	$scope.submitAction = function() {
		console.log("network add:" + angular.toJson($scope.devices, true));
		var promesa = ServiceSetup.setConfig('network', $scope.devices);
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				text = 'Submit successfully!';
			}
			else
			{
				text = 'Failed';
			}
		
			$mdToast.show(
		      $mdToast.simple()
		        .textContent($filter('translate')(text))
		        .position(last)
		        .hideDelay(2000)
	    	);
		}
		,function(error)
		{
			console.log("Submit Error " + error);
		});
	
	
	};
	
	//periodic task
	
	//dmesg information
	$scope.getDmesg = function() {
		var promesa = ServiceSetup.setCmd('dmesg | grep eth | tail -n 1');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				$scope.dmesg = data.data;
			}
			//console.log("getDmesg :" + data.data + " at " + now);
		},
		function(error) {
			console.log("getDmesg error: " + error);	
		});
	};
	
	$scope.dmesg_timer = $interval(function(){
		$scope.getDmesg();
	}, 5000);
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    //event.preventDefault();
	    // transitionTo() promise will be rejected with
	    // a 'transition prevented' error
	    $interval.cancel($scope.dmesg_timer);
	});
	
	//get response for ifconfig
	$scope.setCommand = function(command) {
		var promesa = ServiceSetup.setCmd(command);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("setCommand" + command + " successfully");
				 $scope.getResponse();
				 $scope.response_timer = $interval(function(){
					$scope.getResponse();
				}, 1000);
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
//	$scope.setCommand('ifconfig');
	
	$scope.getResponse = function() {
		var promesa = ServiceSetup.getCmd('ifconfig');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.data.status;
				if(status == 'OK')
				{
					$interval.cancel($scope.response_timer);
					$scope.combineDevices(data.data.data);
				}
				else if(status == 'BUSY')
				{
					console.log("ifconfig busy at " + now);
				}
			}
		},
		function(error) {
			console.log("getResponse error: " + error);	
		});
	};
	
	
	
}]);

