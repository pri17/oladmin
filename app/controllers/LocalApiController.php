<?php

/**
 * @RoutePrefix("/localapi")
*/
class LocalApiController extends ApiControllerBase
{
	const OLFS_META_PREFIX = "/mnt/meta/";
	const NS_META_PREFIX = "/mnt/meta/ns/";
	const MOUNT_PATH = "/mnt/fuse/";
	const VOL_PREFIX = "/mnt/vol/";
	const DISC_VOL_PREFIX = "/mnt/meta/disc/vol/data/";
	const ODD_RUNTIME_PREFIX = "/tmp/runtime/odd/dev/";
	const TASK_RUNNING_PREFIX = "/mnt/meta/task/running/";
	const DATA_CACHE_PREFIX = "/mnt/local/hdd/cache/";
	
	const LOCALAPI_MSG_QUEUE = "LOCA";
	const MANAGER_MSG_QUEUE = "MANG";
	const MANG_TRIGGER_BURN = 1502;
	
    protected $debug = true;
    protected $model = "Olfs";
    protected $limit_default = 200;
    
    private function str2Key($str)
	{
		$key = ord($str[0]) * pow(2, 24) + ord($str[1]) * pow(2, 16) + ord($str[2])* pow(2, 8) + ord($str[3]);
		return $key;
	}
	
    public function outputFilter($output)
    {
	    return $output;
    }

    public function inputFilter($input)
    {
	    return $input;
    }


	/**
     * @Route("/globalstatus/get", methods={"POST", "GET"})
    */  
    public function getGlobalStatusAction()                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$data = $this->getInput();
		
        $cmd = "cd /home/release/setup/etc/util/; ./statvfs /mnt/fuse";
        //$cmd = "cd /home/jie/ol/my_work/setup/etc/util/; ./statvfs /";
		$output = `$cmd`;
		if(1 == preg_match("/[\s\S]*PHP[\s\S]*total blocks:  (\d+)[\s\S]*free blocks:  (\d+)[\s\S]*available blocks:  (\d+)[\s\S]*/", $output, $matches))
		{
		    $total_blocks = (int)$matches[1];
            $free_blocks = (int)$matches[2];
            $avail_blocks = (int)$matches[3];
            
            $res['capacity'] = $total_blocks . " MB";
            $res['capacity_used'] = ($total_blocks - $avail_blocks) . " MB";
            $res['capacity_avalaible'] = $avail_blocks . " MB";
            $res['capacity_bad'] = "0 MB";
		}
		else
		    $res['status'] = 'ERROR';
		    
		$cmd = "cd /home/release/manager; ./olfs";
		$output = `$cmd`;
		if(1 == preg_match("/version info: (.+),[\s\S]*build: (.+),[\s\S]*Group count: (\d+)[\s\S]*Number of disc per group: (\d+)[\s\S]*Disc buffer capacity: (.+) GiB[\s\S]*/", $output, $matches))
		{
		    $version = $matches[1];
            $build = $matches[2];
            $group_count = (int)$matches[3];
            $disc_per_group = (int)$matches[4];
            $disc_capacity = (int)$matches[5];
            
            $res['disc_group_count'] = $group_count;
            $res['disc_per_group'] = $disc_per_group;
            $res['disc_capacity'] = $disc_capacity." GB";
		}
		else
		    $res['status'] = 'ERROR';
		
		if($res['status'] == 'OK')
		{
		    $res['result'] = 1;
		}
		else
		{
		    $res['result'] = 0;
		    $res['reason'] = 'System error';
		}
		
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/filebatch/get", methods={"POST", "GET"})
    */  
    public function getFileBatchInfoAction()                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
		$data = $this->getInput();
		
		$filelist = $data['filelist'];
		if(empty($filelist))
		    $res['status'] = 'ERROR';
		foreach($filelist as $filepath)
		{
		    unset($fileinfo);
		    $fileinfo['file'] = $filepath;
		    
		    $content = file_get_contents(self::NS_META_PREFIX. '/'.$filepath);
		    //$this->log("ns meta for ".$filepath.": ".$content."\n");
		    if($content === FALSE)
		    {
		        $fileinfo['result'] = 3;
		        $fileinfo['reason'] = 'File not exist';
		        $res['results'][] = $fileinfo;
		        continue; //go to next file
		    }
		    
		    $stat = stat(self::MOUNT_PATH. '/'.$filepath);
		    if($stat === FALSE)
		    {
		        $fileinfo['result'] = 3;
		        $fileinfo['reason'] = 'File not exist';
		        $res['results'][] = $fileinfo;
		        continue; //go to next file
		    }
		    
		    //TRICK nlink == 2
		    if($stat[3] == 2) //burned
		    {
		        $fileinfo['result'] = 1; 
		    }
		    
		    $info = json_decode($content, TRUE);
		    
		    for($i = 0; $i < count($info[0]['splitinfo']); $i++)
		    {
    		    $volume_id = $info[0]['splitinfo'][$i]['volume_id'];
    		    //$this->log("\tvolume_id: ".$volume_id."\n");
    		    
    		    $stat = stat(self::VOL_PREFIX. '/'.$volume_id.'/'.$filepath);
    		    if($stat !== FALSE)
    		    {
    		        if($fileinfo['result'] == 1 || $fileinfo['result'] == 12)
    		            $fileinfo['result'] = 12; //both in disc and buffer
    		        else
    		            $fileinfo['result'] = 2; //only in buffer
    		    }
    		    
    		    $fileinfo['info'][$i]['volume'] = $info[0]['splitinfo'][$i]['volume_id'];
    		    $fileinfo['info'][$i]['offset'] = $info[0]['splitinfo'][$i]['offset'];
    		    $fileinfo['info'][$i]['count'] = $info[0]['splitinfo'][$i]['count'];
    		    
    		    if($fileinfo['result'] == 1 || $fileinfo['result'] == 12)
    		    {
    		        //find group #
    		        $content = file_get_contents(self::DISC_VOL_PREFIX. '/'.$volume_id);
    		        if($content === FALSE)
    		            $fileinfo['result'] = 3; //cannot happen
                    else
                    {
                        $info = json_decode($content, TRUE);
                        $fileinfo['info'][$i]['disc_group'] = $info[0]['group_index'];
                    }
    		            
    		    }
		    }
		    $res['results'][] = $fileinfo;
		}
		
		
		$this->setJsonContent($res);
    }
    
    /**
     * @Route("/record/set", methods={"POST", "GET"})
    */
    public function setRecordAction()
    {
	    $res = array();
	    $res['status'] = 'ERROR';
	    
	    $data = $this->getInput();
		
		$filelist = $data['filelist'];
		
		if(empty($filelist))
		    $res['status'] = 'ERROR';

        //send message to olfs
        //clear our receive queue
		$own_msg_queue = msg_get_queue($this->str2Key(self::LOCALAPI_MSG_QUEUE));
		msg_remove_queue($own_msg_queue);
		$own_msg_queue = msg_get_queue($this->str2Key(self::LOCALAPI_MSG_QUEUE));
		
		if(empty($own_msg_queue))
		{
		    //printf("Open own message queue failed!\n");
		    $this->setJsonContent($res);
		    return false;
		}
		
		//open destination message queue
		$dest_msg_queue = msg_get_queue($this->str2Key(self::MANAGER_MSG_QUEUE));
		if(empty($dest_msg_queue))
		{
		    //printf("Open dest message queue failed!\n");
		    $this->setJsonContent($res);
		    return false;
		}
		
		$format = "L4x104";
		$bin = pack($format, 10000, $this->str2Key(self::LOCALAPI_MSG_QUEUE), self::MANG_TRIGGER_BURN, 0);
		//send message
		msg_send($dest_msg_queue, 1, $bin, false);
		$this->log(__FUNCTION__." send MANG_TRIGGER_BURN \n");

        //wait for result
		$last = time();
		while(time() - $last < 3)
		{
			$msg_stat = msg_stat_queue($own_msg_queue);
			if ($msg_stat['msg_qnum'] > 0) //bingo
			{
				$msg = '';
		        msg_receive($own_msg_queue, 1, $this->msgtype, 1024, $msg, false);
		        $format = "L4header/L1background/a100output";
		        $result = unpack($format, $msg);
		        $this->log(__FUNCTION__." Get result: ".json_encode($result, JSON_PRETTY_PRINT)."\n");
		        $ret = $result['header'][3];
		        if($ret == 0)
		            $res['status'] = 'OK';
		        else
		            $res['status'] = 'ERROR';
			}
		}
		
		//timeout
		$this->log(__FUNCTION__."Timeout for get result from Manager module. \n");

	    $this->setJsonContent($res);

    }

    /**
     * @Route("/record/get", methods={"POST", "GET"})
    */
    public function getRecordAction()
    {
	    $res = array();
	    $res['status'] = 'ERROR';
	    $handle = FALSE;
	    $filename = self::ODD_RUNTIME_PREFIX;
	    $odd_group = 0;
	    
	    $dir_name = self::TASK_RUNNING_PREFIX;
	    if($handle = opendir($dir_name))
	    {
            while (false !== ($entry = readdir($handle))) {
                if ($entry == '.' || $entry == '..')
                        continue;
                
                $file_path = $dir_name.'/'.$entry;
                if(is_file($file_path))
                {
                    $content = file_get_contents($file_path);
                    $info = json_decode($content, TRUE);
                    $odd_group = $info[0]['odd_group'];
                    break;
                }
                        
            }
            closedir($handle);
	    }
	    
	    if($odd_group == 0)
	        $filename = $filename . '/sr0';
        else
            $filename = $filename . '/sr12';
	    
	    $fp = fopen($filename, 'r');
        if($fp == false)
        {
                $res['status'] = 'BUSY';
                goto out;
        }

        if(!flock($fp, LOCK_SH | LOCK_NB))
        {
                $res['status'] = 'BUSY';
                fclose($fp);
                goto out;
        }

        //read json content and decode
        $content = fread($fp, filesize($filename));
        flock($fp, LOCK_UN);
        fclose($fp);
        $result = json_decode($content, true); //decode it to array

        if($result[0]['status'] == 'burning' )
        {
                $res['status'] = 'BUSY';
                $res['percentage'] = $result[0]['burn_progress'] . '%';
                
        }
        else if($result[0]['status'] == 'ready' && $result[0]['burn_result'] == "success")
                $res['status'] = 'OK';
        
out:        
        $this->setJsonContent($res);
    }
    
    /**
     * @Route("/buffer/get", methods={"POST", "GET"})
    */
    public function getBufferAction()
    {
	    $res = array();
	    $res['status'] = 'ERROR';
	    
	    $data = $this->getInput();
		
		$fileurl = $data['fileurl'];
		
		if(empty($fileurl))
		{    
		    $res['status'] = 'ERROR';
		    goto out;
		}
		
		$content = file_get_contents(self::NS_META_PREFIX. '/'.$fileurl);
		    //$this->log("ns meta for ".$filepath.": ".$content."\n");
	    if($content === FALSE)
	    {
	        $res['status'] = 'OK';
	        $res['result'] = 3;
	        $res['reason'] = 'File not exist';
	        goto out;
	        
	    }
	    
	    $stat = stat(self::MOUNT_PATH. '/'.$fileurl);
	    if($stat === FALSE)
	    {
	        $res['status'] = 'OK';
	        $res['result'] = 3;
	        $res['reason'] = 'File not exist';
	        goto out;
	    }
	    
	    //TRICK nlink == 2
	    if($stat[3] == 2) //burned
	    {
	        $res['result'] = 2; // in disc
	    }
	    
	    $info = json_decode($content, TRUE);
	    
	    for($i = 0; $i < count($info[0]['splitinfo']); $i++)
	    {
		    $volume_id = $info[0]['splitinfo'][$i]['volume_id'];
		    //$this->log("\tvolume_id: ".$volume_id."\n");
		    
		    $stat = stat(self::VOL_PREFIX. '/'.$volume_id.'/'.$fileurl);
		    $stat_c = stat(self::DATA_CACHE_PREFIX. '/'.$fileurl);
		    if($stat !== FALSE || $stat_c !== FALSE)
		    {
		        if($res['result'] == 2 || $res['result'] == 12)
		            $res['result'] = 12; //both in disc and buffer
		        else
		            $res['result'] = 1; //only in buffer
		    }
		    
	    }
		    
		$res['status'] = 'OK';
out:		    
	    $this->setJsonContent($res);
    }
    
    /**
     * @Route("/buffer/set", methods={"POST", "GET"})
    */
    public function setBufferAction()
    {
	    $res = array();
	    $res['status'] = 'ERROR';
	    
	    $data = $this->getInput();
		
		$fileurl = $data['fileurl'];
		
		if(empty($fileurl))
		{    
		    $res['status'] = 'ERROR';
		    goto out;
		}
		
		$content = file_get_contents(self::NS_META_PREFIX. '/'.$fileurl);
		    //$this->log("ns meta for ".$filepath.": ".$content."\n");
	    if($content === FALSE)
	    {
	        $res['status'] = 'OK';
	        $res['result'] = 3;
	        $res['reason'] = 'File not exist';
	        goto out;
	        
	    }
	    
	    $stat = stat(self::MOUNT_PATH. '/'.$fileurl);
	    if($stat === FALSE)
	    {
	        $res['status'] = 'OK';
	        $res['result'] = 3;
	        $res['reason'] = 'File not exist';
	        goto out;
	    }
	    
	    //TRICK nlink == 2
	    if($stat[3] == 2) //burned
	    {
	        $res['result'] = 2; // in disc
	    }
	    
	    $info = json_decode($content, TRUE);
	    
	    for($i = 0; $i < count($info[0]['splitinfo']); $i++)
	    {
		    $volume_id = $info[0]['splitinfo'][$i]['volume_id'];
		    //$this->log("\tvolume_id: ".$volume_id."\n");
		    
		    $stat = stat(self::VOL_PREFIX. '/'.$volume_id.'/'.$fileurl);
		    $stat_c = stat(self::DATA_CACHE_PREFIX. '/'.$fileurl);
		    if($stat !== FALSE || $stat_c !== FALSE)
		    {
		        if($res['result'] == 2 || $res['result'] == 12)
		            $res['result'] = 12; //both in disc and buffer
		        else
		            $res['result'] = 1; //only in buffer
		    }
		    
	    }
	    
	    if($res['result'] == 2) //only in disc, we should trigger a READ task
	    {
	        $res['result'] = 1; //schedule OK
	        $cmd_str = 'screen -d -m rsync -avr --progress '.self::MOUNT_PATH. '/'.$fileurl.' '.self::DATA_CACHE_PREFIX.'/'.$fileurl;
	        $this->log(__FUNCTION__."Schedule read task, cmd: ".$cmd_str);
	        system($cmd_str);
	    }
	    else
	    {
	        $res['result'] = 2; //schedule ERROR
	        $res['reason'] = 'Already in buffer';
	    }
	    
	    $res['status'] = 'OK';
out:		
	    $this->setJsonContent($res);
    }
    
}
