<?php

use Phalcon\DI\FactoryDefault,
	Phalcon\Mvc\View,
	Phalcon\Mvc\Url as UrlResolver,
	Phalcon\Db\Adapter\Pdo\Mysql as DbAdapter,
	Phalcon\Mvc\View\Engine\Volt as VoltEngine,
	Phalcon\Mvc\Model\Metadata\Memory as MetaDataAdapter,
	Phalcon\Session\Adapter\Files as SessionAdapter,
	Phalcon\Mvc\Router\Annotations as RouterAnnotations,
	Phalcon\Mvc\Dispatcher as MvcDispatcher, 
	Phalcon\Events\Manager as EventsManager,
	Phalcon\Http\Response\Cookies,
	Phalcon\Crypt,
	Phalcon\Logger\Adapter\File as FileAdapter;
/**
 * The FactoryDefault Dependency Injector automatically register the right services providing a full stack framework
 */
$di = new FactoryDefault();

/**
 * The URL component is used to generate all kind of urls in the application
 */
/*
$di->set('url', function() use ($config) {
	$url = new UrlResolver();
	$url->setBaseUri($config->application->baseUri);
	return $url;
}, true);
//*/

/**
 * Setting up the view component
 */
$di->set('view', function() use ($config) {

	$view = new View();

	$view->setViewsDir($config->application->viewsDir);

	$view->registerEngines(array(
		'.volt' => function($view, $di) use ($config) {

			$volt = new VoltEngine($view, $di);

			$volt->setOptions(array(
				'compiledPath' => $config->application->cacheDir,
				'compiledSeparator' => '_'
			));

			return $volt;
		},
		'.phtml' => 'Phalcon\Mvc\View\Engine\Php'
	));

	return $view;
}, true);


/**
 * Start the session the first time some component request the session service
 */
$di->set('session', function() {
	$session = new SessionAdapter();
	$cookie_lifetime = 864000; //seconds. set cookie's life time to 10 days
	$session_lifetime = 86400; //seconds. set session's life time to 1 day
	$sessionid_changetime = 1800; //seconds. change a new session id.
//	session_set_cookie_params(86400); 
//	$session->setOptions(['cookie_lifetime' => 86400]);


	//handle gabage collection
	
	/*Ubuntu's PHP gc is triggered by crond in /etc/crond./php5, every 30 minutes. So we should modify the php.ini directly.*/
	//ini_set('session.gc_maxlifetime', $session_lifetime);
	$session->start();

	//handle session's lifetime
	if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $session_lifetime)) {
	    // last request was more than 30 minutes ago
	    session_unset();     // unset $_SESSION variable for the run-time 
	    session_destroy();   // destroy session data in storage
	}
	$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp
	//anti-attack
	if (!isset($_SESSION['CREATED'])) {
	    $_SESSION['CREATED'] = time();
	} else if (time() - $_SESSION['CREATED'] > $sessionid_changetime) {
	    // session started more than 30 minutes ago
	    session_regenerate_id(true);    // change session ID for the current session and invalidate old session ID
	    $_SESSION['LAST_CREATED'] = $_SESSION['CREATED'];
	    $_SESSION['CREATED'] = time();  // update creation time
	}
	
	//handle session cookie's lifetime
	setcookie(session_name(),session_id(),time() + $cookie_lifetime, '/'); //correct way to set cookie's life time
	
	return $session;
});

$di->set('cookies', function () {
	$cookies = new Cookies();
	$cookies->useEncryption(true);
	return $cookies; 
});

/*Encryption*/
$di->set('crypt', function () {
	$crypt = new Crypt();
	// Set a global encryption key
	$crypt->setKey('%31.1e$ie86$f!8jz');
	return $crypt; }, true);

/*Logging*/
$di->set('logger', function(){
	$logger = new FileAdapter( "/tmp/logs/demo.log", array(
        'mode' => 'a+'
    ));
	return $logger;
});

/**
 * Setup router 
*/

$di->set('router', function() {	
	// Use the annotations router. We're passing true to use both default route and annotations route.
	$router = new RouterAnnotations(true);
	// Read the annotations from ProductsController if the URI starts with /api/products
	$router->addResource('Checkin', '/api/checkins'); 
	$router->addResource('Upload', '/api/uploads');
	$router->addResource('Course', '/api/courses');
	$router->addResource('User', '/api/users');
	$router->addResource('Network', '/api/networks'); 
	$router->addResource('Cmd', '/api/cmds');
	$router->addResource('Config', '/api/configs');		
	$router->addResource('Odd', '/api/odds');
	
	$router->addResource('Olfs', '/api/olfs');
	$router->addResource('Robot', '/api/robot');
	
	$router->addResource('Fs', '/api/fs');
	$router->addResource('Ipc', '/api/ipcs');
	
        $router->addResource('User', 'api/users');
	
	//localapi
	$router->addResource('LocalApi', '/localapi');
        
	$router->addResource('Resource', '/api/resource');
        $router->addResource('Task', '/api/task');



	return $router;
});


/*
$di->set('dispatcher', function () {
	// Create an event manager
	$eventsManager = new EventsManager();
	// Attach a listener for type "dispatch"
	$eventsManager->attach("dispatch", function ($event, $dispatcher) { // ...
		});
	$dispatcher = new MvcDispatcher();
	// Bind the eventsManager to the view component
	$dispatcher->setEventsManager($eventsManager);
	return $dispatcher; }, true);
//*/

/*save config to di*/
$di->set('config', $config);

