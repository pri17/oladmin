'use strict';

app.controller('topCtrl', ['$scope', '$mdSidenav', '$window', function($scope, $mdSidenav, $window){
	
	$scope.nav_menu = [
		{
			'title':'Home',
			'type': 'link',
			'state':'home',
		},
		{
			'title' : 'Resource',
			'type' : 'toggle',
			'children' : [
			    {
			        'title' : 'Drive',
			        'type' : 'link',
			        'state' : 'resource.driver'
			    },
                                                         {
			        'title' : 'Medium',
			        'type' : 'link',
			        'state' : 'resource.magazine'
			    },
                                                         {
			        'title' : 'Storage',
			        'type' : 'link',
			        'state' : 'resource.disc'
			    },
                                                          {
			        'title' : 'Performance',
			        'type' : 'link',
			        'state' : 'resource.systemMonitor'
			    },
			],
		},
		{
		    'title' : 'Task',
		    'type' : 'toggle',
		    'children' : [
		        {
		            'title' : 'task_all',
		            'type' : 'link',
		            'state' : 'task.taskAll'
		        },
                                                    {
		            'title' : 'Overview',
		            'type' : 'link',
		            'state' : 'task.all'
		        },
		        {
		            'title' : 'New',
		            'type' : 'link',
		            'state' : 'task.new'
		        },
		        {
		            'title' : 'Complete',
		            'type' : 'link',
		            'state' : 'task.complete'
		        },
		        {
		            'title' : 'Wait',
		            'type' : 'link',
		            'state' : 'task.wait'
		        },
		        {
		            'title' : 'Error',
		            'type' : 'link',
		            'state' : 'task.taskError'
		        },
		    ],
		},
		{
		    'title' : 'Data',
		    'type' : 'toggle',
		    'children' : [
		        {
		            'title' : 'Filesystem',
		            'type' : 'link',
		            'state' : 'data.filesystem'
		        },
		        {
		            'title' : 'History',
		            'type' : 'link',
		            'state' : 'data.history'
		        },
		        {
		            'title' : 'Search',
		            'type' : 'link',
		            'state' : 'data.search'
		        },
		    ],
		},
		{
		    'title' : 'Log',
		    'type' : 'toggle',
		    'children' : [
		        {
		            'title' : 'Robot',
		            'type' : 'link',
		            'state' : 'log.robot'
		        },
		        {
		            'title' : 'Filesystem',
		            'type' : 'link',
		            'state' : 'log.filesystem'
		        },
		        {
		            'title' : 'Drive',
		            'type' : 'link',
		            'state' : 'log.drive'
		        },
		    ],
		},
		{
		    'title' : 'Ip camera',
		    'type' : 'toggle',
		    'children' : [
		        {
		            'title' : 'Manage',
		            'type' : 'link',
		            'state' : 'ipc.manage'
		        },
		        {
		            'title' : 'Preview',
		            'type' : 'link',
		            'state' : 'ipc.preview'
		        },
		        {
		            'title' : 'Playback',
		            'type' : 'link',
		            'state' : 'ipc.playback'
		        },
                        {
		            'title' : 'Group',
		            'type' : 'link',
		            'state' : 'ipc.group'
		        },
		    ],
		},
		{
		    'title' : 'Setup',
		    'type' : 'toggle',
		    'children' : [
		        {
		            'title' : 'Network',
		            'type' : 'link',
		            'state' : 'setup.network'
		        },
		        {
		            'title' : 'Buffer',
		            'type' : 'link',
		            'state' : 'setup.buffer'
		        },
		        {
		            'title' : 'ODD',
		            'type' : 'link',
		            'state' : 'setup.odd'
		        },
		        {
		            'title' : 'User',
		            'type' : 'link',
		            'state' : 'setup.user'
		        },
//		        {
//		            'title' : 'Service',
//		            'type' : 'link',
//		            'state' : 'setup.service'
//		        },
		        {
		            'title' : 'Operate',
		            'type' : 'link',
		            'state' : 'setup.operate'
		        },
		        {
		            'title' : 'OLFS',
		            'type' : 'link',
		            'state' : 'setup.olfs'
		        },
		        {
		            'title' : 'System',
		            'type' : 'link',
		            'state' : 'setup.sys'
		        },
//		        {
//		            'title' : 'Misc',
//		            'type' : 'link',
//		            'state' : 'setup.misc'
//		        },
		    ],
		},
		{
            'title' : 'Groups',
            'type' : 'toggle',
            'children' : [
                {
                    'title' : 'Manage',
                    'type' : 'link',
                    'state' : 'groups.manage'
                },
            ],
		}

	];
	
	$scope.openNav = function(){
		$mdSidenav('left').toggle();
	};
	
	$scope.closeNav = function(){
		$mdSidenav('left').close();
	};
	
    $scope.$on('$stateChangeStart',
	function(event, toState, toParams, fromState, fromParams){
	    $scope.closeNav();
	})

	}]);