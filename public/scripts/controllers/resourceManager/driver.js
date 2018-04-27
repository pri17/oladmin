'use strict';

angular.module('ciApp')
.controller('driverCtrl',['$scope', '$state', 'ServiceResource', '$mdToast', '$filter', '$interval',function($scope,$state,ServiceResource,$mdToast,$filter,$interval){
    
    $scope.image= 'img/image/driver.png';
    $scope.items =[];
     var last = 'bottom left';
     $scope.driverNum = 0;
     $scope.query = function(){
        var promesa = ServiceResource.getQuery("query");
        promesa.then(function(data){
            if(data.status == 'OK'){
                $scope.driverNum = data.number;
                $scope.driverNumber(data.number);
            }else{
              var  text = 'Get config failed';
                    $mdToast.show(
                             $mdToast.simple()
                             .textContent($filter('translate')(text))
                             .position(last)
                             .hideDelay(2000)
                    );
            }
        },function(error){
            console.log("Submit Error "+error);
        });
    };
    
    $scope.query();
    
    $scope.getTime_timer = $interval(function(){
        if($scope.driverNum>0){
            //$scope.driverNumber($scope.driverNum);
            for(var i=0;i<$scope.driverNum;i++){
                $scope.ativeTable(i+1);
            }
            
        }
    }, 2*1000);
    
    $scope.driverNumber = function(num){
        for(var i=0;i<num;i++){
            //$scope.items.push({'no':i+1,'status':0,'speed':'0 MB/s','Tspeed':'0 MB/s','recordRadio':10,'driverRecordTime':'0h:0m:0s','driverReadTime':'0h:0m:0s','driverAge':'0h',lastStatus:'success'});
               
            var param = {'id':i+1};
            var promesa = ServiceResource.getNumber("driverinfo",param);
            promesa.then(function(data){
                if(data.status == "OK"){
                    var dataValue = data.data;
                    if(dataValue.length !== 0){
                        $scope.items.push({'no':dataValue['id'],'status':dataValue[9],'speed':(dataValue[12] * 4.39).toFixed(2)+' MB/s','Tspeed':(dataValue['burn_speed_total'] * 4.39).toFixed(2)
                       +' MB/s','recordRadio':dataValue[11].toFixed(2) + " %",'driverRecordTime':dataValue[8],'driverReadTime':'0h:0m:0s','driverAge':'0h','lastStatus':dataValue[10]});
                    }
                    
                }else{
                    var text = 'Get config failed';
                    $mdToast.show(
                                 $mdToast.simple()
                                 .textContent($filter('translate')(text))
                                 .position(last)
                                 .hideDelay(2000)
                        );
                }
            },function(error){
                console.log("Submit Error " +error);
            });
            
        }
    }
    
    
    $scope.ativeTable = function(num){
        var param = {'id':num};
        var promesa = ServiceResource.getNumber("driverinfo",param);
        promesa.then(function(data){
            if(data.status == "OK"){
                $scope.updatItem(data.data);
            }else{
                var text = 'Get config failed';
                $mdToast.show(
                             $mdToast.simple()
                             .textContent($filter('translate')(text))
                             .position(last)
                             .hideDelay(2000)
                    );
            }
        },function(error){
            console.log("Submit Error " +error);
        });
    };
    
    $scope.updatItem = function(data){
        if(data!=null&data!=""){
             for(var i=0;i<$scope.items.length;i++){
                if($scope.items[i]['no']==data['id']){
                    //$scope.items.push({'driverRecordTime':data[8],'driverReadTime':'0h:0m:0s','driverAge':'0h',lastStatus:data[10]});
                    $scope.items[i]['status'] = data[9];
                    $scope.items[i]['speed'] = (data[12] * 4.39).toFixed(2)+' MB/s';
                    $scope.items[i]['Tspeed'] = (data['burn_speed_total'] * 4.39).toFixed(2)+' MB/s';
                    $scope.items[i]['recordRadio'] = data[11].toFixed(2) + " %";
                    $scope.items[i]['driverRecordTime'] = data[8];
                    $scope.items[i]['lastStatus'] = data[10];
                }
             }
        }
    };
    
    $scope.$on('$stateChangeStart', function(){
        console.log("cancel timer...");
	$interval.cancel($scope.getTime_timer);
    });
    
    
}]);



