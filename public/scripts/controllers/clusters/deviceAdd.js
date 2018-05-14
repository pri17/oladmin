'use strict';

angular.module('ciApp').controller('deviceAddCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$state',
    function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $state){

    $scope.dds_config = [];
    $scope.d = {};
    $scope.d_item = {"ip": "", "nickname": "", "version": ""};

    $scope.reload = function () {
        var promesa = ServiceSetup.getConfig('clusters');
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
        console.log("ipc add:" + angular.toJson($scope.d, true));
        $scope.d_item.ip = $scope.d.ip;
        $scope.d_item.nickname = $scope.d.nickname;
        $scope.d_item.version = $scope.d.version;

        $scope.dds_config.push($scope.d_item);

        var promesa = ServiceSetup.setConfig('ipc', $scope.dds_config);

        promesa.then(function(data)
            {
                var text = '';
                if(data.status == 'OK')
                {
                    text = 'Submit successfully!';
                    $state.transitionTo('groups.manage');
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
            }
            ,function(error)
            {
                alert("Error " + error);
            });


    };

}]);

