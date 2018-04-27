'use strict';

angular.module('ciApp').controller('searchCtrl', ['$scope', '$mdToast', 'ServiceFs', function($scope, $mdToast, ServiceFs){
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
        
        
}]);


