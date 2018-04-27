
'use strict';

angular.module('ciApp').controller('ipcManageCtrl', ['$scope', '$filter', '$mdToast', '$mdDialog', 'ServiceSetup', '$state', function($scope, $filter, $mdToast, $mdDialog, ServiceSetup, $state){

	$scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
	
	$scope.ipcs = [];
	
	$scope.$watchGroup(['itemsPerPage', 'ipcs'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.ipcs.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
	
	$scope.reload = function () {
		var promesa = ServiceSetup.getConfig('ipc');
		//var promesa = ServiceCheckins.getBatchByIndex('studentno','*', 100, '');
	
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs = data.data;
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	}
	
	$scope.reload();
	
	$scope.add = function(){
		$state.transitionTo('ipc.add');
	};
	
	$scope.addScan = function(){
		$state.transitionTo('ipc.addscan');
	};
	
	$scope.edit = function(item){
	    var idx = $scope.ipcs.indexOf(item);
		$state.transitionTo('ipc.edit', {'id': idx});
	};
	
	$scope.preview = function(ipc, $event){
		console.log("preivew:");
		console.log(ipc);
		
		var uri;
		if(angular.isArray(ipc.uri))
		    uri = ipc.uri[0];
		else
		    uri = ipc.uri;
		$mdDialog.show({
         parent: angular.element(document.body),
         targetEvent: $event,
         templateUrl: '../../views/dialogs/ipcPreviewDialog.html',
         locals: {
           'ServiceSetup': ServiceSetup,
           'ip': ipc.ip,
           'uri': uri,
         },
         controller: dlgIpcPreviewCtrl,
         clickOutsideToClose: true
      });
	};
	
	$scope.search = function(){
		var promesa = 	ServiceIpcs.search($scope.keyword);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.ipcs = data.data;
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

    
	$scope.del = function(ipc, ev) {
		console.log("ipc del:" + angular.toJson(ipc, true));
		var confirm = $mdDialog.confirm()
          .title($filter('translate')('Would you like to delete the item?'))
          .textContent(' ')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok($filter('translate')('OK'))
          .cancel($filter('translate')('No!'));
	    $mdDialog.show(confirm).then(function() {
	        var idx = $scope.ipcs.indexOf(ipc);
	        $scope.ipcs.splice(idx, 1);
	        
	      	$scope.save();
			
	    }, function() {
	      console.log("You cancel the deletion operation!");
	    });
		
	};
	
	$scope.delAll = function(ipc, ev) {
		console.log("ipc delAll:" + angular.toJson(ipc, true));
		var confirm = $mdDialog.confirm()
          .title($filter('translate')('Would you like to delete all the item?'))
          .textContent(' ')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok($filter('translate')('OK'))
          .cancel($filter('translate')('No!'));
	    $mdDialog.show(confirm).then(function() {
	      	$scope.ipcs = [];
			$scope.save();
	    }, function() {
	      console.log("You cancel the deletion operation!");
	    });
		
	};
	
	$scope.save = function() {
	    var promesa = ServiceSetup.setConfig('ipc', $scope.ipcs);
		
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
    
    $scope.setCommand = function(command) {
		var promesa = ServiceSetup.setCmd(command);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				 console.log("setCommand" + command + " successfully");
			}
			
		}
		,function(error)
		{
			console.log("setCommand: " + command + "Error " + error);
		});
		
	};
    
    $scope.checkRunCmd = function(command) {
		var promesa = ServiceSetup.queryCmd(command);
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				if(data.data.status == 'ERROR') //the command daemon is no up.
				    $scope.setCommand(command);
				else
				    console.log(command + " is running now, dont start again");
			}
			//console.log("getDmesg :" + data.data + " at " + now);
		},
		function(error) {
			console.log("checkCmdRun error: " + error);	
		});
	};
	
	$scope.checkRunCmd('ipcpreview');
	
}]);

