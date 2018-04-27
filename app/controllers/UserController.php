<?php

/**
 * @RoutePrefix("/api/users")
*/
class UserController extends ApiControllerBase {
    protected $debug = true;
    protected $model = "Users";
    protected $limit_default = 200;
       
    public function outputFilter($output){
	    return $output;
    }

    public function inputFilter($input){
	    return $input;
    }
    
    /**
     * @Route("/get/{config:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */ 
    public function getUserAction($config){
        $res = array();
	$res['status'] = 'OK';
	
	$this->log(__FUNCTION__." getAction: ".$config);
        
        $model_name = ucfirst($config).'s';
        $model = new $model_name();
        $result = $model->getConfig($config);
        if($result == false){
            $this->log(__FUNCTION__." getAction: failed");
            $res['status'] = 'ERROR';
        }else{
            $this->log(__FUNCTION__." getAction: ".json_encode($result));
            $res['status'] = 'OK';
            $res['data'] = $result;
        }
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/set/{config:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */ 
    public function setUserAction($config){
        $res = array();
	$res['status'] = 'OK';
        
        $data = $this->getInput();
	$this->log(__FUNCTION__." user content: ".json_encode($data));
        
        $model_name = ucfirst($config).'s';
        $model = new $model_name();
        $result = $model->setConfig($config, $data);
        if($result == false){
            $this->log(__FUNCTION__." getAction: failed");
            $res['status'] = 'ERROR';
        }else{
            $res['status'] = 'OK';
        }
        
        $this->setJsonContent($res);
    }
    
    
    /**
     * @Route("/getmodel/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */ 
    public function getUserModelAction($command){
        $res = array();
	$res['status'] = 'OK';
	
        $this->log(__FUNCTION__." getAction: ".$command);
        
        $model_name = ucfirst($command).'s';
        $model = new $model_name();
        $result = $model->getConfig($command);
        if($result == false){
            $this->log(__FUNCTION__." getAction: failed");
            $res['status'] = 'ERROR';
        }else{
            //$this->log(__FUNCTION__." getAction: ".json_encode($result));
            $res['status'] = 'OK';
            
            $resultUser = $result[0]['users'];
            $userltPermissions = $result[0]['permissions'];
            foreach ($resultUser as $key => $user) {
                
                $num_use = $user['permissionsid'];
                $str = '';
                foreach ($num_use as $value) {
                    foreach ($userltPermissions as $valuePer) {
                        $str_array = array_search($value, $valuePer);
                        if($str_array != false){
                            $str = $str.",".$valuePer['name'];
                        }
                    }
                }
                $result[0]['users'][$key]['permissionsid'] = substr($str,1);
            }
            
            $res['data'] = $result;
        }

        
        
        return $this->setJsonContent($res);;
    }
    
    
    /**
     * @Route("/setmodel/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
    */ 
    public function setUserModelAction($command){
        $res = array();
	$res['status'] = 'OK';
        
        $data = $this->getInput();
	$this->log(__FUNCTION__." user content: ".json_encode($data));
        
        $model_name = ucfirst($command).'s';
        $model = new $model_name();
        
        $result = $model->getConfig($command);
        
        $resultUser = $data[0]['users'];
        $userltPermissions = $result[0]['permissions'];
        foreach ($resultUser as $key => $user) {
                
                $group = $user['permissionsid'];
                $num_use = explode(',', $group);
                $str = array();
                foreach ($num_use as $value) {
                    foreach ($userltPermissions as $valuePer) {
                        $this->log(__FUNCTION__." for: ".$value);
                        $str_array = array_search($value, $valuePer);
                        if($str_array != false){
                            //$str = $str.",".$valuePer['id'];
                            array_push($str, $valuePer['id']);
                        }
                    }
                }
                //$this->log(__FUNCTION__." str: ".$str);
                $data[0]['users'][$key]['permissionsid'] = $str;
        }
        
        $resultSet = $model->setConfig($command, $data);
        if($resultSet == false){
            $this->log(__FUNCTION__." getAction: failed");
            $res['status'] = 'ERROR';
        }else{
            $res['status'] = 'OK';
        }
        
        $this->setJsonContent($res);
    }
    
   

//    public function getModel($config){
//        $res = array();
//	$res['status'] = 'OK';
//	
//	$this->log(__FUNCTION__." getAction: ".$config);
//        
//        $model_name = ucfirst($config).'s';
//        $model = new $model_name();
//        $result = $model->getConfig($config);
//        if($result == false){
//            $this->log(__FUNCTION__." getAction: failed");
//            $res['status'] = 'ERROR';
//        }else{
//            $this->log(__FUNCTION__." getAction: ".json_encode($result));
//            $res['status'] = 'OK';
//            $res['data'] = $result;
//        }
//        return $res;
//    }
    
//    public function setModel($config ,$data){
//        $res = array();
//	$res['status'] = 'OK';
//	$this->log(__FUNCTION__." getAction: ".$config);
//        
//        $model_name = ucfirst($config).'s';
//        $model = new $model_name();
//        $result = $model->setConfig($config, $data);
//        if($result == false){
//            $this->log(__FUNCTION__." getAction: failed");
//            $res['status'] = 'ERROR';
//        }else{
//            $res['status'] = 'OK';
//        }
//        return $res;
//    }
    
    
}
