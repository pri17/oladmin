<?php

class Networks extends ConfigBase
{
    protected $debug = true;
    protected $prefix = '/Network/';
    protected $schema = array (
  'magic' => '/^.+$/',
  'timestamp' => 0,
  'data' => 
  array (
    0 => 
    array (
      'device' => '/^.+$/',
      'newname' => '/^.+$/',
      'proto' => '/^.+$/',
      'ip' => '/^.+$/',
      'mask' => '/^.+$/',
      'gateway' => '/^.+$/',
      'dns' => '/^.+$/',
    ),
  ),
);
    protected $schema_require = array (
);
    protected $schema_default = array (
  'magic' => 'OpStorNetwork.v1',
  'timestamp' => 0,
  'data' => 
  array (
    0 => 
    array (
      'device' => 'eth0',
      'newname' => 'eth0',
      'proto' => 'dhcp',
    ),
    0 => 
    array (
      'device' => 'eth0:1',
      'newname' => 'eth0:1',
      'proto' => 'static',
      'ip' => '192.168.103.251',
      'mask' => '255.255.255.0',
    ),
  ),
);
    protected $indice = array (
);
    
    public function getConfig($name)
    {
    	$result = parent::getConfig($name);
    	if($result == false)
    		return array();
    	return $result['data']; //only return the key part 
    }
    
    public function setConfig($name, $data)
    {
    	$content = $this->schema_default;
    	$content['data'] = $data;
    	$content['timestamp'] = time();
    	return parent::setConfig($name, $content);
    }
  
   
}

