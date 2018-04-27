<?php

/**
 * @RoutePrefix("/api/olfs")
*/
class OlfsController extends ApiControllerBase
{
	const OLFS_META_PREFIX = "/mnt/meta/";
    protected $debug = true;
    protected $model = "Olfs";
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
     * @Route("/getstatus", methods={"POST", "PUT", "GET"})
    */  
    public function getStatusAction()                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		$res['data'] = array();
		
        $cmd = "cd /home/release/setup/etc/util/; ./statvfs /mnt/fuse";
        //$cmd = "cd /home/jie/ol/my_work/setup/etc/util/; ./statvfs /";
		$output = `$cmd`;
		if(1 == preg_match("/[\s\S]*PHP[\s\S]*total blocks:  (\d+)[\s\S]*free blocks:  (\d+)[\s\S]*available blocks:  (\d+)[\s\S]*/", $output, $matches))
		{
		    $total_blocks = (int)$matches[1];
            $free_blocks = (int)$matches[2];
            $avail_blocks = (int)$matches[3];
            
            $res['data']['total_blocks'] = $total_blocks;
            $res['data']['used_blocks'] = $total_blocks - $avail_blocks;
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
            
            $res['data']['version'] = $version;
            $res['data']['build'] = $build;
            $res['data']['group_count'] = $group_count;
            $res['data']['disc_per_group'] = $disc_per_group;
            $res['data']['disc_capacity'] = $disc_capacity;
		}
		else
		    $res['status'] = 'ERROR';
		
		$str = `cat /tmp/runtime/manager/status`;
		$output = json_decode($str, TRUE);
		if(array_key_exists('status', $output[0]))
		    $res["data"]["status"] = $output[0]['status'];
		    
		if(array_key_exists('mode', $output[0]))
		    $res["data"]["mode"] = $output[0]['mode'];
		
		if(array_key_exists('cur_writing_buffer_index', $output[0]))
		    $res["data"]["cur_writing_buffer_index"] = $output[0]['cur_writing_buffer_index'];    
		
		if(array_key_exists('dataAmountToBurn', $output[0]))
		    $res["data"]["dataAmountToBurn"] = $output[0]["dataAmountToBurn"];
		    
		if(array_key_exists('discGroupToBurn', $output[0]))
		    $res["data"]["discGroupToBurn"] = $output[0]["discGroupToBurn"];
		    
		if(array_key_exists('currentTask', $output[0]))
		    $res["data"]["currentTask"] = $output[0]["currentTask"];
		    
		if(array_key_exists('taskIndex', $output[0]))
		    $res["data"]["taskIndex"] = $output[0]["taskIndex"];
		
		if(array_key_exists('taskProgress', $output[0]))
		    $res["data"]["taskProgress"] = $output[0]["taskProgress"];
		
//		$this->log(__FUNCTION__.' $output:'.json_encode($output));
//		$this->log(__FUNCTION__.' $res:'.json_encode($res));
		    
		$this->setJsonContent($res);

    }
    
    /**
     * @Route("/get/{id:.+}", methods={"POST", "PUT", "GET"})
    */
    public function getByIdAction($id)
    {
	    $res = array();
	    $res['status'] = 'OK';



	    $this->setJsonContent($res);

    }

}
