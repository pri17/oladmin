<?php

/**
 * @RoutePrefix("/api/task")
*/

class TaskController extends ApiControllerBase {
    protected $debug = true;
    protected  $model = "task";
    protected $limit_default = 200;
    
    const TASK_ALL_LOCATION = "/mnt/meta/task/all";
    const TASK_COMPLETE_LOCATION = "/mnt/meta/task/complete";
    const TASK_COMPLETE_ERROR_LOCATION = "/mnt/meta/task/complete_error";
    const TASK_ERROR_LOCATION = "/mnt/meta/task/error";
    const TASK_NEW_LOCATION = "/mnt/meta/task/new";
    const TASK_RUNNING_LOCATION = "/mnt/meta/task/running";
    const TASK_WAIT_LOCATION = "/mnt/meta/task/wait";
    const TASK_LOCATION = "/mnt/meta/task/";

    public function outputFilter($output){
        return $output;
    }
    
    public function inputFilter($input){
        return $input;
    }
    
    /**
     * @Route("/taskall/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskAllAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $allNum=0;
        if(file_exists(self::TASK_ALL_LOCATION)){
            $subfilenames_all = scandir(self::TASK_ALL_LOCATION);
            //$allNum = (int)(exec("find ".  self::TASK_ALL_LOCATION." -type f | wc -l"));
            $allNum = count($subfilenames_all)-2;
        }
        $completeNum=0;
        if(file_exists(self::TASK_COMPLETE_LOCATION)){
            $subfilenames_complete = scandir(self::TASK_COMPLETE_LOCATION);
            //$completeNum = (int)(exec("find ".self::TASK_COMPLETE_LOCATION." -type f | wc -l"));
            $completeNum = count($subfilenames_complete)-2;
        }
        $completeErrorNum=0;
        if(file_exists(self::TASK_COMPLETE_ERROR_LOCATION)){
            $subfilenames_completeError = scandir(self::TASK_COMPLETE_ERROR_LOCATION);
            //$completeErrorNum= (int)(exec("find ".  self::TASK_COMPLETE_ERROR_LOCATION." -type f | wc -l"));
            $completeErrorNum = count($subfilenames_completeError)-2;
        }
        $errorNum=0;
        if(file_exists(self::TASK_ERROR_LOCATION)){
            $subfilenames_error = scandir(self::TASK_ERROR_LOCATION);
            //$errorNum = (int)(exec("find ". self::TASK_ERROR_LOCATION." -type f | wc -l"));
            $errorNum = count($subfilenames_error)-2;
        }
        $newNum=0;
        if(file_exists(self::TASK_NEW_LOCATION)){
            $subfilenames_new = scandir(self::TASK_NEW_LOCATION);
            //$newNum = (int)(exec("find ". self::TASK_NEW_LOCATION." -type f | wc -l"));
            $newNum = count($subfilenames_new)-2;
        }
        $runningNum=0;
        if(file_exists(self::TASK_RUNNING_LOCATION)){
            $subfilenames_running = scandir(self::TASK_RUNNING_LOCATION);
            //$runningNum = (int)(exec("find ". self::TASK_RUNNING_LOCATION." -type f | wc -l"));
            $runningNum = count($subfilenames_running)-2;
        }
        $waitNum=0;
        if(file_exists(self::TASK_WAIT_LOCATION)){
            $subfilenames_wait = scandir(self::TASK_WAIT_LOCATION);
            //$waitNum = (int)(exec("find ". self::TASK_WAIT_LOCATION." -type f | wc -l"));
            $waitNum = count($subfilenames_wait)-2;
        }
        $res['allNum'] = $allNum;
        $res['completeNum'] = $completeNum;
        $res['completeErrorNum'] = $completeErrorNum;
        $res['errorNum'] = $errorNum;
        $res['newNum'] = $newNum;
        $res['runningNum'] = $runningNum;
        $res['waitNum'] = $waitNum;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/all/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public  function getAllAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $ret = true;
        $msg='';
        if(file_exists(self::TASK_ALL_LOCATION)){
            $subfilenames = scandir(self::TASK_ALL_LOCATION);
            $arrStr=$this->getClose($subfilenames);
            if($arrStr==null){
                $msg='unknown_file';//没有文件
                $ret = false;
            }
        }else{
            $ret = false;
            $msg='unknown_address';//没有这个地址未知
        }
        $res['ret'] = $ret;
        $res['msg'] = $msg;
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/taskcomplete/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskCompleteAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $ret = true;
        $msg='';
        if(file_exists(self::TASK_COMPLETE_LOCATION)){
            $subfilenames = scandir(self::TASK_COMPLETE_LOCATION);
            $arrStr=$this->getClose($subfilenames);
            if($arrStr==null){
                $msg='unknown_file';//没有文件
                $ret = false;
            }
        }else{
            $ret = false;
            $msg='unknown_address';//没有这个地址未知
        }
        $res['ret'] = $ret;
        $res['msg'] = $msg;
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/taskcompleteerror/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskCompleteErrorAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $arrayTask[]=null;
        if(file_exists(self::TASK_COMPLETE_ERROR_LOCATION)){
            $subfilenames = scandir(self::TASK_COMPLETE_ERROR_LOCATION);
            $arrStr=$this->getClose($subfilenames);
        }
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/taskerror/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskErrorAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $arrayTask[]=null;
        if(file_exists(self::TASK_ERROR_LOCATION)){
            $subfilenames = scandir(self::TASK_ERROR_LOCATION);
            $arrStr=$this->getClose($subfilenames);
        }
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/tasknew/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskNewAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $arrayTask[]=null;
        if(file_exists(self::TASK_NEW_LOCATION)){
            $subfilenames = scandir(self::TASK_NEW_LOCATION);
            $arrStr=$this->getClose($subfilenames);
        }
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/running/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskRunningAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $arrayTask[]=null;
        if(file_exists(self::TASK_RUNNING_LOCATION)){
            $subfilenames = scandir(self::TASK_RUNNING_LOCATION);
            $arrStr=$this->getClose($subfilenames);
        }
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/wait/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getTaskWaitAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $arrayTask[]=null;
        if(file_exists(self::TASK_WAIT_LOCATION)){
            $subfilenames = scandir(self::TASK_WAIT_LOCATION);
            $arrStr=$this->getClose($subfilenames);
        }
        $res['task'] = $arrStr;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/taskdetails/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function getDetailsAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(_FUNCTION_." getAction: ".$command);
        $data = $this->getInput();
        $filePath = self::TASK_LOCATION.$data['taskType']."/".$data['taskNum'];
        $detailArray = Array();
        if(file_exists($filePath)){
            $mag = file_get_contents($filePath);
            $detail = json_decode($mag, true);
            $i = 0;
            foreach ($detail[0] as $key=>$value) {
                if($key=="timestamp"){
                    $detailArray[$i] = date("Y-m-d H:i:s", $value);
                }elseif($key=="log"){
                    $newLog = [];
                    for($j=0;$j<count($value);$j++){
                        foreach ($value[$j] as $keylog => $valueLog) {
                            if($keylog=="timestamp"){
                                $newLog[$j]['timestamp'] = date("Y-m-d H:i:s", $valueLog);
                            }else{
                                $newLog[$j]['info'] = $valueLog;
                            }
                        }
                    }
                    $detailArray[$i] = $newLog;
                }elseif($key=="buffer_info"){
                    $size=count($value);//判断数组大小
                    $str="";
                    if($size>0){
                        $str= $value[0]['buffer_index']."-".(($value[0]['buffer_index']+$size)-1);
                    }
                    $detailArray[$i] = $str;
                }else{
                    $detailArray[$i] = $value;
                }
                $i++;
            }
        }
        $res['message'] = $detailArray;
        $this->setJsonContent($res);
    }
    
    
    public function getClose($arrayName, $url){
        $fileArray[] = NULL;
        sort($arrayName);
        $i = 0;
        foreach ($arrayName as $value){
            if(!in_array($value, array(".",".."))){
                $str=  explode("/", $value);
                $task['taskValue'] = $str[count($str)-1];
//                $str_url = $url."/".$value;
//                $task['taskValue'] = $value;
                $task['taskTime'] = date("Y-m-d H:i:s", filemtime($value));
                $fileArray[$i]= $task;
                $i++;
            }
        }
        return $fileArray;
    }
    
}
