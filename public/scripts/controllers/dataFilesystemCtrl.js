
'use strict';

angular.module('ciApp').controller('dataFilesystemCtrl', ['$scope', '$filter', '$mdToast', '$mdDialog', 'ServiceFs', '$state', function($scope, $filter, $mdToast, $mdDialog, ServiceFs, $state){

	$scope.keyword = '';
	$scope.itemsPerPageOptions = [10, 20, 50, 100];
	$scope.itemsPerPage = 20;
	$scope.totalPage = 1;
	$scope.pageNumOptions = [1];
	$scope.currentPage = 1;
	$scope.orderByItem ='';
	$scope.reverse_flag = false;
	
	$scope.path = '/mnt/fuse';
	$scope.items = [];
	
	$scope.$watchGroup(['itemsPerPage', 'items'], function(newValue, oldValue){
		$scope.totalPage = Math.ceil($scope.items.length / parseInt(newValue));
		$scope.pageNumOptions = [];
		for(var i = 0; i < $scope.totalPage; i++)
			$scope.pageNumOptions.push(i+1);
	}, true);
	
	$scope.capacityToString = function(blocks) {
        var xb = "";
        var data = 0.0;
        data = data + blocks;
        
        if(data > 1024)
        {    
            data = data / 1024;
            xb = "K";
        }
        if(data > 1024)
        {
            data = data / 1024;
            xb = "M";
        }
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
    
    var file_icon_default = 'fa-file-o ol-file-icon';
    var folder_icon_default = 'fa-folder-o ol-file-icon';
    $scope.file_icon_assoc = {
        '.doc': 'fa-file-word-o ol-file-icon',
        '.pdf': 'fa-file-pdf-o ol-file-icon',
        '.mp3': 'fa-file-audio-o ol-file-icon',
        '.mp4': 'fa-file-video-o ol-file-icon',
        '.txt': 'fa-file-text-o ol-file-icon'
    };
    
    $scope.refresh_file_icons = function() {
          for(var i=0; i<$scope.items.length; i++)
          {
              
                  var filename = $scope.items[i].filename;
                  var file_ext = filename.substr(filename.indexOf('.'));
                  if($scope.items[i].isDir)
                  {
                        $scope.items[i].face = folder_icon_default;
                        continue;
                  }
                  $scope.items[i].face = file_icon_default;
                  for(var prop in $scope.file_icon_assoc)
                  {
                      if(prop == file_ext)
                      {
                          $scope.items[i].face = $scope.file_icon_assoc[prop];
                      }
                  }
  
              
          }
    };
	
	$scope.reload = function () {
	    var data = {'path':$scope.path};
		var promesa = ServiceFs.readdir(data);

		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.items = data.data;
				$scope.path = data.path;
				$scope.refresh_file_icons();
			}
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	
	}
	
	$scope.reload();
	

	$scope.search = function(){
	    var data = {'path': $scope.path, 'keyword': $scope.keyword};
		var promesa = 	ServiceFs.search(data);
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				$scope.items = data.data;
				$scope.refresh_file_icons();
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
	
	$scope.open = function(item) {
	    if(item.isDir)
	    {
	        //console.log(item.filename + ' is a directory, just readdir again');
	        $scope.path = $scope.path + '/' +item.filename;
	        $scope.reload();
	    }
	    else
	    {
	        var data = {'path':$scope.path + '/' + item.filename};
    		var promesa = ServiceFs.geturi(data);
    
    		promesa.then(function(data)
    		{
    			var text = '';
    			if(data.status == 'OK')
    			{
    				
    			}
    			
    		}
    		,function(error)
    		{
    			alert("Error " + error);
    		});
	    }
	}
	
    $scope.previousPage = function() {
    	$scope.currentPage --;
    };
    
    $scope.nextPage = function (){
    	$scope.currentPage ++;
    }
    
    
}]);

