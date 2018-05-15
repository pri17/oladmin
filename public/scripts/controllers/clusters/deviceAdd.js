'use strict';

angular.module('ciApp').controller('deviceAddCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$state',
    function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $state){

    $scope.dds_config = [];
    $scope.device = {};
    $scope.d_item = {"ip": "", "nickname": "", "version": ""};

        $scope.reload = function () {
            var promesa = ServiceSetup.getConfig('cluster');
            promesa.then(function(data)
                {
                    var text = '';
                    if(data.status == 'OK')
                    {
                        $scope.dds_config = data.data;
                    }

                }
                ,function(error)
                {
                    alert("Error " + error);
                });

        };

        $scope.reload();
        //toast
        var last = 'bottom left';

    $scope.addAction = function() {
        console.log("device add:" + angular.toJson($scope.device, true));
        $scope.d_item.ip = $scope.device.ip;
        $scope.d_item.nickname = $scope.device.nickname;
        $scope.d_item.version = $scope.device.version;

        $scope.dds_config.push($scope.d_item);

        var promesa = ServiceSetup.setConfig('cluster', $scope.dds_config);

        promesa.then(function(data)
            {
                var text = '';
                if(data.status == 'OK')
                {
                    text = 'Submit successfully!';
                    $state.transitionTo('clusters.manage');
                }
                else
                {
                    text = 'Failed';
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent($filter('translate')(text))
                            .position(last)
                            .hideDelay
                    );
                }

                console.log(text);
                console.log($scope.dds_config);
            }
            ,function(error)
            {
                alert("Error " + error);
            });


    };

}]);

