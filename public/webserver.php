<?php
$stdout = fopen('php://stdout', 'w');
fwrite($stdout, $_SERVER['REQUEST_URI']."\n");
//fclose($stdout);

//handle /fonts/fontawesome-webfont.ttf?v=4.3.0
$uri = $_SERVER['REQUEST_URI'];
if(1 == preg_match('/^(.+)\?.*$/', $uri, $match))
{
	$uri = $match[1];
	fwrite($stdout, "\t=>".$uri."\n");
}

if (file_exists(__DIR__ . '/' . $uri)) 
{
if(preg_match('/\.css|\.js|\.jpg|\.png|\.map|\.html|\.manifest$/', $uri, $match)){
    $mimeTypes = [
        '.css' => 'text/css',
        '.js'  => 'application/javascript',
        '.jpg' => 'image/jpg',
        '.png' => 'image/png',
        '.map' => 'application/json',
	'.html' => 'text/html',
	'.manifest' => 'text/cache-manifest',
    ];
    header("Content-Type: {$mimeTypes[$match[0]]}");
}
    $path = __DIR__ . $uri;
    if (is_file($path)) {
        require $path;
        exit;
    }
}

fwrite($stdout, "pass to index.php\n");
//fclose($stdout);
$_GET['_url'] = $_SERVER['REQUEST_URI'];
require_once 'index.php';
