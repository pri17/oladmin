<?php

class Odds extends ConfigBase
{
    protected $debug = true;
    protected $prefix = '/Odd/';
    protected $schema = array (
  'magic' => '/^.+$/',
  'timestamp' => 0,
  'data' => 
  array (
  	'sr0' => '/^.+$/',
  ),
);
    protected $schema_require = array (
);
    protected $schema_default = array (
  'magic' => 'OpStorBuffer.v1',
  'timestamp' => 0,
  'data' => 
  array (
  	'sr0' => 'sr0',
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

