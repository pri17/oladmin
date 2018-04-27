<?php

use Phalcon\Mvc\Controller;

class ApiControllerBase extends Controller
{

	public function beforeExecuteRoute($dispatcher) 
	{
        	// Executed before every found action
		$this->view->disable();
		$this->response->setStatusCode(200, "OK");
		//Security

		//JSON Vulnerability
		if($this->config->setting->xsrf_detect == true)
			$this->response->setContent(")]}',\n");

		//XSRF
		$this->cookies->useEncryption(false);
		if($this->config->setting->xsrf_detect == true && !$this->cookies->has('XSRF-TOKEN'))
		{
			echo "XSRF detected!";
			return false;
		}
		$token = $this->cookies->get('XSRF-TOKEN');

//*		
		if($this->config->setting->xsrf_detect == true)
		{
			if(!isset($_SERVER['HTTP_X_XSRF_TOKEN']) || $token != $_SERVER['HTTP_X_XSRF_TOKEN'])
			{
				echo "XSRF detected!";
				return false;
			}
		}
/*/		
		//$h_token = $this->response->getHeaders()->get("X-XSRF-TOKEN");
		$h_token = $_SERVER['HTTP_X_XSRF_TOKEN'];
		//$this->logger->log("token from cookie:".$token.", token from http header:".$h_token);
		if($token != $h_token && $this->config->setting->xsrf_detect == true)
		{
			echo "XSRF detected!";
			return false;
		}
//*/
		//$this->logger->log("config: ".json_encode($this->config->leveldb, JSON_PRETTY_PRINT));
		//$this->logger->log("config: ".$config);
		$auth = $this->session->get('auth'); //trigger session service of DI

	}

	public function afterExecuteRoute($dispatcher) 
	{
		// Executed after every found action
		$this->response->send();
	}


	public function outputFilter($output)
	{
		return $output;
	}

	public function setJsonContent($output)
	{
		$output = $this->outputFilter($output);
		//$this->log("before setJsonContent: ".var_export($output, true));
		$this->response->appendContent(json_encode($output, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
	}

	public function inputFilter($input)
	{
		return $input;
	}
   
       	public function getInput()
       	{
            $str = file_get_contents("php://input");
            $input = json_decode($str, TRUE);
            
	    $input = $this->inputFilter($input);
	    //$this->log("getInput: ". print_r($input, TRUE));
	    return $input;
       	}

	public function log($data)
	{
		if( null != $this->logger && isset($this->debug) && $this->debug == true)
		$this->logger->log('['.$_SERVER['REMOTE_ADDR'].']:'.$data);
	}

	//common actions
    /**
     * @Get("/")
    */  
    public function indexAction()                                                         
    { 
	$this->view->disable();
        $this->response->setJsonContent(array("itineraries" => "two"));                   
        $this->response->setStatusCode(200, "OK");                                        
        $this->response->send();
    } 

    /**
     * @Route("/get/", methods={"POST", "PUT", "GET"})
     * @Route("/get", methods={"POST", "PUT", "GET"})
    */  
    public function getAction()                                                         
    {
	$res = array();

	$blog = new $this->model();
	$res['status'] = 'OK';
	$kv_array = $blog->scanById('', 'z', $this->limit_default);

	if($kv_array != false)
	{
		$count = 0;
		foreach($kv_array as $key => $value)
		{
			$res['data'][$count] = $value;
			$res['data'][$count]['id'] = $key;
			$count++;
		}
	}
	else
		$res['status'] = 'ERROR';
	$this->setJsonContent($res);

    }

    /**
     * @Route("/get/{id:[0-f]+}", methods={"POST", "PUT", "GET"})
    */
    public function getByIdAction($id)
    {
	    $res = array();
	    $res['status'] = 'OK';

	    $blog = new $this->model();
	    $value = $blog->getById($id);
	    if($value == false)
		    $res['status'] = 'ERROR';
	    else
	    {
		    $res['data'] = $value;
		    $res['data']['id'] = $id;
	    }

	    $this->setJsonContent($res);

    }

    /**
     * @Route("/set/{id:[0-f]+}", methods={"POST", "PUT", "GET"})
    */
    public function setByIdAction($id)
    {
	    $res = array();
	    $res['status'] = 'OK';

	    $data = $this->getInput();
	    $blog = new $this->model();

    	    unset($data['id']); //we have no 'id' in schema
    	    unset($data['date']); //we use sever side date
	    if($blog->setById($id, $data) != false)
		$res['status'] = 'OK';
    	    else
		$res['status'] = 'ERROR';
	    
	    $this->setJsonContent($res);

    }

    /**
     * @Route("/del/{id:[0-f]+}", methods={"POST", "PUT", "GET"})
    */
    public function delByIdAction($id)
    {
	    $res = array();
	    $res['status'] = 'OK';

	    $blog = new $this->model();
	    if($blog->delById($id) != false)
		$res['status'] = 'OK';
    	    else
		$res['status'] = 'ERROR';
	    
	    $this->setJsonContent($res);

    }


    /**
     * @Route("/get/{index:[^/]+}/{index_value:[^/]+}/?{num:[0-9]*}/?{startkey:[0-z]*}", methods={"POST", "PUT", "GET"})
    */
    public function getByIndexAction($index, $index_value, $num, $startkey)
    {
	    $res = array();
	    $res['status'] = 'OK';

	    if($num == '' || $num > $this->limit_default)
		    $num = $this->limit_default;
	    if($startkey == '')
		    $startkey = 'z';
	
	    $this->log(__FUNCTION__.": index: $index, index_name: $index_value, num: $num, startkey: $startkey");

	    $blog = new $this->model();
	    $func = "rscanBy".$index;
	    if($index_value == '*')
	    	$kv_array = $blog->$func('~', ' ', $num);
	    else
	    	$kv_array = $blog->$func($index_value.'/'.$startkey, ' ', $num);
	    if($kv_array == false)
		    $res['status'] = 'ERROR';
	    else
	    {
		$count = 0;
		foreach($kv_array as $key => $value)
		{
			if(!is_array($value))  //it is a link, so query the real data again
			{
				$key = $value;
				$value = $blog->getById($key);
				$res['data'][$count] = $value;
				$res['data'][$count]['id'] = $key;
			}
			else
			{
				$res['data'][$count] = $value;
				$res['data'][$count]['id'] = $key; //str_replace($index_value.'/', '', $key);
			}
			
			$count++;
		}

	    }

	    $this->setJsonContent($res);

    }


    /**
     * @Post("/add")
     * @Post("/add/")
    */  
    public function addAction()                                                         
    {
	$res = array();

	$data = $this->getInput();
	$this->log("Get Post: ". json_encode($data, JSON_PRETTY_PRINT));

	$blog = new $this->model();
	if($blog->setById('', $data) != false)
		$res['status'] = 'OK';
	else
		$res['status'] = 'ERROR';
	
	$this->setJsonContent($res);

    }

    /**
     * @Route("/search/{keyword:[^/]+}/?{num:[0-9]*}/?{startkey:[0-z]*}", methods={"POST", "PUT", "GET"})
    */
    public function searchAction($keyword, $num, $startkey)
    {
	    $res = array();
	    $res['status'] = 'OK';

	    if($num == '')
		    $num = $this->limit_default;

	    $blog = new $this->model();
	    $keyword = urldecode($keyword);
	    $kv_array = $blog->findByProp($keyword, $startkey, $num);
	    if($kv_array == false)
		    $res['status'] = 'ERROR';
	    else
	    {
		$count = 0;
		foreach($kv_array as $key => $value)
		{
			if(!is_array($value))
			{
				$value = $blog->getById($value);
			}
			$res['data'][$count] = $value;
			$res['data'][$count]['id'] = $key; //str_replace($author.'/', '', $key);
			$count++;
		}

	    }

	    $this->setJsonContent($res);

    }


}
