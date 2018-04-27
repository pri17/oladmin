<?php
/**
 * @RoutePrefix("/api/fs")
*/
class FsController extends ApiControllerBase
{
    protected $debug = true;
    protected $model = "Fss";
    protected $limit_default = 200;
    private $dataroot = '../../public/dataroot';
       
    public function outputFilter($output)
    {
	    return $output;
    }

    public function inputFilter($input)
    {
	    return $input;
    }


	/**
     * @Route("/readdir/{path:}", methods={"POST", "PUT", "GET"})
    */  
    public function readdirAction($path)                                                         
    {
		$res = array();
		$res['status'] = 'OK';
		
        if(empty($path))
        {
            if($this->request->isPost())
            {
                $data = $this->getInput();
                $path = $data['path'];
            }
            else if($this->request->isGet())
            {
                $path = $this->request->get('path');
            }
        }
        
        if(empty($path))
        {
            $res['status'] = 'ERROR';
            $this->setJsonContent($res);
            return;
        }
        
        $this->log(__FUNCTION__." readdirAction: ".$path.", uri: ".$this->request->getURI());
        
        $is_64bit = PHP_INT_MAX == 2147483647 ? false : true;
        $dataroot = readlink(__DIR__ . '/'. $this->dataroot);
        
        //$path = '/'.$path;
        if(basename($path) == "..")
            $path = dirname(dirname($path));
        $res['path'] = $path; 
        
        if($path[strlen($path) - 1] != '/')
            $path .= '/';
           
        $de_list = array();
        $ffs = scandir($path);
        foreach($ffs as $ff)
        {
            if($ff == '.')
                continue;
            if($ff == '..' && dirname($path) == dirname($dataroot)) // no .. for root dir
                continue;
                
            $filePath = $path.$ff;
            $isDir = is_dir($path.$ff);
            if($isDir)
                $isDir = 1;
            else
                $isDir = 0;
                
            //if(!$isDir)
            {
                $stat = stat($filePath);
                $filesize = $stat['size'];
                $mtime = $stat['mtime'];
                $nlink = $stat['nlink'];
                
                $de_list[] = array('filename' => $ff, 'isDir' => $isDir, 'size' => $filesize, 'mtime' => $mtime, 'nlink' => $nlink);
            }
            //else
            //   $de_list[] = array('filename' => $ff, 'isDir' => $isDir);
            
            

                
        }

		$res['data'] = $de_list;
		$this->setJsonContent($res);
    }
    
    /**
     * @Route("/search/{keyword:}", methods={"POST", "PUT", "GET"})
    */  
    public function searchAction($keyword)                                                         
    {
		$res = array();
		$res['status'] = 'OK';


        $data = $this->getInput();
        $path = $data['path'];
        $keyword = $data['keyword'];
        
        if(empty($path) || empty($keyword))
        {
            $res['status'] = 'ERROR';
            $this->setJsonContent($res);
            return;
        }
        
        $this->log(__FUNCTION__." searchAction: ".$path.", uri: ".$this->request->getURI());

        $is_64bit = PHP_INT_MAX == 2147483647 ? false : true;
        
        $path = '/'.$path;
        if(basename($path) == "..")
            $path = dirname(dirname($path));
            
        if($path[strlen($path) - 1] != '/')
            $path .= '/';
        
        $de_list = array();
        $cmd = "cd $path; find . -name \"*".$keyword."*\"";
        exec($cmd, $ffs);
        foreach($ffs as $ff)
        {
            if($ff == '.')
                continue;
            $filePath = $path.$ff;
            $isDir = is_dir($path.$ff);
            if($isDir)
                $isDir = 1;
            else
                $isDir = 0;
                
            //if(!$isDir)
            {
                $stat = stat($filePath);
                $filesize = $stat['size'];
                $mtime = $stat['mtime'];
                $nlink = $stat['nlink'];
                
                $de_list[] = array('filename' => $ff, 'isDir' => $isDir, 'size' => $filesize, 'mtime' => $mtime, 'nlink' => $nlink);
            }
            //else
            //   $de_list[] = array('filename' => $ff, 'isDir' => $isDir);
            
            

                
        }

		$res['data'] = $de_list;
		$this->setJsonContent($res);
    }
    
    /**
     * @Route("/geturi/{keyword:}", methods={"POST", "PUT", "GET"})
    */  
    public function geturiAction($keyword)                                                         
    {
		$res = array();
		$res['status'] = 'OK';


        $data = $this->getInput();
        $path = $data['path'];
        
        if(empty($path))
        {
            $res['status'] = 'ERROR';
            $this->setJsonContent($res);
            return;
        }
        
        $prefix = readlink(__DIR__ . '/'. $this->dataroot);
        $uri = str_replace($prefix, '/dataroot', $path);
        
        $this->log(__FUNCTION__." geturiAction: ".$path.", prefix: ".$prefix);

		$res['uri'] = $uri;
		$this->setJsonContent($res);
    }
}
