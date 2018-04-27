'use strict';

angular.module('ciApp').controller('magazineCtrl',['$scope','$filter','$mdToast', 'ServiceResource', '$interval',function($scope, $filter, $mdToast, ServiceResource, $interval){
        $scope.keyword='';
        
        $scope.itemsPerPageOptions=[10, 20, 50, 100];
        $scope.itemsPerPage=20;
        $scope.totalPage=1;
        $scope.pageNumOptions = [];
        $scope.currentPage = 1;
        
        $scope.orderByItem ='';
        $scope.reverse_flag = false;
        
        $scope.itemsValue=[];
        
        $scope.magazine_number = 0;
        $scope.slots_total = 0;
        $scope.arrayCount = [];
        
        var last = 'bottom left';
        $scope.reload = function(){
            var promesa = ServiceResource.getMagazine('magazine');
            promesa.then(function(data){
                var text = "";
                if(data.status == 'OK'){
                    $scope.magazine_number = data.magazine_number;
                    $scope.slots_total = data.slots_total;
                    $scope.getValue($scope.slots_total);
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
        }
        
        $scope.reload();
        
        $scope.search=function(){
            var promesa = ServiceResource.search($scope.keyword);
            promesa.then(function(data){
                var text = '';
                if(data.status == 'OK'){
                    $scope.itemsValue=data.data;
                }else{
                    var pos = 'bottom left';
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent($filter('translate')('Search failed'))
                        .position(pos)
                        .hideDelay(2000)
                     );
                }
            },function(error){
                alert("Error "+error);
            });
        }
        
        $scope.getValue = function(slots_total){
            for(var i=0;i<slots_total;i++){
                $scope.itemsValue.push({"magazineNo":i+1,"magazineTVolume":"300G","magazineUVolume":"0.00G","magazineRadio":"0.00%","magazineStatus":"1","magazineAdjust":"校准","magazineView":"查看详情"});
            }
        };
        
        
        $scope.getTime_timer = $interval(function(){
            if($scope.slots_total>0){
                //$scope.driverNumber($scope.driverNum);
                //for(var i=0;i<$scope.slots_total;i++){
                    $scope.getAjaxInfo();
                //}
            }
        }, 2*1000);
        
        
        $scope.getValueInfo = function(data){
            
            for(var i = 0; i < $scope.magazine_number ; i++ ){         
                        $scope.arrayCount[i] = data[i];
            }
            
            if(data!=null&data!=""){
                for(var i=0;i<$scope.itemsValue.length;i++){
                    //if($scope.itemsValue.magazineNo==data){
                        $scope.itemsValue[i]['magazineTVolume'] = "300 G";
                        $scope.itemsValue[i]['magazineUVolume'] = (parseInt($scope.arrayCount[i]) * 25).toFixed(2) + " G" ;;
                        $scope.itemsValue[i]['magazineRadio'] = ((parseInt($scope.arrayCount[i]) / 12) * 100).toFixed(2)+ " %";
                        if((parseInt($scope.arrayCount[i])) == 0){
                            $scope.itemsValue[i]['magazineStatus'] = 'Empty';
                        }else{
                            $scope.itemsValue[i]['magazineStatus'] = 'Used';
                        }
                        
                    //}
                }
            }
        }
        
        $scope.getAjaxInfo = function(){
            //var param = {'id': num};
            var promesa = ServiceResource.getAjaxInfo('getajaxinfo');
            promesa.then(function(data){
                $scope.getValueInfo(data.data);
            });
        }
        
        
        $scope.$watchGroup(['itemsPerPage', 'itemsValue'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.itemsValue.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
        
        $scope.previousPage = function() {
            $scope.currentPage --;
        };
    
        $scope.nextPage = function (){
            $scope.currentPage ++;
        }
        
        $scope.$on('$stateChangeStart', function(){
            console.log("cancel timer...");
            $interval.cancel($scope.getTime_timer);
        });
}]);