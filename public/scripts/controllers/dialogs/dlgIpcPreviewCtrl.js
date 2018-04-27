function dlgIpcPreviewCtrl($scope, $mdDialog, ServiceSetup, ip, uri) {
		$scope.ip = ip;
		$scope.uri = uri;
		$scope.done = true;
//        $scope.videosrc = '/dataroot/innovation.mp4';
        $scope.videosrc = location.protocol + '//' + location.host + ':8080/hls/'+ip+'/index.m3u8';
        console.log('video source:'+$scope.videosrc);
        $scope.closeDialog = function() {
          $mdDialog.hide();
        };
        
        angular.element(document).ready(function() {
//            $scope.player = videojs('example-video', {
//                'loop': true,
//            });
            
        });
        
        $scope.check_play = function() {
            if($scope.player.videoWidth() === 0)
            {
                $scope.refresh();
                setTimeout($scope.check_play, 1000);
            }
            else
                console.log("Ready to play");
        };
        
        $scope.startPlay = function() {
            $scope.player = videojs('example-video', {
                'loop': true,
            });
            $scope.player.src({'type': 'application/x-mpegURL', 'src':$scope.videosrc});
            $scope.player.play(); 
            console.log("videojs play");
        };
        
        $scope.refresh = function() {
            $scope.player.reset();
            $scope.player.src({'type': 'application/x-mpegURL', 'src':$scope.videosrc});
            $scope.player.play();
            console.log("videojs reset");
        };
        
        $scope.delPreview = function() {
            console.log("preview deleted");
        };
        
        $scope.sendCommand = function(command, callback, param) {
		var promesa = ServiceSetup.sendCmd(command, param);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("sendCommand" + command + " successfully");
				 setTimeout(callback, 1000);
			}
			
		}
		,function(error)
		{
			console.log("sendCommand: " + command + "Error " + error);
		});
	    };
	    
	    //==============
		var p_param = {'req': 'ADD','ip': ip, 'uri': uri};
		$scope.sendCommand('ipcpreview', $scope.startPlay, p_param);
		
		
		$scope.$on('$destroy', function () {
            $scope.player.dispose();
            console.log("videojs destroy");
            p_param.req = 'DEL';
            $scope.sendCommand('ipcpreview', $scope.delPreview, p_param);
        });
	
}
