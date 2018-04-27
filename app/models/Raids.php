<?php

class Raids extends ConfigBase
{
    protected $debug = true;
    protected $prefix = '/Raids/';
    protected $schema = array (
  'magic' => '/^.+$/',
  'timestamp' => 0,
  'data' => 
  array (
  	0 => array(
      'device' => '/^.+$/',
      'mount_point' => '/^.+$/',
      'raid' => true, 
      'level' => 0,
      'disk' => 
      array (
      	'/^.+$/',
      ),
     )
  ),
);
    protected $schema_require = array (
);
    protected $schema_default = array (
  'magic' => 'OpStorBuffer.v1',
  'timestamp' => 0,
  'data' => 
  array (
  	0 => array (
      'device' => 'md0',
      'mount_point' => '/mnt/loca/hdd',
      'raid' => true, 
      'level' => 0,
      'disk' => 
      array (
      	'sda',
      ),
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

