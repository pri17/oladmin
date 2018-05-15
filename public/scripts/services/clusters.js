'use strict';

angular.module('ciApp').service('ServiceClusters',['$http','$q',function($http, $q){
    var clusters_api_url = '/api/clusters/';

    this.getCluster = function(param, data){
        var defer = $q.defer();
        $http.post(clusters_api_url+'getcluster/'+data, param)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            });
        return defer.promise;
    };

    this.getmultiple = function(param, data){
        var defer = $q.defer();
        $http.post(clusters_api_url+'getmultiple/'+data, param)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            });
        return defer.promise;
    };


    this.getGroup = function(data){
        var defer = $q.defer();
        $http.post(clusters_api_url+'get/'+data)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            });
        return defer.promise;
    };

    this.getModelGroup = function(data){
        var defer = $q.defer();
        $http.post(clusters_api_url+'getmodel/'+data)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            })
        return defer.promise;
    }

    this.delGroup = function(data, param){
        var defer = $q.defer();
        $http.post(clusters_api_url+'del/'+data, param)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            });
        return defer.promise;
    }

    this.setGroup = function(param, data){
        var defer = $q.defer();
        $http.post(clusters_api_url+'set/'+data, param)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            })
        return defer.promise;
    };

    this.editGroup = function(data, param){
        var defer = $q.defer();
        $http.post(clusters_api_url+'edit/'+data, param)
            .success(function(data){
                defer.resolve(data);
            })
            .error(function(data){
                defer.reject(data);
            });
        return defer.promise;
    }
}]);


