<?php

class Olrun
{
	protected $debug = true;
	private $msgtype = 1;
	
	const OLADMIN_MSG_QUEUE = "ADMI";
	
	//olrun
	const SETUP_MSG_QUEUE = "SETP";
	const SETUP_START = 100;
	const SETUP_STOP = 101;
	const SETUP_QUERY = 102;
	const SETUP_CANCELALL = 103;
	
	const SETUP_OK = 0;
	const SETUP_ERROR = 1;
	
	//utils path relative to the home directory of olrun.
	const UTILS_PATH = './etc/util/';
	
	private $command_map = array (
	    //command => {script_name, msg_queue_key, no_response(sync run)}
	    'ifconfig' => array('ifconfig.php', 'ifco', 0),
	    'fdisk' => array('fdisk.php', 'fdis', 0),
	    'mkfs' => array('mkfs.php', 'mkfs', 0),
	    'lssr' => array('lssr.php', 'lssr', 0),
	    'raidcreate' => array('raidcreate.php', 'raid', 0),
	    'eject' => array('eject.php', '', 1),
	    'ejectraw' => array('eject_raw.php', '', 1),
	    'load' => array('load.php', '', 1),
	    'loadraw' => array('load_raw.php', '', 1),
	    'logread' => array('logread.php', 'logr', 0),
	    'accesslogr' => array('accesslogr.php', 'alog', 0),
	    'robot' => array('robot.php', 'robo', 0),
	    'olfsinit' => array('olfsinit.php', 'olfi', 0),
	    'reboot' => array('reboot.php', 'rebo', 0),
	    'poweroff' => array('poweroff.php', 'poff', 0),
	    'onvif' => array('onvif.php', 'onvi', 0),
	    'ipcpreview' => array('ipc_preview.php', 'ipcp', 0),
	    
	    );
	
	private function str2Key($str)
	{
		$key = ord($str[0]) * pow(2, 24) + ord($str[1]) * pow(2, 16) + ord($str[2])* pow(2, 8) + ord($str[3]);
		return $key;
	}
	
	private function log($str)
	{
		if($this->debug)
			file_put_contents("php://stdout", $str);
	}
	
	public function runCommand($command, $param)
	{
		$no_response = 0;
		$cmd_str = self::UTILS_PATH;
		
		if(array_key_exists($command, $this->command_map))
		{
		    $cmd_str .= $this->command_map[$command][0];
		    $no_response = $this->command_map[$command][2];
		}
		else
		{
		    $cmd_str = $command;
		    $no_response = 1; //no need to getResponse(). Synchronized call.
		}
		
		//clear our receive queue
		$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		msg_remove_queue($own_msg_queue);
		$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		
		if(empty($own_msg_queue))
		{
		    //printf("Open own message queue failed!\n");
		    return false;
		}
		
		//open destination message queue
		$dest_msg_queue = msg_get_queue($this->str2Key(self::SETUP_MSG_QUEUE));
		if(empty($dest_msg_queue))
		{
		    //printf("Open dest message queue failed!\n");
		    return false;
		}
		
		$format = "L4a60a40L1";
		$bin = pack($format, 10000, $this->str2Key(self::OLADMIN_MSG_QUEUE), self::SETUP_START, 0, $cmd_str, $param, (1 - $no_response));
		//send message
		msg_send($dest_msg_queue, $this->msgtype, $bin, false);
		$this->log(__FUNCTION__."cmd string: ".$cmd_str." \n");
		
		//wait for result
		$last = time();
		while(time() - $last < 3)
		{
			$msg_stat = msg_stat_queue($own_msg_queue);
			if ($msg_stat['msg_qnum'] > 0) //bingo
			{
				$msg = '';
		        msg_receive($own_msg_queue, $this->msgtype, $this->msgtype, 1024, $msg, false);
		        $format = "L4header/L1background/a100output";
		        $result = unpack($format, $msg);
		        $this->log(__FUNCTION__." Get olrun result: ".json_encode($result, JSON_PRETTY_PRINT)."\n");
		        return trim($result['output']);
			}
		}
		
		//timeout
		$this->log(__FUNCTION__."Timeout for get result from Olrun. \n");
		return false; 
	}
	
	public function getResponse($command, $req='GET_RESULT')
	{
		$req_msg = array(
	    'req' => $req,
	    'own_msg_queue_key' => $this->str2Key(self::OLADMIN_MSG_QUEUE),
	    );
    
		$msg_queue = "";
		$result = array(
		'status' => 'BUSY',	
		);

		if(array_key_exists($command, $this->command_map))
		{
		    $msg_queue = $this->command_map[$command][1];
		    if(empty($msg_queue))
		        return false;
		}
		else
		    return false;
		
		//Now each olrun daemon has a response queue
		//$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		$own_msg_queue = msg_get_queue($this->str2Key($msg_queue) + 1); //A trick
		$this->log(__FUNCTION__." create receive queue: ". ($this->str2Key($msg_queue) + 1). ", resource: ". $own_msg_queue. "\n");
		$req_msg['own_msg_queue_key'] = $this->str2Key($msg_queue) + 1;
		$dest_msg_queue = msg_get_queue($this->str2Key($msg_queue));

		//receive response		
		$msg_stat = msg_stat_queue($own_msg_queue);
		$this->log(__FUNCTION__." message count: ".$msg_stat['msg_qnum']."\n");
		if ($msg_stat['msg_qnum'] > 0)
		{
			$msg = '';
	        msg_receive($own_msg_queue, $this->msgtype, $this->msgtype, 16*1024, $msg, false);
	        $result = json_decode($msg, TRUE);
	        $this->log(__FUNCTION__." Get response: ".json_encode($result, JSON_PRETTY_PRINT)."\n");
		}
		
		//send get_result if needed
		if($result['status'] == 'BUSY')
			msg_send($dest_msg_queue, 1, json_encode($req_msg), false);
			
		return $result;
		
	}
	
	public function sendCommand($command, $reqdata)
	{
		$req_msg = $reqdata;
    
		$msg_queue = "";
		$result = true;

		if(array_key_exists($command, $this->command_map))
		{
		    $msg_queue = $this->command_map[$command][1];
		    if(empty($msg_queue))
		        return false;
		}
		else
		    return false;
		
		//Now each olrun daemon has a response queue
		//$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		$own_msg_queue = msg_get_queue($this->str2Key($msg_queue) + 1); //A trick
		$req_msg['own_msg_queue_key'] = $this->str2Key($msg_queue) + 1;
		msg_remove_queue($own_msg_queue); //clear
		$own_msg_queue = msg_get_queue($this->str2Key($msg_queue) + 1);
		
		$dest_msg_queue = msg_get_queue($this->str2Key($msg_queue));

		$result = msg_send($dest_msg_queue, 1, json_encode($req_msg), false);
			
		return $result;
		
	}
	
	public function queryCommand($command)
	{
		$no_response = 0;
		$cmd_str = '';
		$param ='';
		
		if(array_key_exists($command, $this->command_map))
		{
		    $cmd_str .= $this->command_map[$command][0];
		}
		else
		    $cmd_str = $command;
		$no_response = 1; //no need to getResponse(). Synchronized call.
		//clear our receive queue
		$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		msg_remove_queue($own_msg_queue);
		$own_msg_queue = msg_get_queue($this->str2Key(self::OLADMIN_MSG_QUEUE));
		
		if(empty($own_msg_queue))
		{
		    //printf("Open own message queue failed!\n");
		    return false;
		}
		
		//open destination message queue
		$dest_msg_queue = msg_get_queue($this->str2Key(self::SETUP_MSG_QUEUE));
		if(empty($dest_msg_queue))
		{
		    //printf("Open dest message queue failed!\n");
		    return false;
		}
		
		$format = "L4a60a40L1";
		$bin = pack($format, 10000, $this->str2Key(self::OLADMIN_MSG_QUEUE), self::SETUP_QUERY, 0, $cmd_str, $param, (1 - $no_response));
		//send message
		msg_send($dest_msg_queue, $this->msgtype, $bin, false);
		$this->log(__FUNCTION__."cmd string: ".$cmd_str." \n");
		
		//wait for result
		$last = time();
		while(time() - $last < 3)
		{
			$msg_stat = msg_stat_queue($own_msg_queue);
			if ($msg_stat['msg_qnum'] > 0) //bingo
			{
				$msg = '';
		        msg_receive($own_msg_queue, $this->msgtype, $this->msgtype, 1024, $msg, false);
		        $format = "L4header/L1background/a100output";
		        $result = unpack($format, $msg);
		        $this->log(__FUNCTION__." Get olrun result: ".json_encode($result, JSON_PRETTY_PRINT)."\n");
                if($result['header3'] == self::SETUP_OK) 
		            $res['status'] = 'OK';
		        else
		            $res['status'] = 'ERROR';
		        return $res;
			}
		}
		
		//timeout
		$this->log(__FUNCTION__."Timeout for get result from Olrun. \n");
		return false; 
		
	}
	
	public function getshmResponse($command, $ref_key = 0)
	{
		if(array_key_exists($command, $this->command_map))
		{
		    $msg_queue = $this->command_map[$command][1];
		    if(empty($msg_queue))
		        return false;
		}
		else
		    return false;
		
		$shm = shm_attach($this->str2Key($msg_queue));

	    $result = array();
	    $last_key = $ref_key;
	    
	    for($i = $ref_key; $i < $ref_key + 100; $i++)
	    {
	        if(shm_has_var($shm, $i % 100))
	        {
	            $value = shm_get_var($shm, $i % 100);
	            if($value['var_key'] > $last_key) //round
	            {
	                $last_key = $value['var_key'];
	                $result[] = $value;
	                
	            }
	            else if($value['var_key'] == $last_key)
	                ;
	            else if($value['var_key'] < $last_key)
	                break;
	        }
	    }
			
		return $result;
		
	}
	
}
