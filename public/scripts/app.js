'use strict';
/**
 * @ngdoc overview
 * @name itApp
 * @description
 * # itApp
 *
 * Main module of the application.
 */
var app = angular
  .module('ciApp', [
  	'ngMaterial',
  	'ngMessages',
    'oc.lazyLoad',
    'ngAnimate',
    'ui.router',
    'angular-loading-bar',
    'ngFileUpload', 
    'pascalprecht.translate',
  ]);

function mergeTranslation(translation, base) {
	for (var i in base) {
		if (!base.hasOwnProperty(i)) {
			continue;
		}

		if (!translation[i] || !translation[i].length) {
			translation[i] = base[i];
		}
	}

	return translation;
}

app.config(['$translateProvider', function($translateProvider)
{
  $translateProvider
      .translations('zh_CN', mergeTranslation(translations.zh_CN, translations.en_US))
      .preferredLanguage('zh_CN');
//        .preferredLanguage('en_US');
//      .determinePreferredLanguage();
  $translateProvider.useSanitizeValueStrategy('escape');
}]);

app.run(['$animate', function($animate) {
  $animate.enabled(true);
}]);

app.config(['$mdThemingProvider', function($mdThemingProvider) {
  $mdThemingProvider.definePalette('docs-blue', $mdThemingProvider.extendPalette('blue', {
    '50': '#DCEFFF',
    '100': '#AAD1F9',
    '200': '#7BB8F5',
    '300': '#4C9EF1',
    '400': '#1C85ED',
    '500': '#106CC8',
    '600': '#0159A2',
    '700': '#025EE9',
    '800': '#014AB6',
    '900': '#013583',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400'
  }));
  $mdThemingProvider.definePalette('docs-red', $mdThemingProvider.extendPalette('red', {
    'A100': '#DE3641'
  }));

  $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('yellow')
    .dark();

  $mdThemingProvider.theme('default')
      .primaryPalette('docs-blue')
      .accentPalette('docs-red');
}]);
  
app.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    //$urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home',{
        templateUrl:'views/home.html',
        url:'/home',
        controller:'homeCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.css',
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
              ]
            }),
            $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/homeCtrl.js',
                'scripts/services/olfs.js',
                'scripts/services/setup.js'
              ]
            });
          }
        }
        
    })
    .state('data', {
    	template: '<div ui-view></div>',
    	url:'/data',

    })
    .state('data.filesystem', {
    	templateUrl:'views/dataFilesystem.html',
        url:'/filesystem',
        controller:'dataFilesystemCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/dataFilesystemCtrl.js',
                'scripts/services/fs.js',
              ]
            });
          }
        }
    })
    .state('data.history', {
    	templateUrl:'views/data/replayHistory.html',
        url:'/replayHistory',
        controller:'replayHistoryCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/data/replayHistoryCtrl.js',
                'scripts/services/fs.js',
                'scripts/services/setup.js'
              ]
            });
          }
        }
    })
    .state('data.search', {
    	templateUrl:'views/data/search.html',
        url:'/search',
        controller:'searchCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/data/searchCtrl.js',
                'scripts/services/fs.js',
              ]
            });
          }
        }
    })
    
    .state('login', {
    	templateUrl:'views/login.html',
        url:'/login',
        controller:'loginCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/services/user.js',
              ]
            });
          }
        }
    })
    .state('setup', {
        template: '<div ui-view></div>',
        url:'/setup',
    })
    .state('setup.network', {
        templateUrl:'views/setupNetwork.html',
        url:'/network',
        controller:'setupNetworkCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupNetworkCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.buffer', {
        templateUrl:'views/setupBuffer.html',
        url:'/buffer',
        controller:'setupBufferCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupBufferCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.odd', {
        templateUrl:'views/setupOdd.html',
        url:'/odd',
        controller:'setupOddCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupOddCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.operate', {
        templateUrl:'views/setupOperate.html',
        url:'/operate',
        controller:'setupOperateCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupOperateCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.olfs', {
        templateUrl:'views/setupOlfs.html',
        url:'/olfs',
        controller:'setupOlfsCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupOlfsCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.sys', {
    templateUrl:'views/setupSys.html',
        url:'/sys',
        controller:'setupSysCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/setupSysCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('setup.user', {
        templateUrl:'views/set/user.html',
        url:'/user',
        controller:'userCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/set/userCtrl.js',
                'scripts/services/user.js',
              ]
            });
          }
        }
    })
    .state('setup.addUser', {
        templateUrl:'views/set/addUser.html',
        url:'/adduser',
        controller:'addUserCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/set/addUserCtrl.js',
                'scripts/services/user.js',
              ]
            });
          }
        }
    })
    .state('setup.editUser', {
        templateUrl:'views/set/editUser.html',
        url:'/edituser/:id',
        controller:'editUserCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/set/editUserCtrl.js',
                'scripts/services/user.js',
              ]
            });
          }
        }
    })
    .state('ipc', {
    	template: '<div ui-view></div>',
    	url:'/ipc'
    })
    .state('ipc.add', {
    	templateUrl:'views/ipcAdd.html',
        url:'/add',
        controller:'ipcAddCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipcAddCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('ipc.addscan', {
    	templateUrl:'views/ipcAddScan.html',
        url:'/addscan',
        controller:'ipcAddScanCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipcAddScanCtrl.js',
                'scripts/controllers/dialogs/dlgIpcPreviewCtrl.js',
                'scripts/services/setup.js',
              //  'js/video.min.js',
                'js/videojs-contrib-hls.min.js',
                'styles/video-js.min.css',
              ]
            });
          }
        }
    })
    .state('ipc.edit', {
    	templateUrl:'views/ipcEdit.html',
        url:'/edit/:id',
        controller:'ipcEditCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipcEditCtrl.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('ipc.manage', {
    	templateUrl:'views/ipcManage.html',
        url:'/manage',
        controller:'ipcManageCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipcManageCtrl.js',
                'scripts/controllers/dialogs/dlgIpcPreviewCtrl.js',
                'scripts/services/setup.js',
                'js/videojs-contrib-hls.min.js',
                'styles/video-js.min.css',
              ]
            });
          }
        }
    })
    .state('ipc.preview', {
    	templateUrl:'views/ipcPreview.html',
        url:'/preview',
        controller:'ipcPreviewCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipcPreviewCtrl.js',
                'scripts/controllers/dialogs/dlgIpcPreviewCtrl.js',
                'scripts/services/setup.js',
                'js/videojs-contrib-hls.min.js',
                'styles/video-js.min.css',
              ]
            });
          }
        }
    })
    .state('ipc.playback', {
    	templateUrl:'views/ipc/playback.html',
        url:'/playback',
        controller:'playbackCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipc/playbackCtrl.js',
                'scripts/controllers/ipc/ipcplayCtrl.js',
                'scripts/services/setup.js',
                'scripts/services/ipc.js',
                'js/videojs-contrib-hls.min.js',
                'styles/video-js.min.css',
              ]
            });
          }
        }
    })
    .state('ipc.group', {
    	templateUrl:'views/ipc/group.html',
        url:'/group',
        controller:'groupCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipc/groupCtrl.js',
                'scripts/services/ipc.js',
              ]
            });
          }
        }
    })
    .state('ipc.groupadd', {
    	templateUrl:'views/ipc/groupAdd.html',
        url:'/groupadd',
        controller:'groupAddCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipc/groupAddCtrl.js',
                'scripts/services/ipc.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    .state('ipc.groupedit', {
    	templateUrl:'views/ipc/groupEdit.html',
        url:'/groupedit/:id',
        controller:'groupEditCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/ipc/groupEditCtrl.js',
                'scripts/services/ipc.js',
                'scripts/services/setup.js',
              ]
            });
          }
        }
    })
    
    .state('resource', {
            template: '<div ui-view></div>',
            url:'/resource',
        })
       .state('resource.driver',{
        templateUrl:'views/resourceManager/driver.html',
        url:'/driver',
        controller:'driverCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/driver.js',
                         'scripts/services/resource.js'
                    ]
                });
            }
        }
    })
    .state('resource.disc',{
        templateUrl:'views/resourceManager/disc.html',
        url:'/disc',
        controller:'discCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/disc.js',
                            'scripts/services/resource.js'
                    ]
                });
            }
        }
    })
    .state('resource.magazine',{
        templateUrl:'views/resourceManager/magazine.html',
        url:'/magazine',
        controller:'magazineCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/magazine.js',
                         'scripts/services/resource.js'
                    ]
                });
            }
        }
    })
    .state('resource.magazineDetail',{
        templateUrl:'views/resourceManager/magazineDetail.html',
        url:'/magazineDetail/:id',
        controller:'magazineDetailCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/magazineDetail.js',
                         'scripts/services/resource.js'
                    ]
                });
            }
        }
    })
    .state('resource.magazineAdjust',{
        templateUrl:'views/resourceManager/magazineAdjust.html',
        url:'/magazineAdjust/:id',
        controller:'magazineAdjustCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/magazineAdjust.js',
                         'scripts/services/resource.js'
                    ]
                });
            }
        }
    })
    .state('resource.systemMonitor',{
        templateUrl:'views/resourceManager/systemMonitor.html',
        url:'/systemMonitor',
        controller:'systemMonitorCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/resourceManager/systemMonitor.js',
                         'scripts/services/resource.js',
                         //'bower_components/angular-chart.js/dist/angular-chart.css',
                         //'bower_components/angular-chart.js/angular-chart.js',
                         //'bower_components/angular-chart.js/dist/angular-chart.min.js',
                    ]
                });
            }
        }
    })
    .state('task', {
        template: '<div ui-view></div>',
        url:'/task',
    })
    .state('task.taskAll',{
        templateUrl:'views/task/taskAll.html',
        url:'/taskAll',
        controller:'taskAllCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/taskAll.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.all',{
        templateUrl:'views/task/all.html',
        url:'/all',
        controller:'allCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/all.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.complete',{
        templateUrl:'views/task/complete.html',
        url:'/complete',
        controller:'completeCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/complete.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.completeError',{
        templateUrl:'views/task/completeError.html',
        url:'/completeError',
        controller:'completeErrorCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/completeError.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.taskError',{
        templateUrl:'views/task/taskError.html',
        url:'/taskError',
        controller:'taskErrorCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/taskError.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.new',{
        templateUrl:'views/task/new.html',
        url:'/new',
        controller:'newCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/new.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.running',{
        templateUrl:'views/task/running.html',
        url:'/running',
        controller:'runningCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/running.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.wait',{
        templateUrl:'views/task/wait.html',
        url:'/wait',
        controller:'waitCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/wait.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    .state('task.details', {
        templateUrl:'views/task/details.html',
        url:'/details/:id/:type',
        controller:'detailsCtrl',
        resolve:{
            loadMyFile:function($ocLazyLoad){
                return $ocLazyLoad.load({
                    name:'ciApp',
                    files:['scripts/controllers/task/details.js',
                        'scripts/services/task.js'
                    ]
                });
            }
        }
    })
    
    
/*    
    .state('test', {
    	templateUrl:'views/test.html',
        url:'/test',
        controller:'testCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ciApp',
              files:[
                'scripts/controllers/testCtrl.js',
                
              ]
            });
          }
        }
    })
//*/
  }]);
  
  angular.module('ciApp')
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
