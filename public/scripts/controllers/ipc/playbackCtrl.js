'use strick';

angular.module('ciApp').controller('playbackCtrl', ['$scope', 'ServiceSetup', 'ServiceIpc', '$mdDialog', '$mdToast', function($scope, ServiceSetup, ServiceIpc, $mdDialog, $mdToast){

        //-------- 分页(page) ----------
        $scope.itemsPerPageOptions=[10, 20, 50, 100];
        $scope.itemsPerPage=20;
        $scope.totalPage=1;
        $scope.pageNumOptions = [];
        $scope.currentPage = 1;
        
        $scope.ip = '';//页面传出值ip
        $scope.dateTime ='';//页面传出值时间
        $scope.startTime = '';//开始时间
        $scope.endTime = '';//结束时间
        //$scope.playIp = '';
        
        $scope.items = [];//传入页面值摄像头监控历史信息
        $scope.ipcs = [];//传入页面值摄像头信息
    
        $scope.$watchGroup(['itemsPerPage', 'value'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.items.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
        }, true);
        
        $scope.reload = function(){
            var promesa = ServiceSetup.getConfig('ipc');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.ipcs = data.data;
		}
            },function(error){
                console.log("Submit Error "+error);
            });
        };
        $scope.reload();
        
        //历史展示
        $scope.getVideo = function(){
            if($scope.ip == ""){
                alert("请选择IP！");
            }else if($scope.dateTime == ""){
                alert('请选择时间！');
            }else{
                var param = {'ip':$scope.ip, 'datetime':$scope.dateTime};
                var promesa = ServiceIpc.getIpc(param, "ipc");
                promesa.then(function(data){
                    if(data.status == 'OK'&(data.data!='[null]'|data.data!="")){
                        $scope.items = data.data;
                    }
                },function(error){
                    console.log("Submit Error "+error);
                });
            }
        };
        
        //分段播放
        $scope.multipleVideo = function($event){
            
            var dateTime = "2017-01-01";
            
            if($scope.ip == ""){
                alert("请选择IP！");
            }else if($scope.dateTime == ""){
                alert('请选择时间！');
            }else{
                if(new Date(dateTime+" "+$scope.startTime).getTime()<new Date(dateTime+" "+$scope.endTime).getTime()){
                    var param = {'ip':$scope.ip, 'datetime':$scope.dateTime, 'starttime':$scope.startTime, 'endtime':$scope.endTime};
                    var promesa = ServiceIpc.getmultiple(param, "multiple");
                    promesa.then(function(data){
                        if(data.status == 'OK'&(data.data!=null|data.data!="")){
                            $scope.preview(data.data, $event, 'multiple', $scope.startTime,$scope.endTime);
                        }else{
                            $scope.alert('没有播放的视频！');
                        }
                    },function(error){
                        console.log("Submit Error "+error);
                    });
                }else{
                    alert("NO");
                }
            }
        };
        
        
        $scope.preview = function(ipc, $event, type, starttime, endtime){
            console.log("preivew");
            $mdDialog.show({
                controller: ipcplayCtrl,
                templateUrl: '../../views/ipc/ipcplay.html',
                parent:angular.element(document.body),
                targetEvent:$event,
                locals: {
                    'ServiceSetup': ServiceSetup,
                    'ipc': ipc,
                    'starttime':starttime,
                    'endtime':endtime,
                    'type': type
                },
                clickOutsideToclose:true
                //fullscreen: useFullScreen
            });
        };
        
        
    
        $scope.previousPage = function() {
            $scope.currentPage --;
        };

        $scope.nextPage = function (){
            $scope.currentPage ++;
        };
        
        $scope.alert = function(text){
            $mdToast.show(
                $mdToast.simple()
                .textContent($filter('translate')(text))
                .position(last)
                .hideDelay
            );
        };
        
        //$('#datetimppicker').datetimepicker();
        
}]);





