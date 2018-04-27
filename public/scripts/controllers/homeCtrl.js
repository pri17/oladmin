'use strict';

angular.module('ciApp').controller('homeCtrl', ['$scope', '$mdToast', '$filter', '$mdSidenav', 'ServiceOlfs', '$interval', 'ServiceSetup', function($scope, $mdToast, $filter, $mdSidenav, ServiceOlfs, $interval, ServiceSetup){
	$scope.time_count = 0;
	$scope.events_ref_key={'var_key': -1};
	$scope.messages_ref_key={'var_key': -1};
	//Storage chart
    $scope.capacity = {
            labels: ["Used", "Available"],
            data: [310,690],
            options:{
                colors: [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
                cutoutPercentage: 20,

                },
            onClick: function (points, evt) {
              console.log(points, evt);
            },
            onHover: function (points, evt) {
              //console.log(points, evt);
            }
    };
    
    //file system status;
    $scope.fsStatus = {
        'mode': 'startup',
    }; //default values
    
    //Data activities
    $scope.messages = [];
    /*
    $scope.messages = [
    { 
        'date' : '2016-07-31',
        'list' :[
          {
            'path' : '/backup_2016-08/test.iso',
          },
          {
            'path' : '/backup_2016-08/test.doc',
          },
          {
            'path' : '/backup_2016-08/test.pdf',
          },
          {
            'path' : '/backup_2016-08/test.mp3',
          },
          {
            'path' : '/backup_2016-08/test.mp4',
          }, 
          {
            'path' : '/backup_2016-08/test.txt',
          }
      ]
    },
    { 
        'date' : '2016-08-02',
        'list' :[
           {
            'path' : '/backup_2016-08/test.iso',
          },
          {
            'path' : '/backup_2016-08/test.doc',
          },
          {
            'path' : '/backup_2016-08/test.pdf',
          },
          {
            'path' : '/backup_2016-08/test.mp3',
          },
          {
            'path' : '/backup_2016-08/test.mp4',
          },
          {
            'path' : '/backup_2016-08/test.txt',
          }
      ]
    }
      
    ];
 //*/   
    var file_icon_default = 'fa-file-o ol-file-icon';
    $scope.file_icon_assoc = {
        '.doc': 'fa-file-word-o ol-file-icon',
        '.pdf': 'fa-file-pdf-o ol-file-icon',
        '.mp3': 'fa-file-audio-o ol-file-icon',
        '.mp4': 'fa-file-video-o ol-file-icon',
        '.txt': 'fa-file-text-o ol-file-icon'
    };
    
    $scope.refresh_file_icons = function() {
          for(var i=0; i<$scope.messages.length; i++)
          {
              
                  var filename = $scope.messages[i].content;
                  var file_ext = filename.substr(filename.indexOf('.'));
                  $scope.messages[i].face = file_icon_default;
                  for(var prop in $scope.file_icon_assoc)
                  {
                      if(prop == file_ext)
                      {
                          $scope.messages[i].face = $scope.file_icon_assoc[prop];
                      }
                  }
  
              
          }
    };
    
    //event related
    $scope.events = [];
    /*
    $scope.events = [
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'normal',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'warning',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'warning',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'error',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'normal',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'warning',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'error',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'normal',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'warning',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'error',
    },
    { 
        'date' : '2016-07-31',
        'content' : 'Burn finished',
        'module' : 'ODD',
        'level' : 'normal',
    },
    ];
    */
    var event_icon_default = 'fa-info-circle ol-icon-normal';
    $scope.event_icon_assoc = {
        'normal': 'fa-info-circle ol-icon-normal',
        'warning': 'fa-warning ol-icon-warning',
        'error': 'fa-times ol-icon-error',
    };
    $scope.refresh_event_icons = function() {
          for(var i=0; i<$scope.events.length; i++)
          {

              $scope.events[i].face = event_icon_default;
              for(var prop in $scope.event_icon_assoc)
              {
                  if(prop == $scope.events[i].level)
                  {
                      $scope.events[i].face = $scope.event_icon_assoc[prop];
                  }
              }

          }
    };
    
    
    //Initialization
    $scope.refresh_file_icons();
    $scope.refresh_event_icons();
    
    $scope.currentTime = 0;
    $scope.getCurrentTime = function() {
        var d = new Date();
        $scope.currentTime =  d.getTime();
    };
    
    $scope.getTime_timer = $interval(function(){
					$scope.getCurrentTime();
					if($scope.time_count % 5 === 0)
					{
					    $scope.getFsStatus();
					}
					if($scope.time_count % 6 === 0)
					{
					    $scope.getShmResponse('logread', $scope.events, $scope.events_ref_key, $scope.refresh_event_icons);
					}
					if($scope.time_count % 7 === 0)
					{
					    $scope.getShmResponse('accesslogr', $scope.messages, $scope.messages_ref_key, $scope.refresh_file_icons);
					}
					$scope.time_count++;
				}, 1000);
    
    
    //==========
    /*convert MB to GB/TB..., return string*/
    $scope.capacityToString = function(blocks) {
        var xb = "M";
        var data = 0.0;
        data = data + blocks;
        
        if(data > 1024)
        {    
            data = data / 1024;
            xb = "G";
        }
        if(data > 1024)
        {
            data = data / 1024;
            xb = "T";
        }
        if(data > 1024)
        {
            data = data / 1024;
            xb = "P";
        }
        
        return data.toFixed(1) + xb + 'B';
    };
    
    //toast
	var last = 'bottom left';
	
    $scope.getFsStatus = function() {
    	var promesa = ServiceOlfs.getStatus();
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.fsStatus = data.data;
				$scope.capacity.data[0] = $scope.fsStatus.used_blocks; //used
				$scope.capacity.data[1] = $scope.fsStatus.total_blocks - $scope.fsStatus.used_blocks; //available
			}
			else
			{
				text = 'Get Filesystem Status failed';
			
				$mdToast.show(
			      $mdToast.simple()
			        .textContent($filter('translate')(text))
			        .position(last)
			        .hideDelay(2000)
		    	);
			}
		}
		,function(error)
		{
			console.log("Submit Error " + error);
		});
    };
    
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

	$scope.getShmResponse = function(command, ret, ref_key, callback) {
		var promesa = ServiceSetup.getShmCmd(command, ref_key);
		promesa.then(function(data) {
			var now = new Date();
			if(data.status == 'OK')
			{
				var status = data.status;
				if(status == 'OK')
				{
					if(data.data.length > 0)
					{
					    ref_key.var_key = data.data[data.data.length - 1].var_key;
					    for(var i = 0; i < data.data.length; i++)
					        ret.push(data.data[i]);
					     
					    if(ret.length > 100) //maximum 100 messages
					    {
					        ret.splice(0, ret.length - 100);
					    }
					    
					    callback();
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
	
    
    $scope.getFsStatus();
    //launch the server side log daemon
    
    $scope.checkRunCmd('logread');
    $scope.checkRunCmd('accesslogr');
    //====================
    
    
    
	
    //==========
    
    
    
    $scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    console.log("cancel timer...");
	    $interval.cancel($scope.getTime_timer);
	});
	
    
	}]);