'use strict';

angular.module('ciApp').service('ServiceSetup', ['$http', '$q', function($http, $q) {
	var cmd_api_url = 'api/cmds/';
	var config_api_url = 'api/configs/';

	this.setCmd = function(data, param)
	{
		var defer = $q.defer();

		$http.post(cmd_api_url + 'set/' + data, param)
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
	
	this.getCmd = function(data)
	{
		var defer = $q.defer();

		$http.get(cmd_api_url + 'get/' + data)
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
	
	this.queryCmd = function(data)
	{
		var defer = $q.defer();

		$http.get(cmd_api_url + 'query/' + data)
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
	
	this.getShmCmd = function(data, param)
	{
		var defer = $q.defer();

		$http.post(cmd_api_url + 'getshm/' + data, param)
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
	
	
	this.setConfig= function(data, content)
	{
		var defer = $q.defer();

		$http.post(config_api_url + 'set/' + data, content)
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
	
	this.getConfig = function(data)
	{
		var defer = $q.defer();

		$http.get(config_api_url + 'get/' + data)
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
	
    this.sendCmd = function(data, param)
	{
		var defer = $q.defer();

		$http.post(cmd_api_url + 'send/' + data, param)
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

