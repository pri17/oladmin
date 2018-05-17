<?php

class ConfigBase
{
	protected $debug = true;
	
    const CONFIGS_PATH = '/../setup/etc/config/';
    const DEFAULT_CONFIGS_PATH = '/../setup/etc/config/default/';

    public function log($data) 
    {
	    $di = Phalcon\DI::getDefault();
	    if( null != $di->getLogger() && isset($this->debug) && $this->debug == true)
	    	$di->getLogger()->log($data);
    }
    
    //return an array or false
	public function getConfig($name)
	{
		$pathname = self::CONFIGS_PATH;
		$pathname = __DIR__ . $pathname . $name;

		$config = file_get_contents($pathname);
		if($config === false)
		{
			$this->log(__FUNCTION__."Get config: ". $pathname ." failed \n");
			return false;
		}
		else
			return json_decode($config, true); 
	}
	
	//$data is an array
	public function setConfig($name, $data)
	{
		if($this->validate($data) == false)
		{
            $this->log(__FUNCTION__."Set config validate failed \n");
            return false;
		}
		
		$data = $this->combineDefault($data);
		
		if($data == false) {
            $this->log(__FUNCTION__."Set config combine failed \n");
            return false;
        }
		
		$pathname = self::CONFIGS_PATH;
		$pathname = __DIR__ . $pathname . $name;

		$result = file_put_contents($pathname, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
		if($result ===false)
		{
			$this->log(__FUNCTION__."\nSet config: ". $pathname ." failed \n");
			return false;
		}
	
		return true; 
	}
	
	public function setDefaultConfig($name)
	{
		$pathname = self::DEFAULT_CONFIGS_PATH;
		$pathname = __DIR__ . $pathname . $name;

		$config = file_get_contents($pathname);
		if($config === false)
		{
			$this->log(__FUNCTION__."Get default config: ". $pathname ." failed \n");
			return false;
		}
		else
			$data = json_decode($config, true);
			
		$pathname = self::CONFIGS_PATH;
		$pathname = __DIR__ . $pathname . $name;

		$result = file_put_contents($pathname, json_encode($data, JSON_PRETTY_PRINT));
		if($result ===false)
		{
			$this->log(__FUNCTION__."Set default config: ". $pathname ." failed \n");
			return false;
		}
	
		return true; 
	}
	
	public function validate($data)
    {
	    if(!isset($this->schema))
		    return false;

	    //check required prop
	    if(isset($this->schema_require))
	    {
		    foreach($this->schema_require as $key => $value)
		    {
			    if($value == true && !array_key_exists($key, $data))
			    {
				    $this->log(__FUNCTION__.": $key is required");
				    return false;
			    }
		    }
   	    }

	    //check content of prop.
	    foreach($data as $key => $value)
	    {
		    if(!array_key_exists($key, $this->schema))
		    {
			    $this->log(__FUNCTION__.": $key is unrecognized");
			    return false;
		    }
		    if(is_numeric($this->schema[$key]) && !is_numeric($data[$key]))
		    {
			    $this->log(__FUNCTION__.": $key is not number");
			    return false;
		    }
		    if(is_bool($this->schema[$key]) && !is_bool($data[$key]))
		    {
			    $this->log(__FUNCTION__.": $key is not bool");
			    return false;
		    }
		    if(is_array($this->schema[$key]) && !is_array($data[$key]))
		    {
			    $this->log(__FUNCTION__.": $key is not array");
			    return false;
		    }
		    if(is_string($this->schema[$key]) && !is_string($data[$key]))
		    {
			    $this->log(__FUNCTION__.": $key is not string");
			    return false;
		    }
		    //addtional check for string type
		    if(is_string($this->schema[$key]))
		    {
			    if( 1 != preg_match($this->schema[$key], $value, $matches))
			    {
				    $this->log(__FUNCTION__.": $key : $value preg_match failed ----, this->schema[$key]:". $this->schema[$key]);
				    return false;
			    }
			    if($matches[0] != $value)
			    {
				    $this->log(__FUNCTION__.": $key : $value preg_match failed, matches[0]: ".$matches[0]);
				    return false;
			    }
		    }
	    }

	    return true;
    }

    public function combineDefault($data)
    {
	    if(!isset($this->schema_default))
		    return false;
	    $default = $this->schema_default;
	    foreach($default as $key => $value)
	    {
		    if(array_key_exists($key, $data))
		    {
			    $default[$key] = $data[$key];
		    }
	    }

	    //$this->log("after combineDefaut, value:".json_encode($default));
	    return $default;
    }
}