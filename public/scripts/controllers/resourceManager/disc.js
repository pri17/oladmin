'use strict';

angular.module('ciApp').controller('discCtrl',['$scope', 'ServiceResource', '$interval', function($scope, ServiceResource, $interval){
        
        $scope.msgOp = "send";
        var timeId = -1;
        
        $scope.libTVolume='0 G';
        $scope.libUVolume='0 G';
        $scope.libRadio='0%';
        $scope.discType='蓝光光盘';
        $scope.numberOfDisc='0';
        $scope.discDetail='This is Disc Detail! A Type Disc ,B Type Disc, C Type Disc.where is A disc produced? how many A Type disc in the lib?';
        $scope.image="img/image/disc.png";
        
    $scope.discInfo = function(){
        var param = {'op':$scope.msgOp,'Id':0};
        var promesa =  ServiceResource.getDiscInfo('discinfo',param);
        promesa.then(function(data){
            var d=data.data;
             if (d.ret == true){
                        var radio = (parseInt(d.value[1]) / parseInt(d.value[0]) * 100).toFixed(2);
                        if (isNaN(radio)){
                            radio = 0;
                        }
                        $scope.libTVolume = " " + d.value[0] + " G";
                        $scope.libUVolume = " " + d.value[1] + " G";
                        $scope.libRadio = " " + radio + " %";

                        $scope.msgOp = "send";

             } else if (d.ret == false){
                   $scope.msgOp = "recv";
             }
        },function(error){
             console.log("Submit Error "+error);
        });
    };
    
    
    $scope.getTime_timer = $interval(function(){
        $scope.discInfo();
    }, 2*1000);
    
    $scope.$on('$stateChangeStart', function(){
        console.log("cancel timer...");
	$interval.cancel($scope.getTime_timer);
    });
    
    
}]);



