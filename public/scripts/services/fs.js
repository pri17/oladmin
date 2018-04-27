'use strict';

angular.module('ciApp').service('ServiceFs', ['$http', '$q', function($http, $q) {
	var api_url = 'api/fs/';

	this.readdir = function(param)
	{
		var defer = $q.defer();

		$http.post(api_url + 'readdir/', param)
		.success(function(data)
		{
			defer.resolve(data);
		})
		.error(function(data)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.read = function(param)
	{
		var defer = $q.defer();

		$http.post(api_url + 'read/', param)
		.success(function(data)
		{
			defer.resolve(data);
		})
		.error(function(data)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.search = function(param)
	{
		var defer = $q.defer();

		$http.post(api_url + 'grep/', param)
		.success(function(data)
		{
			defer.resolve(data);
		})
		.error(function(data)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.geturi = function(param)
	{
		var defer = $q.defer();

		$http.post(api_url + 'geturi/', param)
		.success(function(data)
		{
			defer.resolve(data);
		})
		.error(function(data)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
}]);

