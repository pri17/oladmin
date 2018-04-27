'use strict';

app.controller('loginCtrl', ['$scope', '$mdToast', 'ServiceUsers', function($scope, $mdToast, ServiceUsers){
	$scope.login = {
		'username':'',
		'password':'',
	};
	
	$scope.loginAction = function() {
		console.log("login");
		var promesa = ServiceUsers.login($scope.login);
		
		promesa.then(function(data)
		{
			var text = '';
			if(data.status == 'OK')
			{
				text = 'Login successfully!';
			}
			else
			{
				text = 'Failed';
			}
/*			
			var translatedText = '';
			$translate(text).then(function (translation) {
			  translatedText = translation;
			});
*/
			var pos = 'bottom left';
			console.log("login result:" + text);			
			$mdToast.show(
		      $mdToast.simple()
		        .textContent(text)
		        .position(pos)
		        .hideDelay(2000)
	    	);
			
		}
		,function(error)
		{
			alert("Error " + error);
		});
	};
}]);
