'use strict';

angular.module('ciApp').controller('setupOddCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$interval', '$mdDialog', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $interval, $mdDialog){

	$scope.devices = {};
	$scope.realDevices = {};

    $scope.devices_default = {
    	"sr0": "sr0",
        "sr1": "sr1",
        "sr2": "sr2",
        "sr3": "sr3",
        "sr4": "sr4",
        "sr5": "sr5",
        "sr6": "sr6",
        "sr7": "sr7",
        "sr8": "sr8",
        "sr9": "sr9",
        "sr10": "sr10",
        "sr11": "sr11",
        "sr12": "sr12",
        "sr13": "sr13",
        "sr14": "sr14",
        "sr15": "sr15",
        "sr16": "sr16",
        "sr17": "sr17",
        "sr18": "sr18",
        "sr19": "sr19",
        "sr20": "sr20",
        "sr21": "sr21",
        "sr22": "sr22",
        "sr23": "sr23"	
    };


    $scope.combineDevices = function(new_devices) {
    	console.log("new devices: " + angular.toJson(new_devices));
    	
    	//first, add new devices
    	for(var i=0; i<new_devices.length; i++)
    	{
    		var dev_name = new_devices[i];
    		var found = false;
    		
    		for(var prop in $scope.devices)
			{
				if(prop == dev_name)
				{
				  found = true;
				}
			}
    		
    		if(found == false)
    		{
    			$scope.devices[dev_name] = dev_name;
    		}
    	}
    	
    	//second, delete the wrong devices
    	for(var prop in $scope.devices)
    	{
    		var found = false;
    		for(var i=0; i<new_devices.length; i++)
    		{
    			var dev_name = new_devices[i];
    			if(prop == dev_name)
    				found = true;
    		}
    		
    		if(found == false)
    		{
    			//$scope.devices[prop] = undefined;
    			delete $scope.devices[prop];
    		}
    	}
    	
    };
	
	//toast
	var last = 'bottom left';
    
    $scope.getConfig = function() {
    	var promesa = ServiceSetup.getConfig('odd');
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.devices = data.data;
				//get real devices
				$scope.setCommand('lssr');
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
		console.log("odd add:" + angular.toJson($scope.devices, true));
		var promesa = ServiceSetup.setConfig('odd', $scope.devices);
		
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
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    //event.preventDefault();
	    // transitionTo() promise will be rejected with
	    // a 'transition prevented' error
	    $interval.cancel($scope.response_timer);
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
				}, 100);
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
//	$scope.setCommand('ifconfig');
	
	$scope.getResponse = function() {
		var promesa = ServiceSetup.getCmd('lssr');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.data.status;
				if(status == 'OK')
				{
					$interval.cancel($scope.response_timer);
					$scope.realDevices = data.data.data;
					$scope.combineDevices(data.data.data);
				}
				else if(status == 'BUSY')
				{
					console.log("lssr busy at " + now);
				}
			}
		},
		function(error) {
			console.log("getResponse error: " + error);	
		});
	};
	
	$scope.remap = function (name, $event) {
       $mdDialog.show({
         parent: angular.element(document.body),
         targetEvent: $event,
         templateUrl: '../../views/dialogs/oddDialog.html',
         
         
         locals: {
           devices: $scope.devices,
           device: name,
           realDevices: $scope.realDevices,
           service: ServiceSetup,
         },
         controller: DialogController,
         clickOutsideToClose: true
      });
	};
	
}]);

/*For dialogs*/
function DialogController($scope, $mdDialog, devices, device, realDevices, service) {
		$scope.devices = devices;
        $scope.device = device;
        $scope.realDevices = realDevices;
        
        $scope.closeDialog = function() {
          $mdDialog.hide();
        };
        
        $scope.eject = function() {
        	var param = {};
        	param.data = $scope.device;
        	var promesa = service.setCmd('eject', param);
			promesa.then(function(data)
			{
				var text = '';
				if(data.status == 'OK')
				{

				}
				
			}
			,function(error)
			{
				console.log("setCommand: eject Error " + error);
			});
        };
        
        $scope.load = function() {
        	var param = {};
        	param.data = $scope.device;
        	var promesa = service.setCmd('load', param);
			promesa.then(function(data)
			{
				var text = '';
				if(data.status == 'OK')
				{

				}
				
			}
			,function(error)
			{
				console.log("setCommand: load Error " + error);
			});
        };
        
}

