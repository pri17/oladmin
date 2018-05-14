'use strict';

angular.module('ciApp').controller('clustersManageCtrl',['$scope','$filter','$state','$mdDialog', '$mdToast',
    function($scope, $filter,$state, $mdDialog, $mdToast){

        $scope.keyword = '';

        $scope.itemsPerPageOptions = [10, 20, 50, 100];
        $scope.itemsPerPage = 10;
        $scope.totalPage = 1;
        $scope.pageNumOptions = [1];
        $scope.currentPage = 1;
        $scope.orderByItem ='';
        $scope.reverse_flag = false;

        $scope.dds = [
                    {
                        "ip": "192.168.1.169",
                        "nickname": "设备2",
                        "version": "8.8"
                    },
                    {
                        "ip": "192.168.1.170",
                        "nickname": "设备03",
                        "version": "2.0"
                    },
                    {
                        "ip": "192.168.1.172",
                        "nickname": "设备05",
                        "version": "1.1"
                    },
                    {
                        "ip": "192.168.1.171",
                        "nickname": "设备04",
                        "enable": 1,
                        "version": "1.1"
                    },
                    {
                        "ip": "192.168.1.168",
                        "nickname": "设备01",
                        "version": "1.1.1"
                    },
                    {
                        "ip": "192.168.1.64",
                        "nickname": "",
                        "version": "1.1.1"
                    },
                    {
                        "ip": "192.168.1.11:8899",
                        "nickname": "",
                        "version": "1.0"
                    },
                    {
                        "ip": "192.168.1.11",
                        "nickname": "",
                        "version": "3.3.3"
                    },
            {
                "ip": "192.168.1.169",
                "nickname": "设备2",
                "version": "8.8"
            },
            {
                "ip": "192.168.1.170",
                "nickname": "设备03",
                "version": "2.0"
            },
            {
                "ip": "192.168.1.172",
                "nickname": "设备05",
                "version": "1.1"
            },
            {
                "ip": "192.168.1.171",
                "nickname": "设备04",
                "enable": 1,
                "version": "1.1"
            },
            {
                "ip": "192.168.1.168",
                "nickname": "设备01",
                "version": "1.1.1"
            },
            {
                "ip": "192.168.1.64",
                "nickname": "",
                "version": "1.1.1"
            },
            {
                "ip": "192.168.1.11:8899",
                "nickname": "",
                "version": "1.0"
            },
            {
                "ip": "192.168.1.11",
                "nickname": "",
                "version": "3.3.3"
            }
                ];



        $scope.$watchGroup(['itemsPerPage', 'dds'], function(newValue, oldValue){
            $scope.totalPage = Math.ceil($scope.dds.length / parseInt(newValue));
            $scope.pageNumOptions = [];
            for(var i = 0; i < $scope.totalPage; i++)
                $scope.pageNumOptions.push(i+1);
        }, true);


        $scope.add = function(){
            $state.go('clusters.add');
        };

        $scope.edit = function(item){
            var idx = $scope.dds.indexOf(item);
            $state.transitionTo('clusters.edit', {'id': idx});
        };

        $scope.search = function(){
            var promesa = 	ServiceIpc.search($scope.keyword);
            promesa.then(function(data)
                {
                    var text = '';
                    if(data.status == 'OK')
                    {
                        $scope.dds = data.data;
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

        $scope.del = function(dd, ev) {
            console.log("device del:" + angular.toJson(dd, true));
            var confirm = $mdDialog.confirm()
                .title($filter('translate')('Would you like to delete the item?'))
                .textContent(' ')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok($filter('translate')('OK'))
                .cancel($filter('translate')('no'));
            $mdDialog.show(confirm).then(function() {
                var idx = $scope.dds.indexOf(ipc);
                $scope.dds.splice(idx, 1);

                $scope.save();

            }, function() {
                console.log("You cancel the deletion operation!");
            });

        };

        $scope.delAll = function(dd, ev) {
            console.log("device delAll:" + angular.toJson(dd, true));
            var confirm = $mdDialog.confirm()
                .title($filter('translate')('Would you like to delete all the item?'))
                .textContent(' ')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok($filter('translate')('OK'))
                .cancel($filter('translate')('No!'));
            $mdDialog.show(confirm).then(function() {
                $scope.dds = [];
                $scope.save();
            }, function() {
                console.log("You cancel the deletion operation!");
            });

        };

        $scope.save = function() {
            var promesa = ServiceSetup.setConfig('dd', $scope.dds);

            promesa.then(function(data)
                {
                    var text = '';
                    if(data.status == 'OK')
                    {
                        text = 'Save successfully!';
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

        $scope.previousPage = function() {
            $scope.currentPage --;
        };

        $scope.nextPage = function (){
            $scope.currentPage ++;
        }

}]);


