<?php
/**
 * @RoutePrefix("/api/cmds")
*/
class CmdController extends ApiControllerBase
{
    protected $debug = false;
    protected $model = "Cmds";
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
     * @Route("/get/{command:[a-z_A-Z]+}", methods={"POST", "PUT", "GET"})
    */  
    public function getByCommandAction($command)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$this->log(__FUNCTION__." getAction: ".$command);
		
		$olcmd = new Olrun();
		$result = $olcmd->getResponse($command);
		$this->log(__FUNCTION__." getAction: ".json_encode($result));
		
		$res['data'] = $result;
		$this->setJsonContent($res);
    }
    
    /**
     * @Route("/query/{command:[a-z_A-Z]+}", methods={"POST", "PUT", "GET"})
    */  
    public function queryByCommandAction($command)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$this->log(__FUNCTION__." queryAction: ".$command);
		
		$olcmd = new Olrun();
		$result = $olcmd->queryCommand($command);
		$this->log(__FUNCTION__." queryAction: ".json_encode($result));
		
		$res['data'] = $result;
		$this->setJsonContent($res);
    }
    
    /**
     * @Route("/set/{command:.+}", methods={"POST", "PUT", "GET"})
    */  
    public function setByCommandAction($command)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$command = urldecode($command);
		$data = $this->getInput();
		
		$this->log(__FUNCTION__." setAction: ".$command);
		
		$olcmd = new Olrun();
		if(empty($data))
			$result = $olcmd->runCommand($command, '');
		else
			$result = $olcmd->runCommand($command, $data['data']);
		$this->log(__FUNCTION__." setAction: ".$result);
		if($result !== false)
		{
			$res['status'] = 'OK';
			$res['data'] = $result;
		}
		else
			$res['status'] = 'ERROR';
			
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/send/{command:.+}", methods={"POST", "PUT", "GET"})
    */  
    public function sendByCommandAction($command)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$command = urldecode($command);
		$data = $this->getInput();
		
		$this->log(__FUNCTION__." sendAction: ".$command);
		
		$olcmd = new Olrun();
		if(empty($data))
			$result = false;
		else
			$result = $olcmd->sendCommand($command, $data);
		$this->log(__FUNCTION__." sendAction: ".$result);
		if($result !== false)
		{
			$res['status'] = 'OK';
			$res['data'] = $result;
		}
		else
			$res['status'] = 'ERROR';
			
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/getshm/{command:.+}", methods={"POST", "PUT", "GET"})
    */  
    public function getshmByCommandAction($command)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$command = urldecode($command);
		$data = $this->getInput();
		
		$this->log(__FUNCTION__." getshmAction: ".$command);
		
		
		$olcmd = new Olrun();
		if(empty($data))
			$ref_key = 0;
		else
			$ref_key = $data['var_key'];
			
		$result = $olcmd->getshmResponse($command, $ref_key);
		$this->log(__FUNCTION__." getshmAction: ".json_encode($result));
		if($result !== false)
		{
			$res['status'] = 'OK';
			$res['data'] = $result;
		}
		else
			$res['status'] = 'ERROR';
			
		$this->setJsonContent($res);

    }
    
    
    
}
