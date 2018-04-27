<?php

/**
 * @RoutePrefix("/api/ipcs")
*/
class IpcController extends ApiControllerBase{
    //put your code here
    protected $debug = true;
    protected $model = "Ipc";
    protected $limit_default = 200;
    
    const IPC_PLAY = '/mnt/fuse/ipc/';
    
    public function outputFilter($output)
    {
	    return $output;
    }

    public function inputFilter($input)
    {
	    return $input;
    }
    
     
    /**
     * @Route("/getvideo/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getVideoAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $data = $this->getInput();
        $ip = $data['ip'];
        //$dataTime = date("Y-m-d H:i:s", $data['datetime']);
        $dataTime = date('Y-m-d', strtotime('+1 day', strtotime(substr($data['datetime'], 0, 10))));
        $dataStr = explode("-", $dataTime);
        $path = self::IPC_PLAY.$ip."/".$dataStr[0]."-".$dataStr[1]."/".$dataStr[2];
        $file = scandir($path);
        $set = $this->getValue($file,$path);
        
        $res['data'] = $set;
        $this->setJsonContent($res);
    }
    
    
    /**
     * @Route("/getmultiple/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getMultipleAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $data = $this->getInput();
        $ip = $data['ip'];
        $startTime = $data['starttime'];
        $endTime = $data['endtime'];
        $dataTime = date('Y-m-d', strtotime('+1 day', strtotime(substr($data['datetime'], 0, 10))));
        $dataStr = explode("-", $dataTime);
        $path = self::IPC_PLAY.$ip."/".$dataStr[0]."-".$dataStr[1]."/".$dataStr[2];
        $file = scandir($path);
        //$this->log(__FUNCTION__." getAction: ".$file);
        $set = $this->getVideoFile($file, $path, $dataTime." ".$startTime, $dataTime." ".$endTime);
        
        $res['data'] = $set;
        $this->setJsonContent($res);
    }
    
    //2016-08-03_16-30-34.mp4
    public function getVideoFile($file, $path, $startTime, $endTime){
        $fileArray[] = NULL;
        sort($file);
        $i = 0;
        foreach ($file as $key=>$value) {
             if(!in_array($value, array(".",".."))){
                 $filedate = $this->getDateTime($value);
                 //$this->log(__FUNCTION__." getAction: ".$filedate);
                 $array1 = $this->getDateTime($file[$key]);
                 $array2 = $this->getDateTime($file[($key+1)]);
                 if(strtotime($array1)<strtotime($startTime)&strtotime($startTime)<strtotime($array2)){
                    $url = $path."/".$value;
                    $filestr['filename'] = $value;
                    $filestr['filepath'] = $url;
                    $filestr['filetime'] = date("Y-m-d H:i:s", filemtime($url));
                    $fileArray[$i]= $filestr;
                    $i++;
                 }else if(strtotime($startTime)<strtotime($filedate)&strtotime($filedate)<strtotime($endTime)){
                    $url = $path."/".$value;
                    $filestr['filename'] = $value;
                    $filestr['filepath'] = $url;
                    $filestr['filetime'] = date("Y-m-d H:i:s", filemtime($url));
                    $fileArray[$i]= $filestr;
                    $i++;
                 }
             }
        }
        return $fileArray;
    }
    
   public function getDateTime($name){
       $fllename = substr($name, 0,19);
       $timeStr =  str_replace('-', ':', substr($fllename, 11,19));
       $str =  substr($fllename, 0,10);
       $filedate = $str." ".$timeStr;
       $this->log(__FUNCTION__." getDateTime: ".$filedate);
       return $filedate;
   }


    public function getValue($file,$path){
        $fileArray[] = NULL;
        sort($file);
        $i = 0;
        foreach ($file as $value){
            if(!in_array($value, array(".",".."))){
                //$str=  explode("/", $value);
                $url = $path."/".$value;
                $filestr['filename'] = $value;
                $filestr['filepath'] = $url;
                $filestr['filetime'] = date("Y-m-d H:i:s", filemtime($url));
                $fileArray[$i]= $filestr;
                $i++;
            }
        }
        return $fileArray;
    }
    
    
    /**
     * @Route("/get/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getGroupAction($command){
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
            $this->log(__FUNCTION__." getAction: sd ".json_encode($result));
            $res['status'] = 'OK';
            $ipcModel = new Ipcs();
            $ipcResult = $ipcModel->getConfig('ipc');
            foreach ($result as $key =>$ret) {
                $str = array();
                $cameras = $ret['camera'];
                foreach ($cameras as $camera){
                    foreach ($ipcResult as $ipc){
                        //$this->log(__FUNCTION__." getAction: ipc ". $camera ."=>".json_encode($ipc) );
                        $str_array = array_search($camera, $ipc);
                        if($str_array != false){
                            array_push($str, $ipc);
                        }
                    }
                }
                $result[$key]['camera'] = $str;
            }
            $res['data'] = $result;
        }
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getmodel/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getModelGroupAction($command){
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
            $this->log(__FUNCTION__." getAction: sd ".json_encode($result));
            $res['status'] = 'OK';
            $res['data'] = $result;
        }
        $this->setJsonContent($res);
    }
    
    
    /**
     * @Route("/set/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function setGroupAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $data = $this->getInput();
        //$this->log(__FUNCTION__." getAction: ".json_encode($data));
        $data['id'] = time();
        
        $model_name = ucfirst($command).'s';
        $model = new $model_name();
        $getResult = $model->getConfig($command);
        array_push($getResult, $data);
        
        $result = $model->setConfig($command, $getResult);
        $this->editIpc($data);
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
     * @Route("/del/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function delGroupAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__." getAction: ".$command);
        $data = $this->getInput();
        
        $id = $data['id'];
        $model_name = ucfirst($command).'s';
        $model = new $model_name();
        $getResult = $model->getConfig($command);
        foreach ($getResult as $key =>$ret) {
            //$str_array = array_search($ret, $id);
            if($id == $ret['id']){
                $this->delIpcClass($ret['name']);
                array_splice($getResult, $key, 1);
            }
        }
        $this->log(__FUNCTION__." getAction: ".json_encode($getResult));
        $result = $model->setConfig($command, $getResult);
        if($result == false){
            $this->log(__FUNCTION__." getAction: failed");
            $res['status'] = 'ERROR';
        }else{
            //$this->log(__FUNCTION__." getAction: ".json_encode($result));
            $res['status'] = 'OK';
            $res['data'] = $result;
        }
        $this->setJsonContent($res);
    }
    
    public function editIpc($str_array){
        $ipcModel = new Ipcs();
        $ipcResult = $ipcModel->getConfig('ipc');
        $str_camera = $str_array['camera'];
        foreach ($str_camera as $camera){
            foreach ($ipcResult as $key => $ipc){
                //$class = $ipc['class'];
               
                if($ipc['ip']==$camera){
                    $class = $ipc['class'];
                     $str = strripos($class, $str_array['name']);
                    if($str==false){
                        $ipcResult[$key]['class'] = ltrim($ipc['class'], ',').",".$str_array['name'];
                    }
                    
                }
            }
        }
        $ipcModel->setConfig('ipc', $ipcResult);
        //$this->log(__FUNCTION__." getAction: ipc ".json_encode($ipcResult));
    }
    
    /**
     * @Route("/edit/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function editGroupAction($command){
        $res = array();
        $res['status'] = 'OK';
        //$this->log(__FUNCTION__." getAction: ".$command);
        $data = $this->getInput();
        $this->log(__FUNCTION__." getAction: ".json_encode($data));
        $model_name = ucfirst($command).'s';
        $model = new $model_name();
        $getResult = $model->getConfig($command);
        foreach ($getResult as $key =>$ret) {
            //$str_array = array_search($ret, $id);
            if($data['id'] == $ret['id']){
                $getResult[$key]['name'] = $data['name'];
                $getResult[$key]['camera'] = $data['camera'];
            }
        }
        
        $result = $model->setConfig($command, $getResult);
        $this->editIpc($data);
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
    
    public function delIpcClass($str_array){
        $ipcModel = new Ipcs();
        $ipcResult = $ipcModel->getConfig('ipc');
        foreach ($ipcResult as $key => $value) {
            $class = $value['class'];
            $str = '';
            if($class !="" || $class != null){
                $str_class = explode(',', $class);
                $num = count($str_class);
                //$this->log(__FUNCTION__." getAction: ipc ".$class.'   '.$str_array.' '.$num);
                for($i=0;$i<$num;$i++){
                    if($str_array != $str_class[$i]){
                        $str = $str.','.$str_class[$i];
                        //$this->log(__FUNCTION__." getAction: ".$str_class[$i]);
                    }else{
                        continue;
                    }
                }
            }
            $ipcResult[$key]['class'] = ltrim($str, ',');
        }
        
        $ipcModel->setConfig('ipc', $ipcResult);
    }
    
}
