'use strict';

angular.module('ciApp').service('ServiceUser', ['$http','$q',function($http,$q){
        var user_api_url = '/api/users/';
        
        this.getUser = function(data){
            var defer = $q.defer();
            $http.post(user_api_url + 'get/' + data)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(data){
                    defer.reject(data);
                });
            return defer.promise;
        };
        
        this.setUser = function(data, param){
            var defer = $q.defer();
            $http.post(user_api_url + 'set/' + data, param)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(data){
                    defer.reject(data);
                });
            return defer.promise;
        };
        
        this.getUserModel = function(data){
            var defer = $q.defer();
            $http.post(user_api_url + 'getmodel/' + data)
                .success(function(data){
                    defer.resolve(data);
                })
                .error(function(data){
                    defer.reject(data);
                });
            return defer.promise;
        };
        
        this.setUserModel = function(data, param){
            var defer = $q.defer();
            $http.post(user_api_url + 'setmodel/' + data, param)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
}]);


