'use strict';

angular.module('ciApp').controller('groupsManageCtrl',['$scope', '$stateParams',
    function($scope, $stateParams){

        $scope.keyword = '';

        $scope.add = function(){
            $state.transitionTo('device.add');
        };

        $scope.search = function(){
            var promesa = 	ServiceIpc.search($scope.keyword);
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


}]);


