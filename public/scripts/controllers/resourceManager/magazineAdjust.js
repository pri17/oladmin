'use strict';

angular.module('ciApp').config(function($mdIconProvider){
    $mdIconProvider.iconSet('device', 'img/icons/sets/device-icons.svg', 24);
})
 .controller('magazineAdjustCtrl',['$scope',  '$mdDialog', '$filter', 'ServiceResource', '$stateParams', '$interval', function($scope,  $mdDialog, $filter, ServiceResource, $stateParams, $interval){
        $scope.horizontalAdjust1 = 0;
        $scope.horizontalAdjust2 = 0;
        $scope.horizontalAdjust3 = 0;
        $scope.horizontalAdjust4 = 0;
        $scope.horizontalAdjust5 = 0;
        $scope.horizontalAdjust6 = 0;
        $scope.horizontalAdjust7 = 0;
        $scope.horizontalAdjust8 = 0;
        
        $scope.verticalAdjust1 = 0;
        $scope.verticalAdjust2 = 0;
        $scope.verticalAdjust3 = 0;
        $scope.verticalAdjust4 = 0;
        $scope.verticalAdjust5 = 0;
        $scope.verticalAdjust6 = 0;
        $scope.verticalAdjust7 = 0;
        $scope.verticalAdjust8 = 0;
        $scope.boxNo = $stateParams.id;//光盘匣号
        $scope.position=$filter('translate')('resourceManager_magazineAdjust_Unknown');
        
        $scope.HAdjustingHintId = "";
        $scope.VAdjustingHintId = "";
         var id= $stateParams.id;
        $scope.adjustTimeId= -1;
        $scope.saveTimeId = -1;
        
        $scope.MagazineAdjust = function(type){
             var offset = -1;
             if($scope.HAdjustingHintId == ""&& $scope.VAdjustingHintId ==""){
                 offset = $scope.getAdjustValue(type);
                 alert(offset);
                 if(-1 != offset){
                     var param = {'offset':offset,'type':type};
                     var promesa = ServiceResource.getAdjustMagazine('adjust', param);
                     promesa.then(function(data){
                          if (data.data == 'success') {
                                if ("left" == type || "right" == type || "leftStep" == type || "rightStep" == type){
                                    $scope.HAdjustingHintId = "resourceManager_magazineAdjust_AdjustingHint";
                                }else{
                                    $scope.VAdjustingHintId = "resourceManager_magazineAdjust_AdjustingHint";
                                }
//                                adjustTimeId = setInterval("ajaxGetAdjustFeedBackInfo('" + type + "')", 500);
                                   $scope.adjustTimeId = $interval(function(){
					$scope.ajaxGetAdjustFeedBackInfo(type);
				}, 500);
                            }else {
                                $scope.showAlert('resourceManager_magazineAdjust_AdjustFailed');
                            }
                     },function(error){
                         console.log("Submit Error "+error);
                     });
                 }else{
                     $scope.showAlert('resourceManager_magazineAdjust_AdjustValueInvalid');
                 }
             }else{
                 $scope.showAlert('site_index_LibAction_a1');
             }
             
        };
        
        $scope.ajaxGetAdjustFeedBackInfo = function(type){
             var promesa = ServiceResource.getAdjustFeedBackInfo('adjustfeedback');
             promesa.then(function(data){
                 if(data.ret == true){
                     if (-1 != $scope.adjustTimeId)
                        {
                            clearInterval($scope.adjustTimeId);
                        }
                        if ("left" == type || "right" == type || "leftStep" == type || "rightStep" == type){
                             $scope.HAdjustingHintId = "";
                        }else{
                            $scope.VAdjustingHintId = "";
                        }
                        
                        if (0 != data.errorCode)
                        {
                            alert(data.errorInfo);
                        }
                 }
             },function(error){
                 console.log("Submit Error "+error);
             });
        }
        
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
        $scope.getMagazinePosition = function (){
            var promesa = ServiceResource.getMachine('getMagazinePosition');
            promesa.then(function(data){
                if(data.status == 'OK'&&data.result == "success"){
                    $scope.saveTimeId = $interval(function(){
					$scope.ajaxGetSavePosition();
				}, 500);
                }else{
                    $scope.showAlert('resourceManager_magazineAdjust_GetPositionFailed');
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        }
        
        $scope.ajaxGetSavePosition = function(){
            var promesa = ServiceResource.getAjaxPosition("ajaxGetSavePosition");
            promesa.then(function(data){
                if(data.status == 'OK'&&data.ret == true){
                   if (-1 != $scope.saveTimeId){
                            $interval.cancel($scope.saveTimeId);
                   }
                    $scope.positionH = data.positionH;
                    $scope.positionL = data.positionL;
                    var position = parseFloat(positionH) + parseFloat((parseFloat(positionL) / 10000).toFixed(4)); 
                        $scope.position = position;
                }
            });
           
        }
        
        //设置为光盘匣起始位置
        $scope.saveMagazineAdjust = function(){
            var param = {'positionH':$scope.positionH,'positionL':$scope.positionL,'magazineId':id};
            var promesa = ServiceResource.saveSite('savemagezineadjust' ,param);
            promesa.then(function(data){
                if (data.status =="OK"&&data.ret=="success"){
                       $scope.showAlert("resourceManager_magazineAdjust_SavePositionSuccess");
                }else{
                        $scope.showAlert("resourceManager_magazineAdjust_SavePositionFailed");
                }
            },function(error){
                console.log("Submit Error "+error);
            });
        }
        
        $scope.getAdjustValue = function (type){
            var value = 0;
            var sum = 0;
            switch (type){
                case "right":
                case "left":
                    
                    sum = $scope.horizontalAdjust1 * Math.pow(10, (8 - 1))+$scope.horizontalAdjust2 * Math.pow(10, (8 - 2))+$scope.horizontalAdjust3 * Math.pow(10, (8 - 3))+$scope.horizontalAdjust4 * Math.pow(10, (8 - 4))+
                            $scope.horizontalAdjust5 * Math.pow(10, (8 - 5))+$scope.horizontalAdjust6 * Math.pow(10, (8 - 6))+$scope.horizontalAdjust7 * Math.pow(10, (8 - 7))+$scope.horizontalAdjust8 * Math.pow(10, (8 - 8));
                    break;
                case "up":
                case "down":
                     sum = $scope.verticalAdjust1 * Math.pow(10, (8 - 1))+$scope.verticalAdjust2 * Math.pow(10, (8 - 2))+$scope.verticalAdjust3 * Math.pow(10, (8 - 3))+$scope.verticalAdjust4 * Math.pow(10, (8 - 4))+
                            $scope.verticalAdjust5 * Math.pow(10, (8 - 5))+$scope.verticalAdjust6 * Math.pow(10, (8 - 6))+$scope.verticalAdjust7 * Math.pow(10, (8 - 7))+$scope.verticalAdjust8 * Math.pow(10, (8 - 8));
                    break;  
                case "rightStep":
                case "leftStep":
                case "upStep":
                case "downStep":
                    sum = 1;
                    break;
                default:
                    sum = -1;
                    break;
            }
            
            return sum;
        }
        
         
        
        
        
        $scope.showAlert = function(text){
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent($filter('translate')(text))
                    .ariaLabel('Alert Dialog Demo')
                    .ok('确定')
            );
        }
        
}]);


