function ipcplayCtrl($scope, $mdDialog, $interval, ServiceSetup, ipc, type, starttime, endtime){
    $scope.uri = '';
    $scope.type = type;

    $scope.singlePlay = function() {
        $scope.uri = ipc.filename;
        $scope.videosrc = ipc.filepath.replace("home/zwj/tangyayun", "t");
        
         $scope.player = videojs('example-video', {
                'loop': true,
            });
        //$scope.player.reset();
        $scope.player.src({'type': 'video/mp4', 'src':$scope.videosrc});
        $scope.player.play(); 
        console.log("videojs play");
    };
    
    $scope.refresh = function() {
            $scope.player.reset();
            $scope.player.src({'type': 'video/mp4', 'src':$scope.videosrc});
            $scope.player.play();
            console.log("videojs reset");
        };
        
    $scope.num =0;
    $scope.getTime_timer ='';
    $scope.multiplePlay = function(){
        $scope.uri = ipc[$scope.num].filename;
        $scope.videosrc = ipc[$scope.num].filepath.replace("home/zwj/tangyayun", "t");
        $scope.player = videojs('example-video', {
                'loop': false,
        });
        $scope.player.src({'type': 'video/mp4', 'src':$scope.videosrc});
        var dateTime = $scope.getDateTime(ipc[$scope.num].filename, starttime);
        var seconds = ((new Date(dateTime[1]).getTime())-(new Date(dateTime[0]).getTime()))/1000;
        $scope.player.play();
        $scope.player.cache_.currentTime=seconds;
        $scope.videoDown();
        //setInterval($scope.videoDown(), 4000);
        $scope.num = ($scope.num+1);
        $scope.getTime_timer = $interval($scope.videoDown, 4000);
    };
    
    
    $scope.videoDown = function(){
        var duration = $scope.player.cache_.duration;
        var currentTime= $scope.player.cache_.currentTime;
        //aler($scope.player.cache_);
        if((duration==currentTime&currentTime!=0)&ipc.length!=$scope.num){
            
//            if(ipc.length==$scope.num){
//                alert("finish");
//            }else{
                $scope.uri = ipc[$scope.num].filename;;
                $scope.videosrc = ipc[$scope.num].filepath.replace("home/zwj/tangyayun", "t");
                $scope.player.reset();
                $scope.player.src({'type': 'video/mp4', 'src':$scope.videosrc});
                $scope.player.play();
                $scope.num = ($scope.num+1);
                console.log("videojs down");
            //}
            
        }else if(ipc.length==$scope.num){//.replace('.mp4','');
            var dateTime = $scope.getDateTime(ipc[$scope.num-1].filename, endtime);
            var seconds = ((new Date(dateTime[1]).getTime())-(new Date(dateTime[0]).getTime()))/1000;
            if(currentTime>seconds){
                $scope.player.pause();
                $interval.cancel($scope.getTime_timer);
                 console.log("videojs pause");
            }
            
        }
    };
    
    $scope.getDateTime = function (file,time){
        $scope.dateTime = [];
        var fileName = file.split("_");
        var strTime = ((fileName[1]).replace('.mp4','')).replace("-", ":");
        $scope.dateTime[0] = fileName[0]+" "+ strTime.replace("-", ":");//文件时间
        $scope.dateTime[1] = fileName[0]+" "+time;//结束时间 or 开始时间
        return $scope.dateTime;
    }
    
    
    $scope.startPlay = function(){
        if($scope.type =="singe"){
            setTimeout( $scope.singlePlay, 1000);
        }else if($scope.type=="multiple"){
            setTimeout($scope.multiplePlay, 1000);
        }
    };
    
    $scope.closeDialog = function() {
          $mdDialog.hide();
    };
    
    $scope.$on('$destroy', function () {
            $scope.player.dispose();
            console.log("videojs destroy");
    });
    
    $scope.startPlay();
    
}

