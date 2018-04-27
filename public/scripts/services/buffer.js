'use strict';

angular.module('ciApp').service('ServiceBuffers', ['$http', '$q', function($http, $q) {
	var api_url = 'api/buffers/';
	
	
	this.getBatch = function(id_start, num)
	{
		var defer = $q.defer();

		$http.get(api_url + 'get/Id/' + id_start + '/' + num)
		.success(function(data, status, headers, config)
		{
			defer.resolve(data);
		})
		.error(function(data, status, headers, config)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.getBatchByIndex = function(index_name, index_value, num, key_start)
	{
		var defer = $q.defer();

		$http.get(api_url + 'get/' + index_name + '/' + index_value + '/' + num  +key_start)
		.success(function(data, status, headers, config)
		{
			defer.resolve(data);
		})
		.error(function(data, status, headers, config)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.get = function(id)
	{
		var defer = $q.defer();

		$http.get(api_url + 'get/' + id)
		.success(function(data, status, headers, config)
		{
			defer.resolve(data);
		})
		.error(function(data, status, headers, config)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.del = function(id)
	{
		var defer = $q.defer();

		$http.get(api_url + 'del/' + id)
		.success(function(data, status, headers, config)
		{
			defer.resolve(data);
		})
		.error(function(data, status, headers, config)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
	this.add = function(data)
	{
		var defer = $q.defer();

		$http.post(api_url + 'add', data)
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

	this.set = function(data)
	{
		var defer = $q.defer();

		$http.post(api_url + 'set/' + data.id, data)
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


	this.search = function(data)
	{
		var defer = $q.defer();

		$http.get(api_url + 'search/' + data)
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
	
	
	this.getAll = function()
	{
		var defer = $q.defer();

		$http.get(api_url + 'get')
		.success(function(data, status, headers, config)
		{
			defer.resolve(data);
		})
		.error(function(data, status, headers, config)
		{
			defer.reject(data);
		});

		return defer.promise;
	};
	
}]);

