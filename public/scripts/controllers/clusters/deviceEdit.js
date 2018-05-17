'use strict';

angular.module('ciApp').controller('deviceEditCtrl', ['$scope', '$mdToast', 'ServiceSetup', '$filter', '$stateParams', '$state',
    function($scope, $mdToast, ServiceSetup, $filter, $stateParams, $state){

    $scope.dds_config = [];
    $scope.device = {};
    $scope.reload = function () {
        var promesa = ServiceSetup.getConfig('cluster');

        promesa.then(function(data)
            {
                var text = '';
                if(data.status == 'OK')
                {
                    $scope.dds_config = data.data;
                    var d = $scope.dds_config[$stateParams.id];
                    $scope.device = d;
                    // console.log("data:"+angular.toJson(data.data, true));
                    console.log("d:"+angular.toJson(d, true));
                    console.log("id:"+$stateParams.id);

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


    $scope.submitAction = function() {
        console.log("device edit:" + angular.toJson($scope.device, true));
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
            }
            ,function(error)
            {
                alert("Error " + error);
            });


    };
}]);

