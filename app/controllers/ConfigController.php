<?php

/**
 * @RoutePrefix("/api/configs")
*/
class ConfigController extends ApiControllerBase
{
    protected $debug = true;
    protected $model = "Configs";
    protected $limit_default = 200;
       
    public function outputFilter($output)
    {
	    return $output;
    }

    public function inputFilter($input)
    {
	    return $input;
    }


/**
     * @Route("/get/{config:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */  
    public function getConfigAction($config)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$this->log(__FUNCTION__." getAction: ".$config);
		
		$model_name = ucfirst($config).'s';
		$model = new $model_name();
		$result = $model->getConfig($config);
		if($result == false)
		{
			$this->log(__FUNCTION__." getAction: failed");
			$res['status'] = 'ERROR';
		}
		else
		{
			$this->log(__FUNCTION__." getAction: ".json_encode($result));
			$res['status'] = 'OK';
			$res['data'] = $result;
		}
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/set/{config:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */  
    public function setConfigAction($config)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$data = $this->getInput();
		
		$this->log(__FUNCTION__." config content: ".json_encode($data));
/*
		$this->setJsonContent($res);
		return;
//*/	
		$model_name = ucfirst($config).'s';
		$model = new $model_name();	
		$result = $model->setConfig($config, $data);
		if($result == false)
		{
			$this->log(__FUNCTION__." setAction: failed");
			$res['status'] = 'ERROR';
		}
		else
		{
			$res['status'] = 'OK';
			//apply
/*			
			$olcmd = new Olrun();
			$command = "screen -d -m ./etc/setup.php ./etc/template/".$config.".php";
			$param = " ./etc/init.d";
			$olcmd->runCommand($command, $param);
//*/
		}
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/setdefault/{config:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */  
    public function setDefaultConfigAction($config)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$data = $this->getInput();
		
		$this->log(__FUNCTION__." config content: ".json_encode($data));
/*
		$this->setJsonContent($res);
		return;
//*/	
		$model_name = ucfirst($config).'s';
		$model = new $model_name();	
		$result = $model->setDefaultConfig($config);
		if($result == false)
		{
			$this->log(__FUNCTION__." setDefaultAction: failed");
			$res['status'] = 'ERROR';
		}
		else
		{
			$res['status'] = 'OK';
			//apply
/*			
			$olcmd = new Olrun();
			$command = "screen -d -m ./etc/setup.php ./etc/template/".$config.".php";
			$param = " ./etc/init.d";
			$olcmd->runCommand($command, $param);
//*/
		}
		$this->setJsonContent($res);

    }
    
    
    
}
