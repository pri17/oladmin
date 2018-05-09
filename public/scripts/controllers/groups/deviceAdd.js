'use strict';

angular.module('ciApp').controller('deviceAddCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$state',  function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $state){

    $scope.ipcs_config = [];
    $scope.ipc = {};
    $scope.ipc_item = {"ip": "", "uri": [], "nickname": "", "enable": 1, "class": ""};

    $scope.reload = function () {
        var promesa = ServiceSetup.getConfig('ipc');
        promesa.then(function(data)
            {
                var text = '';
                if(data.status == 'OK')
                {
                    $scope.ipcs_config = data.data;
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
        console.log("ipc add:" + angular.toJson($scope.ipc, true));
        $scope.ipc_item.ip = $scope.ipc.ip;
        $scope.ipc_item.uri[0] = $scope.ipc.uri;
        $scope.ipc_item.nickname = $scope.ipc.nickname;
        $scope.ipc_item.class = $scope.ipc.class;

        $scope.ipcs_config.push($scope.ipc_item);

        var promesa = ServiceSetup.setConfig('ipc', $scope.ipcs_config);

        promesa.then(function(data)
            {
                var text = '';
                if(data.status == 'OK')
                {
                    text = 'Submit successfully!';
                    $state.transitionTo('ipc.manage');
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

