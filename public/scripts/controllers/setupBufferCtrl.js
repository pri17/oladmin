'use strict';

angular.module('ciApp').controller('setupBufferCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$interval', function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $interval){
//*
    $scope.raids = [];
    $scope.disks = [];
/*/
    $scope.raids = [
        {
            "device": "md0",
            "mount_point": "/mnt/local/hdd",
            "raid": true,
            "level": "0",
            "disk": [
                "sda",
                "sdb",
                "sdc",
                "sdd",
                "sde",
                "sdf"
            ]
        },
        {
            "device": "md1",
            "mount_point": "/mnt/local/ssd",
            "raid": true,
            "level": "0",
            "disk": [
                "sdg",
                "sdh",
                "sdi",
                "sdj",
                "sdk",
                "sdl"
            ]
        }
    ];
    
    $scope.disks = [
        {
            "device": "sda",
            "capacity": "3840GB"
        },
        {
            "device": "sdb",
            "capacity": "3840GB"
        },
        {
            "device": "sdc",
            "capacity": "3840GB"
        },
        {
            "device": "sdd",
            "capacity": "3840GB"
        },
        {
            "device": "sde",
            "capacity": "3840GB"
        },
        {
            "device": "sdf",
            "capacity": "3840GB"
        },
        
        {
            "device": "sdg",
            "capacity": "3840GB"
        },
        {
            "device": "sdh",
            "capacity": "3840GB"
        },
        {
            "device": "sdi",
            "capacity": "3840GB"
        },
        {
            "device": "sdj",
            "capacity": "3840GB"
        },
        {
            "device": "sdk",
            "capacity": "3840GB"
        },
        {
            "device": "sdl",
            "capacity": "3840GB"
        },
        
    ];
 //*/   
    $scope.raid_progress = 0;
    $scope.mkfs_progress = 0;
    
    //remove the unavailable disks from raids
    $scope.refreshDiskOfRaid = function() {
    	for(var i = 0; i < $scope.raids.length; i++)
    	{
    		for(var j = 0; j < $scope.raids[i].disk.length; j++)
    		{
    			var found = false;
    			for(var k = 0; k < $scope.disks.length; k++)
    			{
    				if($scope.raids[i].disk[j] == $scope.disks[k].device)
    				{
    					//console.log("found "+$scope.raids[i].disk[j]);
    					found = true;
    				}
    			}
    			
    			if(found == false)
    			{
    				//console.log("refreshDiskOfRaid: " + $scope.raids[i].device + " disk " + $scope.raids[i].disk[j] + " not found");
    				$scope.raids[i].disk.splice(j, 1);
    				j--; //because of removal
    			}
    			
    		}
    	}
    };
    
	$scope.check_toggle = function (item, list) {
		var idx = -1;
		for(var i = 0; i < list.length; i++)
		{
			if(list[i] == item.device)
				idx = i;
		}

		if (idx > -1) {
		  list.splice(idx, 1);
		}
		else {
		  list.push(item.device);
		}
		//console.log(list);
	};
	$scope.check_exists = function (item, list) {
		for(var i = 0; i < list.length; i++)
		{
			if(list[i] == item.device)
				return true;
		}
		return false;
	};
	$scope.check_if = function(item, list) {
		for(var i = 0; i < $scope.raids.length; i++)
		{
			for(var j = 0; j < $scope.raids[i].disk.length; j++)
			{
				if($scope.raids[i].disk[j] == item.device && $scope.raids[i].disk != list)
					return false; //hidden
			}
		}
		
		return true;
	};
    

	
	//toast
	var last = 'bottom left';
    
    $scope.getConfig = function() {
    	var promesa = ServiceSetup.getConfig('raid');
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.raids = data.data;
				//get real devices
				$scope.setCommand('fdisk', $scope.getFdiskResponse);
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
		console.log("Raid submit:" + angular.toJson($scope.raids, true));
//*		
		var promesa = ServiceSetup.setConfig('raid', $scope.raids);
		
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
			console.log(text);
		}
		,function(error)
		{
			alert("Error " + error);
		});
//*/	
	
	};
	
	$scope.createRaidAction = function(raid) {
		//console.log('createRaidAction: ');
		//console.log(raid);
		
		var param = {'data':''};
		param.data = "\"" + raid.device.substr(5) + ' -l ' + raid.level + ' -n ' + raid.disk.length;
		var devices = '';
		for(var i = 0; i < raid.disk.length; i++)
		{
			devices = devices + raid.disk[i].substr(2, 1);
		}
		param.data = param.data + ' ' + devices + "\"";
		console.log(param);
		
		$scope.setCommand('raidcreate', $scope.getCreateRaidResponse, param);
		$scope.raid_progress = 0;
	};
	
	$scope.formatAction = function(raid) {
		//console.log('formatAction: ');
		//console.log(raid);
		
		var param = {'data':''};
		if(raid.raid == true)
			param.data = raid.device;
		else if(raid.disk.length)
			param.data = raid.disk[0];
		else
			return;
		
		console.log(param);
		
		$scope.setCommand('mkfs', $scope.getMkfsResponse, param);
		$scope.mkfs_progress = 0;
	};
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    //event.preventDefault();
	    // transitionTo() promise will be rejected with
	    // a 'transition prevented' error
	    //$interval.cancel($scope.dmesg_timer);
	});
	
	//get response for ifconfig
	$scope.setCommand = function(command, callback, param) {
		var promesa = ServiceSetup.setCmd(command, param);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("setCommand" + command + " successfully");
				 callback(); //call once now to reduce delay 
				 $scope.response_timer = $interval(function(){
					callback();
				}, 200);
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
	//$scope.setCommand('fdisk');
	
	$scope.getFdiskResponse = function() {
		var promesa = ServiceSetup.getCmd('fdisk');
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.data.status;
				if(status == 'OK')
				{
					$interval.cancel($scope.response_timer);
					$scope.disks = data.data.data;
					$scope.refreshDiskOfRaid();
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
	
	$scope.getCreateRaidResponse = function() {
		var promesa = ServiceSetup.getCmd('raidcreate');
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
					        .textContent($filter('translate')('Create RAID failed!'))
					        .position(last)
					        .hideDelay(2000)
					        );
					}
					
					$scope.raid_progress = data.data.progress;
					
				}
				else if(status == 'BUSY')
				{
					console.log("raidcreate busy at " + now);
					console.log(data);
					$scope.raid_progress = data.data.progress;
				}
			}
		},
		function(error) {
			console.log("getResponse error: " + error);	
		});
	};
	
	$scope.getMkfsResponse = function() {
		var promesa = ServiceSetup.getCmd('mkfs');
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
					        .textContent($filter('translate')('Format failed!'))
					        .position(last)
					        .hideDelay(2000)
					        );
					}
					
					$scope.mkfs_progress = data.data.progress;
					
				}
				else if(status == 'BUSY')
				{
					console.log("mkfs busy at " + now);
					console.log(data);
					$scope.mkfs_progress = data.data.progress;
				}
			}
		},
		function(error) {
			console.log("getResponse error: " + error);	
		});
	};
	
}]);

