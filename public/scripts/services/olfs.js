'use strict';

angular.module('ciApp').service('ServiceOlfs', ['$http', '$q', function($http, $q) {
	var api_url = 'api/olfs/';

	this.setCmd = function(data, param)
	{
		var defer = $q.defer();

		$http.post(api_url + 'set/' + data, param)
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
	
	this.getStatus = function()
	{
		var defer = $q.defer();

		$http.get(api_url + 'getstatus')
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

