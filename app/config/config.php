<?php

return new \Phalcon\Config(array(
	'database' => array(
		'adapter'     => 'Mysql',
		'host'        => 'localhost',
		'username'    => 'root',
		'password'    => '',
		'dbname'      => 'angularphalcon',
	),
	'application' => array(
		'controllersDir' => __DIR__ . '/../../app/controllers/',
		'modelsDir'      => __DIR__ . '/../../app/models/',
		'viewsDir'       => __DIR__ . '/../../app/views/',
		'pluginsDir'     => __DIR__ . '/../../app/plugins/',
		'libraryDir'     => __DIR__ . '/../../app/library/',
		'cacheDir'       => __DIR__ . '/../../app/cache/',
		'uploadDir'       => __DIR__ . '/../../public/uploads/',
		//'baseUri'        => '/angularphalcon/',
		//'baseUri'        => '/',
	),
	'leveldb' => array(
		'filePath' => __DIR__ . '/../../app/db/ci',
	),
	'setting' => array(
		'xsrf_detect' => false,
		'logging' => true,
	),

));
