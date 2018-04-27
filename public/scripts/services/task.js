'use strict';

angular.module('ciApp').service('ServiceTask', ['$http','$q',function($http,$q){
        var task_api_url = '/api/task/';
        
        this.getTask = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'taskall/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
             return defer.promise;
        };
        
        this.getTaskAll = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'all/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getTaskComplete = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'taskcomplete/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getTaskCompleteError = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'taskcompleteerror/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        }
        
        this.getTaskError = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'taskerror/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getTaskNew = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'tasknew/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getRunning = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'running/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getTaskWait = function(data){
            var defer = $q.defer();
            $http.post(task_api_url+'wait/'+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
        this.getDetails = function(data, param){
            var defer = $q.defer();
            $http.post(task_api_url+'taskdetails/'+data, param)
                    .success(function(data){
                        defer.resolve(data);
                    }).error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        };
        
}]);


