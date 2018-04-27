'use strict';

angular.module('ciApp').controller('magazineDetailCtrl',['$scope','$filter','$mdToast', 'ServiceResource', '$stateParams', '$interval',function($scope,$filter,$mdToast,ServiceResource, $stateParams, $interval){
        $scope.keyword='';
        $scope.itemsPerPageOptions=[10, 20, 50, 100];
        $scope.itemsPerPage=20;
        $scope.totalPage=1;
        $scope.pageNumOptions = [1];
        $scope.currentPage = 1;
        $scope.orderByItem ='';
        $scope.reverse_flag = false;
        
        var id= ($stateParams.id)-1;
        
        $scope.detailValue=[];
        
        $scope.$watchGroup(['itemsPerPage', 'DetailValue'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.detailValue.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
        
        
        $scope.reload = function(){
            var param = {'id':id};
            var promesa = ServiceResource.getDetail('detail',param);
            promesa.then(function(data){
                var text = "";
                if(data.status == 'OK'){
                    $scope.getValue(data.data);
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
        
        $scope.search = function(){
            var promesa = ServiceResource.search($scope.keyword);
            promesa.then(function(data){
                var text = '';
                if(data.status == 'OK'){
                    $scope.detailValue=data.data;
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
        };
        
        $scope.getValue = function(data){
            if(data!=""&data!=null){
                for(var i = 0; i < 12 ; i++ ){
                    var innerText = "";
                    switch (data.burned[i]){
                        case 1:
                                innerText = "Used";
                            break;
                        case 2:
                                innerText = "Busy";
                            break;
                        case 3:
                                innerText = "Offline";
                            break;
                        default:
                                innerText = "Empty";
                            break;
                    }
                    $scope.detailValue.push({"no":i+1,"unknow":data.volumeId[i],"uVolume":data.discType[i],"status":innerText});
                }
            }
        }
        
        $scope.previousPage = function() {
            $scope.currentPage --;
        };
    
        $scope.nextPage = function (){
            $scope.currentPage ++;
        }
        
        $scope.magazinDetailAjax = function(){
            var param = {'id':id};
            var promesa = ServiceResource.getDetail('detail',param);
            promesa.then(function(data){
                var text = data.data;
                if(text!=""&text!=null){
                    for(var i = 0; i < $scope.detailValue.length ; i++ ){
                        $scope.detailValue[i]['unknow'] = text.volumeId[i];
                        $scope.detailValue[i]['uVolume'] = text.discType[i];
                        switch (text.burned[i]){
                            case 1:
                                $scope.detailValue[i]['status'] = "Used";
                                break;
                            case 2:
                                $scope.detailValue[i]['status'] = "Busy";
                                break;
                            case 3:
                                $scope.detailValue[i]['status'] = "Offline";
                                break;
                            default:
                                $scope.detailValue[i]['status'] = "Empty";
                                break;
                        }
                    }
                }
                
            },function(error){
                console.log("Submit Error "+error);
            });
        }
        
        $scope.getTime_timer = $interval(function(){
            $scope.magazinDetailAjax();
        }, 2*1000);
        
        $scope.$on('$stateChangeStart', function(){
            console.log("cancel timer...");
            $interval.cancel($scope.getTime_timer);
        });
        
}]);

