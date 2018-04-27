'use strict';

angular.module('ciApp').service('ServiceResource',['$http','$q',function($http,$q){
        var resoure_api_url = 'api/resource/';
        
        //光驱
        this.getQuery = function(data){
            var defer = $q.defer();
             $http.post(resoure_api_url+"getquery/"+data)
                     .success(function(data){
                         defer.resolve(data);
                    }).error(function(data){
                        defer.reject(data)
                    });
              return defer.promise;//param
        };
        
        //光驱数
        this.getNumber = function(data,param){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getdriverinfo/"+data,param)
                    .success(function(data){
                        defer.resolve(data);
                    }).error(function(data){
                        defer.reject(data);
                    });
                    
            return defer.promise;
        };
        
        //光盘匣
        this.getMagazine = function(data){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getmagazine/"+data)
                    .success(function(data){
                        defer.resolve(data);
                     })
                    .error(function(data){
                        defer.reject(data);
                     });
            return defer.promise;
        };
        
        //光盘匣信息更新
        this.getAjaxInfo = function(data){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getajaxinfo/"+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        }
        
        //光盘匣详细信息
        this.getDetail = function(data,param){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getdetail/"+data,param)
                    .success(function(data){
                        defer.resolve(data);
                     })
                    .error(function(data){
                        defer.reject(data);
                     });
            return defer.promise;
        };
        
        this.getAdjustMagazine = function(data,param){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getadjust/"+data,param)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
              return defer.promise;
        };
        
        this.getAdjustFeedBackInfo = function(data){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getfeedbackinfo/"+data)
                    .success(function(data){
                        defer.resolve(data);
                     })
                    .error(function(data){
                        defer.reject(data);
                     });
             return defer.promise;
        };
        
        this.getMachine = function(data){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getmagazineposition/"+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
             return defer.promise;
        };
        
        this.getAjaxPosition = function(data){
            var defer = $q.defer();
            $http.then(resoure_api_url+"getsaveposition/"+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
             return defer.promise;
        };
        
        this.saveSite = function(data, param){
            var defer = $q.defer();
            $http.post(resoure_api_url+"getsavemagazineadjust/"+data, param)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
             return defer.promise;
        };
        
        //光盘
        this.getDiscInfo = function(data, param){
            var defer = $q.defer();
            $http.post(resoure_api_url+'getdiscinfo/'+data, param)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
                    
             return defer.promise;
        };
        
        //cpu监控
        this.getCpu = function (data){
            var defer = $q.defer();
            $http.post(resoure_api_url+data)
                    .success(function(data){
                        defer.resolve(data);
                    })
                    .error(function(data){
                        defer.reject(data);
                    });
            return defer.promise;
        }
        
}]);
    
