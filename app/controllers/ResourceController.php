<?php

/**
 * @RoutePrefix("/api/resource")
*/
class ResourceController extends ApiControllerBase{
    protected $debug = true;
    protected $model = "resource";
    protected $limit_default = 200;
    
    const TMP_RUNTIME_ODD_DEV_PATH = "/tmp/runtime/odd/dev/";
    const DRIVER_DEFAULT_NUMBER = 24;
    const MAGAZINE_DEFAULT_NUMBER = 72;
    const SLOTS_TOTAL = 510;
    const META_DISC_GROUP_DATA_PREFIX_PATH = "/mnt/meta/disc/group/data/";
    const MAGAZINE_SEND_MSGID = 6881;
    const MAGAZINE_RECV_MSGID = 6882;
    const SLOT_NUMBER = 25;

    public function outputFilter($output){
        return $output;
    }
    
    public function inputFilter($input){
        return $input;
    }
    
    
    /**
     * @Route("/getquery/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getQueryAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction: ".$command);
        $execRet = exec("lsblk | grep -c sr");
        if(0<$execRet){
            $res['number'] = $execRet;
        }else{
            $res['number'] = self::DRIVER_DEFAULT_NUMBER;
        }
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getdriverinfo/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function  getNumberAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction: ".$command);
        $data = $this->getInput();
        $id = $data['id'];
        $subfilename = self::TMP_RUNTIME_ODD_DEV_PATH."sr".($id-1);
        $set = [];
        if(file_exists($subfilename)){
            $json_string = file_get_contents($subfilename);
            $dataSr = json_decode($json_string,true);
            $set['id'] =  $id;
            
            $i=0;
            foreach ($dataSr[0] as $value) {
                $set[$i]=$value;
                $i++;
            }
            
            $set['burn_speed_total'] = 0;
            $filenames = scandir(self::TMP_RUNTIME_ODD_DEV_PATH);
            foreach($filenames as $subname ){
                if(!in_array($subname, array(".",".."))){
                    $subfilename = self::TMP_RUNTIME_ODD_DEV_PATH.$subname;
                    $json_string = file_get_contents($subfilename);
                    $dataSpeed = json_decode($json_string,true);                 
                    $set['burn_speed_total'] += $dataSpeed[0]['burn_speed'];            
                }
            }
        }
        $res['data'] = $set;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getmagazine/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getMagazineAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction: ".$command);
        $MAGAZINE_NUMBER = self::MAGAZINE_DEFAULT_NUMBER;
        $SLOTS_TOTAL = self::SLOTS_TOTAL;
        
        $res['magazine_number'] = $MAGAZINE_NUMBER;
        $res['slots_total'] = $SLOTS_TOTAL;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getajaxinfo/{command:[a-zA-Z]+}",methods={"POST", "PUT", "GET"})
     */
    public function getAjaxInfoAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."  getAction: ".$command);
        $dirname = scandir(self::META_DISC_GROUP_DATA_PREFIX_PATH);
        sort($dirname);
        foreach ($dirname as $name){
            if(!in_array($name, array(".",".."))){
                $subfiledir = self::META_DISC_GROUP_DATA_PREFIX_PATH.$name;
                $subfilenames = scandir($subfiledir);
                sort($subfilenames);
                $burned = 0;
                foreach ($subfilenames as $subname){
                    if(!in_array($subname, array(".",".."))){
                        $subsubfilename = $subfiledir.'/'.$subname;
                        $json_string = file_get_contents($subsubfilename);
                        $data = json_decode($json_string,true);
                        if($data[0]['burned'] == 1 ){
                            $burned[$name]++;
                        }
                        
                    }
                }
            }
        }
        $res['data'] = $burned;
        $this->setJsonContent($res);
    }

    

    /**
     * @Route("/getdetail/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function getDetailAction($command){
        $res = array();
        $result = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction: ".$command);
        $data = $this->getInput();
        $id = $data['id'];
        $subfiledir = self::META_DISC_GROUP_DATA_PREFIX_PATH.$id;
        $subfilenames = scandir($subfiledir.'/');
        sort($subfilenames);
        
        foreach($subfilenames as $subname ){
            if(!in_array($subname, array(".",".."))){
                $subsubfilename = $subfiledir.'/'.$subname;
                $json_string = file_get_contents($subsubfilename);
                $data = json_decode($json_string,true);    
               //    echo $subname;
                $position[$subname] = $data[0]['position'];
                $volumeId[$subname] = $data[0]['volume_id'];
                $burned[$subname] = $data[0]['burned'];
                $discType[$subname] = $data[0]['disc_type'];            
            }
        }
        $result['position'] = $position;
        $result['volumeId'] = $volumeId;
        $result['burned'] = $burned;
        $result['discType'] = $discType;
        $res['data'] = $result;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getadjust/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function getAdjustAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction:".$command);
        
        $data = $this->getInput();
        $offset = $data['offset'];
        $type = $data['type'];
        $sendValueH = 0;
        $sendValueL = 0;
        $msgType = 'z'; /* z goes for invalid adjust action */
        $contentType = 'z'; /* z goes for invalid adjust action */
            
        if ("leftStep" == $type || "rightStep" == $type || "upStep" == $type || "downStep" == $type)
        {
            $sendValueL = 1;
        }
        else
        {
            $sendValueL = $offset % 10000;
            $sendValueH = (int)($offset / 10000);
        }       
        
        switch ($type)
        {
            case "left":
                $msgType = 'I';
                $contentType = 'b';
                break;
            case "right":
                $msgType = 'I';
                $contentType = 'f';
                break;
            case "up":
                $msgType = 'h';
                $contentType = 'h';
                break;
            case "down":
                $msgType = 'i';
                $contentType = 'i';
                break;
            case "leftStep":
                $msgType = 'I';
                $contentType = 'b';
                break;
            case "rightStep":
                $msgType = 'I';
                $contentType = 'f';
                break;
            case "upStep":
                $msgType = 'h';
                $contentType = 'h';
                break;
            case "downStep":
                $msgType = 'i';
                $contentType = 'i';
                break;
            default:
                break;
        }
        
        $res['data'] = $this->sendAdjustAction($msgType, $contentType, $sendValueH, $sendValueL);
        $this->setJsonContent($res);
    }
    
    public function sendAdjustAction($msgType, $contentType, $sendValueH, $sendValueL){       
        $task_msg_id = GRAB_SEND_MSGID;
        $wfifo = msg_get_queue($task_msg_id);
        if ($wfifo)
        {
            $format = "l14";
            $bin = pack($format, 0, 1,ord($msgType), ord($contentType), GRAB_RECV_MSGID, 1, $sendValueH, $sendValueL, 0, 0, 0, 0, 0, 0);
            msg_send($wfifo, 1, $bin, false);
            return "success";
        }
        
        return "fail";
    }
    
     /**
     * @Route("/getfeedbackinfo/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getFeedBackInfoAction($command){
        $res = array();
        $web_msg_id = GRAB_RECV_MSGID;
        $fifo = msg_get_queue($web_msg_id);
        $stat = msg_stat_queue($fifo);
        $errorCode = 0;
        $errorInfo = "";
        
        if ( $stat['msg_qnum'] > 0 ) 
        {
            $msgtype = 1;
            msg_receive($fifo, 0, $msgtype, 1024, $msg, false, 0, $msg_error);
            $result = unpack("L14", $msg);
            $errorCode = $result[4];
            $res['errorInfo'] = $errorCode;
            $ret = true;
        }
        else
        {
            $ret = false;
        }
        $res['$ret'] = $ret;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getmagazineposition/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getMagazinePositionAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__."getAction: ".$command);
        $result = 'fail';
        
         $task_msg_id = GRAB_SEND_MSGID;
        $wfifo = msg_get_queue($task_msg_id);
        $msgType = 'v';

        if ($wfifo)
        {
            $format = "l14";
            $bin = pack($format, 0, 1,ord($msgType), 0, GRAB_RECV_MSGID, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            msg_send($wfifo, 1, $bin, false);
            $result = "success";
        }
        $res['result'] = $result;
        $this->setJsonContent($res);
    }
    
     /**
     * @Route("/getsaveposition/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getSavePositionAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.'getAction: '.$command);
        $result = false;
        
        $web_msg_id = GRAB_RECV_MSGID;
        $fifo = msg_get_queue($web_msg_id);
        $stat = msg_stat_queue($fifo);
        $positionH = 0;
        $positionL = 0;
        
        if ( $stat['msg_qnum'] > 0 ) 
        {
            $msgtype = 1;
            msg_receive($fifo, 0, $msgtype, 1024, $msg, false, 0, $msg_error);
            $result = unpack("L14", $msg);
            $positionH = $result[7];
            $positionL = $result[8];
            $ret = true;
        }
        else
        {
            $ret = false;
        }

        $res['positionH'] = $positionH;
        $res['positionL'] = $positionL;
         $res['ret'] = $result;
        
         $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getsavemagazineadjust/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function getSaveMagazineAdjustAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.' getAction: '.$command);
        $data = $this->getInput();
        
        $positionH = $data['positionH'];
        $positionL = $data['positionL'];
        $magazineId = $data['magazineId'];
        
        $task_msg_id = GRAB_SEND_MSGID;
        $wfifo = msg_get_queue($task_msg_id);

        $result = "fail";
        if ($wfifo)
        {
            $format = "l14";
            $bin = pack($format, 0, 1,ord('k'), 0, GRAB_RECV_MSGID, 0, $positionH, $positionL, 0, $magazineId, 0, 0, 0, 0);
            msg_send($wfifo, 1, $bin, false);
            $result = "success";
            exit();
        }
        $res['ret'] = $result;
        $this->setJsonContent($res);
    }
    
    //===== systemMonitor.html====
    /**
     * @Route("/getcpu/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getCpuSystemMonitorAction($command){//get Cpu Monitor Data
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.' getAction: '.$command);
        $ret = exec("top -d 1 -b -n 2 | grep 'Cpu(s):' | awk '{print $2 FS $3 FS $4 FS}' | sed 's/%us,//g' | sed 's/%sy,//g' | sed 's/%ni,//g' | sed -n '2p'");
        $extend = explode(" " , $ret); 
        $cpu_us = $extend[0];
        $cpu_sy = $extend[1];
        $cpu_ni = $extend[2];
        $cpu =  $cpu_us + $cpu_sy + $cpu_ni;
        $res['data'] = $cpu;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getmemorymonitor/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getMemoryMonitorAction($command){//get Memory Monitor Data
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.' getAction: '.$command);
        $ret = exec("top -d 1 -b -n 2 | grep 'Mem:' | awk '{print $3 FS $5 FS $9}' | sed 's/k//g' | sed -n '2p'");
        $ret2 = exec("top -d 1 -b -n 2 | grep 'Swap:' | awk '{print $9}' | sed 's/k//g' | sed -n '2p'");
        $extend = explode(' ', $ret);
        $extend2 = explode(' ', $ret2);
        $mem_total = $extend[0];
        $mem_used = $extend[1];
        $mem_buffers = $extend[2];
        $mem_cached = $extend2[0];
        $used = $mem_used -($mem_buffers + $mem_cached);
        $str = $used * 100 / $mem_total;
        $res['data'] =round($str ,2);
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getdiskmonitor/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getDiskMonitorAction($command){//get Disk Monitor Data
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.' getAction: '.$command);
        $ret = exec("df | grep '/mnt/data' | awk '{print $5}' | sed 's/%//g'");
        $res['data'] = $ret;
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/getnetwork/{command:[a-zA-Z]+}", methods={"POST", "PUT", "GET"})
     */
    public function getNetworkMonitorAction($command){//get Network Monitor Data
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.' getAction: '.$command);
        $ret1 = exec("cat /proc/net/dev | grep 'eth0' | awk '{print $2 FS $10}'");
        $extend1 = explode(' ', $ret1);
        $bytes_recv1 = $extend1[0];
        $bytes_trans1 = $extend1[1];
        sleep(1);
        $ret2 = exec("cat /proc/net/dev | grep 'eth0' | awk '{print $2 FS $10}'");
        $extend2 = explode(' ', $ret2);
        $bytes_recv2 = $extend2[0];
        $bytes_trans2 = $extend2[1];
        /* unit : Kb */
        $str = round(((floatval($bytes_recv2) + floatval($bytes_trans2) - floatval($bytes_recv1) - floatval($bytes_trans1)) * 8 / 1024), 2);
        $res['data'] = $str;
        $this->setJsonContent($res);
    }




    //===== disc.html====
    
    /**
     * @Route("/getdiscinfo/{command:.+}", methods={"POST", "PUT", "GET"})
     */
    public function getDiscInfoAction($command){
        $res = array();
        $res['status'] = 'OK';
        $this->log(__FUNCTION__.'getAction: '.$command);
        $data = $this->getInput();
        
        $task_msg_id = self::MAGAZINE_SEND_MSGID;
        $web_msg_id = self::MAGAZINE_RECV_MSGID;
        $wfifo = msg_get_queue($task_msg_id);
        $fifo = msg_get_queue($web_msg_id);
        $op =$data['op'];
        $id = $data['Id'];
        $ret = false;
        $arr=array();
        
        if ($wfifo && $fifo) {
            /* if message queue is empty. if not ,recv it first */
            if("recv" == $op){
                $stat = msg_stat_queue($fifo);
                if ( $stat['msg_qnum'] > 0 ) {
                    $msgtype = 1;
                    msg_receive($fifo, 0, $msgtype, 1024, $msg, false, 0, $msg_error);
                    $result = unpack("l40", $msg);
                    $this->setToApc("magazine_TVolume".$result[2], $result[3]);
                    $this->setToApc("magazine_UVolume".$result[2], $result[4]);
                    $this->setToApc("magazine_Rfid".$result[2], $result[5]);
                    for ($i = 1; $i <= self::SLOT_NUMBER; $i++){
                        $this->setToApc("magazineId".$result[2]."_slot".$i, $result[5 + $i]);
                    }
                    
                     $arr['ret'] = true;
                }else{
                     $arr['ret'] = false;
                }
                
                /* ---add--- */
                $recvValue[0] = $this->getFromApc("magazine_TVolume".$id);
                $recvValue[1] = $this->getFromApc("magazine_UVolume".$id);
                $recvValue[2] = $this->getFromApc("magazine_Rfid".$id);
                for ($i = 1; $i <= self::SLOT_NUMBER; $i++){
                    $recvValue[$i + 2] = $this->getFromApc("magazineId".$id."_slot".$i);
                }
                
                $recvValue[self::SLOT_NUMBER + 3] = $id;
                
                $str = exec("df | grep olfs");
                $out = preg_split("/[\s]+/ ", $str);
                $recvValue[0] = $out[1];
                $recvValue[1] = $out[2];
                $arr['ret'] = true;
                //$arr=array('ret'=>$ret, 'value'=>$recvValue, 'str'=>$str);
                $arr['value'] = $recvValue;
                $arr['str'] = $str;
                /* ---add--- */
            }
            /* send message */
            else if ("send" == $op){
                $format = "l2";
                $bin = pack($format, 1, $id);
                msg_send($wfifo, 1, $bin, false);
                $arr['ret'] = false;
                
                //$arr=array('ret'=>$ret, 'value'=>0);
                $arr['value'] = 0;
            }
        }
        $res['data'] = $arr;
        $this->setJsonContent($res);
    }
    
    public function getFromApc($key){
       if (!apc_exists($key))
       {
           $retValue = 0;
       }
       else
       {
           $retValue = apc_fetch($key);
       }

       return $retValue;
   }
   
    public function setToApc($key, $value){
       if (!apc_exists($key))
       {
           apc_add($key, $value, 21600);
       }
       else
       {
           apc_store($key, $value, 21600);
       }
   }
    
}
