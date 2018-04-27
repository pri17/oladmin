<?php
use Phalcon\Validation;
use Phalcon\Validation\Validator\Email;
use Phalcon\Validation\Validator\PresenceOf;
use Phalcon\Validation\Validator\Identical;
use Phalcon\Validation\Validator\ExclusionIn;
use Phalcon\Validation\Validator\InclusionIn;
use Phalcon\Validation\Validator\Regex;
use Phalcon\Validation\Validator\StringLength;
use Phalcon\Validation\Validator\Between;
use Phalcon\Validation\Validator\Confirmation;
use Phalcon\Validation\Validator\Url;

include(dirname(__FILE__) . '/SSDB.php');

class ModelBase
{
    public $db = null;
    public $content;
    
    /**
     * Open DB
     */
    public function connect() {
	    if($this->db != null)
		    return true;
	    $di = Phalcon\DI::getDefault();

	    try{

		    $this->db = new SimpleSSDB('127.0.0.1', 8006);
		//$ssdb->easy();
	    }catch(Exception $e){
			$di->getLogger()->log("Open db: $db_name failed!");
		    	die(__LINE__ . ' ' . $e->getMessage());
	    }

	    return true;
    }

	function __destruct()
	{
		if($this->db != null)
		{
			$this->db->close();
			$this->log("db_close in __destruct");
		}
	}
    /**
     * Close DB
     */
    public function close() {
/* mask the following code if wanting long-term db connection. __destruct() will take care of db close() then. 
	    if($this->db != null)
	    {
		    $this->db->close();
		    $this->db = null;
	    }
//*/
    }

    public function log($data) 
    {
	    $di = Phalcon\DI::getDefault();
	    if( null != $di->getLogger() && isset($this->debug) && $this->debug == true)
	    	$di->getLogger()->log($data);
    }

    /*common low level functions*/

    /*Return false if the key does not exist. Return value otherwise.*/
    public function get_ll($key)
    {
	    if($this->connect())
	    {
		    $value = $this->db->get($key);
		    $this->close();
		    return $value;
	    }

	    return false;
    }

    public function set_ll($key, $value)
    {
	    if($this->connect())
	    {

		    $ret = $this->db->set($key, $value);
		    $this->close();
		    return $ret;
	    }

	    return false;
    }

    public function mset_ll($kv_array)
    {
	    if($this->connect() == false)
		return false;

	    $ret = $this->db->multi_set($kv_array);
	    $this->close();
	    return $ret;
    }

    public function del_ll($key)
    {
	    if($this->connect())
	    {

		    $ret = $this->db->del($key);
		    $this->close();
		    return $ret;
	    }

	    return false;

    }

    /*Return kv_array where key_start < key <= $key_end, or count(kv_array) <= limit. Key == '' means no key specified*/
    public function scan_ll($key_start, $key_end, $limit = 0)
    {
	    if($this->connect() == false)
		return false;

	    $out = $this->db->scan($key_start, $key_end, $limit);
	    $this->close();

	    return $out;

    }

    /*Return kv_array where key_end <= key < $key_start, or count(kv_array) <= limit*/
    public function rscan_ll($key_start, $key_end, $limit = 0)
    {
	    if($this->connect() == false)
		return false;

	    $out = $this->db->rscan($key_start, $key_end, $limit);
	    $this->close();

	    return $out;

    }

    /*common high level functions*/
/*
    //return false or value
    public function getById($id)
    {
	    $key = $this->prefix.'Id/'.$id;
	    return $this->get_ll($key);
    }

    //return true or false
    public function setById($id, $value)
    {
	    $key = $this->prefix.'Id/'.$id;
	    return $this->set_ll($key, $value);
    }

    public function mset($kv_array)
    {
    }

    public function delById($id)
    {
	    $key = $this->prefix.'Id/'.$id;
	    return $this->del($key);
    }

    public function scanById($id_start, $id_end, $limit = 0)
    {
	    $key_start = $this->prefix.'Id/'.$id_start; 
	    $key_end = '';
	    if($id_end != '')
		    $key_end = $this->prefix.'Id/'.$id_end;

	    return $this->scan_ll($key_start, $key_end, $limit); 
    }

    public function rscanById($id_start, $id_end, $limit = 0)
    {
	    $key_start = $this->prefix.'Id/'.$id_start; 
	    $key_end = '';
	    if($id_end != '')
		    $key_end = $this->prefix.'Id/'.$id_end;

	    return $this->rscan_ll($key_start, $key_end, $limit);
    }
//*/

    //find all records which's key > $key_start
    public function findByProp($prop, $key_start, $limit=0)
    {
	    $key_start = $this->prefix.'Id/'.$key_start;
	    $key_end = $this->prefix.'Id/z';


	    if($this->connect() == false)
		return false;

	    $count = 0;
	    $out = array();
	    while(1)
	    {
	    //every time get 1000 pairs
	    $kvs = $this->scan_ll($key_start, $key_end, 1000);
	    if(!$kvs)
		    break;

	    foreach($kvs as $key => $value)
	    {
		    $tmp = json_decode($value, true);
		    if($tmp == null)
		    {
			    $it->next();
			    continue;
		    }

		    $found = false;
		    foreach($tmp as $tmp_key => $tmp_value)
		    {
			    if(is_numeric($tmp_value) && $prop === $tmp_value)
			    {
				    $found = true;
				    break;
			    }
			    
			    $this->log(__FUNCTION__." keyword: ".$prop. " match: ".$tmp_value . "?");
			    if(is_string($tmp_value) && stristr($tmp_value, $prop) != false)
			    {
				    $found = true;
//				    $this->log("Bingo, count:".$count);
				    break;
			    }

		    }

		    if($found == false)
		    {
			    continue;
		    }

		    $key = str_replace($this->prefix.'Id/', '', $key);
		    $out[$key] = $tmp;
		    $count++;

		    if($limit != 0 && $count == $limit)
			    break;

	    }

	    $keys = array_keys(array_slice($kvs, -1, 1, true));
	    $key_start = $keys[0]; //max key

	    } //while(1)
	    $this->close();

	    return $out;

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

    public function updateIndice($id, $value)
    {
	    $kv_array = array();
	    if(isset($this->indice))
	    {
		    foreach($this->indice as $key)
		    {
			    if(0 == strcasecmp($key, 'id'))
				    continue;
			    $key = $this->prefix.ucfirst($key).'/'.$value[$key].'/'.$id;
			    $kv_array[$key] = $id;
		    }
	    }

	    if(isset($this->indice_2))
	    {
	    	    foreach($this->indice_2 as $key)
		    {
			    preg_match('/^(.+)_(.+)$/', $key, $matches);
			    $key1 = strtolower($matches[1]);
			    $key2 = strtolower($matches[2]);
			    $key = $this->prefix.ucfirst($key).'/'.$value[$key1].'_'.$value[$key2].'/'.$id;
			    $kv_array[$key] = $id;
		    }

	    }

	    if(count($kv_array) > 0)
		    $this->mset_ll($kv_array);

	    return true;
    }

    /**
     * Magic methods
     */
    public function __get($name)
    {
	    return null;
    }

    public function __call($name, $arguments)
    {
	    preg_match('/^(.+)[bB]y(.+)$/', $name, $matches);
	    $action= strtolower($matches[1]);
	    $index = strtolower($matches[2]);

//	    $this->log("Magic: method name: $name, args: ".var_export($arguments, true));
	    if(!isset($this->indice)) //no other indice(except id) defined
		    return false;

	    $is_index_2 = false;
	    if(!in_array($index, $this->indice)) //no matched index
	    {
		    if(in_array($index, $this->indice_2) && $action != 'set') //only 'get' and 'scan' are permitted for indice_2
			    $is_index_2 = true;
		    else
			    return false;
	    }

	    //$this->log("action: $action, index: $index");
	    $ret = false;
	    $index = ucfirst($index);

	    switch($action)
	    {
		    case 'get':
			    $key = $this->prefix.$index.'/'.$arguments[0];
			    $ret = $this->get_ll($key);
			    if($ret != false)
				{   
					$tmp = json_decode($ret, true);
					if($tmp == null) //cannot be decoded. link of ID?
						;
					else
						$ret = $tmp;
				}
			    break;
		    case 'set':
			    $id = $arguments[0];
			    $value = $arguments[1];

			    //validate it
			    if($this->validate($value) == false)
			    {
				    $this->log(__FUNCTION__.":".__LINE__.": validate failed! id: $id, value: ".var_export($value, true));
				    return false;
			    }
			    if(($value = $this->combineDefault($value)) == false)
				    return false;

			    //special for add
			    if($index == 'Id' && $id == '')
			    {
				    //generate Id string
				    $data = json_encode($value);
				    $id = uniqid().md5($data);

			    }
			    $key = $this->prefix.$index.'/'.$id;
			    //$this->log(__FUNCTION__.":".__LINE__.": call set_ll: key: $key, value: ".var_export($value, true));
			    $ret = $this->set_ll($key, json_encode($value, JSON_UNESCAPED_UNICODE));
			    if($ret != false)
				{    
					$ret = $this->updateIndice($id, $value);
					if($ret == true)
						$ret = $id; //return the key
				}
			    break;
		    case 'del': //only support delById now
			    $id = $arguments[0];
			    $key = $this->prefix.$index.'/'.$id;
			    $ret = $this->del_ll($key);
			    break;
		    case 'scan':
			    $key_start = $this->prefix.$index.'/'.$arguments[0]; 
			    $key_end = '';
			    if($arguments[1] != '')
				    $key_end = $this->prefix.$index.'/'.$arguments[1];
			    
			    if(isset($arguments[2]))
				    $ret = $this->scan_ll($key_start, $key_end, $arguments[2]);
			    else
				    $ret = $this->scan_ll($key_start, $key_end);
				    	
			    if($ret != false)
			    {
				    foreach($ret as $key => $value)
				    {
					    $key = str_replace($this->prefix.$index.'/', '', $key);
					    $tmp = json_decode($value, true);
					    if($tmp == null) //cannot be decoded. link of ID?
						    $out[$key] = $value;
					    else
						    $out[$key] = $tmp;

				    }

				    $ret = $out;
			    }

			    break;
		    case 'rscan':
			    $key_start = $this->prefix.$index.'/'.$arguments[0]; 
			    $key_end = '';
			    if($arguments[1] != '')
				    $key_end = $this->prefix.$index.'/'.$arguments[1];

			    if(isset($arguments[2]))
				    $ret = $this->rscan_ll($key_start, $key_end, $arguments[2]);
			    else
				    $ret = $this->rscan_ll($key_start, $key_end);
				
			    if($ret != false)
			    {

				    foreach($ret as $key => $value)
				    {
					    $key = str_replace($this->prefix.$index.'/', '', $key);
					    $tmp = json_decode($value, true);

					    if($tmp == null) //cannot be decoded. link of ID?
						    $out[$key] = $value;
					    else
						    $out[$key] = $tmp;

				    }

				    $ret = $out;
			    }

			    break;
		    default:
			    return false;
	    }

//	    $this->log("return: ". var_export($ret, true));
	    return $ret;

    }
}
