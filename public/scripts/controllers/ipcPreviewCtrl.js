
'use strict';

angular.module('ciApp').controller('ipcPreviewCtrl', ['$scope', '$filter', '$mdToast', '$mdDialog', 'ServiceSetup', '$state', function($scope, $filter, $mdToast, $mdDialog, ServiceSetup, $state){

	$scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
	
	$scope.ipcs = [];
	$scope.ipcs_preview = [];
	
	$scope.$watchGroup(['itemsPerPage', 'ipcs'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.ipcs.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
	
	$scope.reload = function () {
		var promesa = ServiceSetup.getConfig('ipc');
		//var promesa = ServiceCheckins.getBatchByIndex('studentno','*', 100, '');
	
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs = data.data;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	}
	
	$scope.reload();
	
	$scope.add = function(ipc){
	    ipc.added = !ipc.added;
	    if(ipc.added)
	    {
	        var new_item = {'uri': ipc.uri, 'ip': ipc.ip, 'nickname': ipc.nickname};
		    $scope.ipcs_preview.push(new_item);
		    $scope.addPreview(new_item);
	    }
	    else
	    {
	        for(var i = 0; i < $scope.ipcs_preview.length; i++)
	        {
	            if(ipc.uri == $scope.ipcs_preview[i].uri)
	            { 
	                $scope.delPreview($scope.ipcs_preview[i]);
	                $scope.ipcs_preview.splice(i, 1);
	                break;
	            }
	        }
	    }
	};
	
	$scope.del = function(ipc) {
	    var idx =  $scope.ipcs_preview.indexOf(ipc);
	    for(var i = 0; i < $scope.ipcs.length; i++)
        {
            if(ipc.uri == $scope.ipcs[i].uri)
            { 
                $scope.ipcs[i].added = !$scope.ipcs[i].added;
                break;
            }
        }
	        
	    $scope.delPreview(ipc);
	    $scope.ipcs_preview.splice(idx, 1);
	};
	
	$scope.check_play = function() {
	    var need_check = false;
	    for(var i = 0; i < $scope.ipcs_preview.length; i++)
	    {
	        var ipc = $scope.ipcs_preview[i];
            if(ipc.player.videoWidth() === 0)
            {
                need_check = true;
                $scope.refresh(ipc);
            }
            else //set width now
            {
                ipc.player.width(480);
                ipc.player.height(270);
            }
            
	    }
	    
	    if(need_check === true)
	    {
	        setTimeout($scope.check_play, 2000);
	    }
	    else
            console.log("All ready to play");
    };
        
        $scope.startPlay = function(ipc) {
            ipc.player = videojs('ipc-video-'+ipc.ip, {
                'loop': true,
            });
            var videosrc = location.protocol + '//' + location.host + ':8080/hls/'+ipc.ip+'/index.m3u8';
            ipc.player.src({'type': 'application/x-mpegURL', 'src':videosrc});
            ipc.player.play(); 
            console.log("videojs play");
            $scope.check_play();
        };
        
        $scope.refresh = function(ipc) {
            ipc.player.reset();
            var videosrc = location.protocol + '//' + location.host + ':8080/hls/'+ipc.ip+'/index.m3u8';
            ipc.player.src({'type': 'application/x-mpegURL', 'src': videosrc});
            ipc.player.play();
            console.log("videojs reset");
        };
        
	
	$scope.addPreview = function(ipc) {
	    var p_param = {'req': 'ADD','ip': ipc.ip, 'uri': ipc.uri};
	    if(angular.isArray(ipc.uri))
	        p_param.uri = ipc.uri[0];
	    $scope.sendCommand('ipcpreview', $scope.startPlay, p_param, ipc);
	};
	
	$scope.callback = function() {
	    
	};
	
	$scope.delPreview = function(ipc) {
	    var p_param = {'req': 'DEL','ip': ipc.ip, 'uri': ipc.uri};
	    if(angular.isArray(ipc.uri))
	        p_param.uri = ipc.uri[0];
	    $scope.sendCommand('ipcpreview', $scope.callback, p_param, ipc);
	    ipc.player.dispose();
	};
	
	$scope.refreshPreview = function(ipc) {
	    for(var i = 0; i < $scope.ipcs_preview.length; i++)
	    {
	        var ipc = $scope.ipcs_preview[i];
            if(ipc.player.videoWidth() > 0)
            {
                $scope.refresh(ipc);
            }
            
	    }

    };
	
	$scope.preview = function(ipc){
		console.log("preivew:");
		console.log(ipc);
		
		for(var i = 0; i < $scope.ipcs_preview.length; i++)
		{
		    $scope.delPreview($scope.ipcs_preview[i]);
		}
		
		$scope.ipcs_preview = [];
		var new_item = {'uri': ipc.uri, 'ip': ipc.ip, 'nickname': ipc.nickname};
		$scope.ipcs_preview.push(new_item);
		$scope.addPreview(new_item);
	};
	
	
	
	$scope.search = function(){
		var promesa = 	ServiceIpcs.search($scope.keyword);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs = data.data;
			}
			else
			{
				var pos = 'bottom left';
				$mdToast.show(
			      $mdToast.simple()
			        .textContent($filter('translate')('Search failed'))
			        .position(pos)
			        .hideDelay(2000)
		    	);
			}
			
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
	
	$scope.sendCommand = function(command, callback, param, callback_param) {
		var promesa = ServiceSetup.sendCmd(command, param);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("sendCommand" + command + " successfully");
				 callback(callback_param);
			}
			
		}
		,function(error)
		{
			console.log("sendCommand: " + command + "Error " + error);
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
	
	$scope.checkRunCmd('ipcpreview');
	
	$scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    console.log("stop all previews...");
	    for(var i = 0; i < $scope.ipcs_preview.length; i++)
	    {
	        var ipc = $scope.ipcs_preview[i];
	        $scope.delPreview(ipc);
	    }
	});
	
}]);

