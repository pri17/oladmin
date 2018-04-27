'use strict';

angular.module('ciApp')
 .controller('systemMonitorCtrl',['$scope', 'ServiceResource', '$interval',  '$mdToast', '$filter', function($scope, ServiceResource, $interval, $mdToast,$filter){
        
        //显示与隐藏
        $scope.showAndHide = function(color){
            var card = document.getElementById("card_"+color).style;
            
            if(card.display=='block'){
                card.display='none';
            }else{
               card.display='block';
            }
        }
        
        //关闭
        $scope.showClose = function(color){
            document.getElementById('md-card_'+color).style.display='none';
        }
        
        //获取当前机械手的位置
        $scope.machine = function (){
            
        }
        
        //设置为光盘匣起始位置
        $scope.saveSite = function(){
            
        }
        
        $scope.data = [[]];
        $scope.labels = [];
        $scope.options = {
            animation: false,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: false,
            pointDot: false,
            datasetStrokeWidth: 0.5
        };
        
        
        
        //cpu监控
        $scope.getCpuData = function() {
            var maximum = document.getElementById('md-card_blue').clientWidth / 2 || 300;
            $scope.mdToast('div: '+maximum+' data:'+$scope.data[0].length);
            if($scope.data[0].length>maximum){
                
                $scope.labels = $scope.labels.shift(1);
                $scope.data[0] = $scope.data[0].slice(1);
            }
            var promesa =  ServiceResource.getCpu('getcpu/cpumonitor');
            promesa.then(function(data){
                if(data.status == "OK"){
                    $scope.labels.push('');
                    $scope.data[0].push(data.data);
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        }
        
        //内存监控
        $scope.data_memory = [[]];
        $scope.labels_memory = [];
        $scope.getMemoryMonitor = function(){
            var maximum = document.getElementById('md-card_yellow').clientWidth / 2 || 300;
            if($scope.data_memory[0].length>maximum){
                $scope.labels_monitor[0] = $scope.labels_memory.shift(1);
                $scope.data_memory[0] = $scope.data_memory[0].slice(1);
            }
            var promesa = ServiceResource.getCpu('getmemorymonitor/memorymonitor');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.labels_memory.push('');
                    $scope.data_memory[0].push(data.data);
                }
            },function(error){
                console.log("Submit Error " +error);
            }); 
        };
        
        //磁盘监控
        $scope.data_disk = [[]];
        $scope.labels_disk = [];
        $scope.getDiskMonitor = function(){
            var maximum = document.getElementById('md-card_purple').clientWidth / 2 || 300;
            if($scope.data_disk[0].length>maximum){
                $scope.labels_disk[0] = $scope.labels_disk.shift(1);
                $scope.data_disk[0] = $scope.data_disk[0].slice(1);
            }
            var promesa = ServiceResource.getCpu('getdiskmonitor/diskmonitor');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.labels_disk.push('');
                    $scope.data_disk[0].push(data.data);
                }
            },function(error){
                console.log('Submit Error ' +error);
            });
            
        };
        
        //网络监控
        $scope.data_network = [[]];
        $scope.labels_network = [];
        $scope.getNetworkMonitor = function(){
            var maximum = document.getElementById('md-card_green').clientWidth / 2 || 300;
            if($scope.data_network[0].length>maximum){
                $scope.labels_network[0] = $scope.labels_network.shift(1);
                $scope.data_network[0] = $scope.data_network[0].slice(1);
            }
            var promesa = ServiceResource.getCpu('getnetwork/networkmonitor');
            promesa.then(function(data){
                if(data.status == 'OK'){
                    $scope.labels_network.push('');
                    $scope.data_network[0].push(data.data);
                }
            },function(error){
                console.log('Submit Error ' +error);
            });
        }
        
        
        //$scope.getCpuData();
        $scope.time_count = 0;
        $scope.getTime_timer = $interval(function(){
            if($scope.time_count % 4 === 0){
                $scope.getCpuData();
            }
            if($scope.time_count % 5 === 0){
                $scope.getMemoryMonitor();
            }
            if($scope.time_count % 6 === 0){
                $scope.getDiskMonitor();
            }
            if($scope.time_count % 7 === 0){
                $scope.getNetworkMonitor();
            }
            
            $scope.time_count++;
        }, 1000);
        
        $scope.mdToast = function(value){
            $mdToast.show(
                $mdToast.simple()
                    .textContent($filter('translate')(value))
                    .position('bottom left')
                    .hideDelay(2000)
            );
        };
        
        
        $scope.$on('$stateChangeStart', function(){
            $interval.cancel($scope.getTime_timer);
            console.log("cancel timer...");
        });
    
}]);



