'use strict';

angular.module('ciApp').controller('replayHistoryCtrl', ['$scope', 'ServiceSetup', function($scope, ServiceSetup){
         $scope.messages = [];
         $scope.messages_ref_key={'var_key': -1};
         
         $scope.getShmResponse = function() {
		var promesa = ServiceSetup.getShmCmd('accesslogr', $scope.messages_ref_key);
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.status;
				if(status == 'OK')
				{
					if(data.data.length > 0)
					{
					    $scope.messages_ref_key.var_key = data.data[data.data.length - 1].var_key;
					    for(var i = 0; i < data.data.length; i++)
					        $scope.messages.push(data.data[i]);
					     
					    if($scope.messages.length > 100) //maximum 100 messages
					    {
					        $scope.messages.splice(0, $scope.messages.length - 100);
					    }
					}
				}
				else if(status == 'BUSY')
				{
					console.log("command busy at " + now);
				}
			}
		},
		function(error) {
			console.log("getResponse error: " + error);	
		});
	};
        
         $scope.getShmResponse();
        
}]);


