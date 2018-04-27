<?php
use Phalcon\Mvc\Controller;
class IndexController extends Controller
{
    public function indexAction()
    {
		//cookie related
		$tid = $this->cookies->has('tid');
		if(!$tid)
		{
			$this->logger->log("setting cookies...");
	//		$this->logger->log("host:".$this->request->getHttpHost());
			$tid = microtime();
			$this->cookies->set('tid', $tid, time() + 86400 * 365, '/', false, "", true); //1 year. Default http only
			$this->cookies->set('XSRF-TOKEN', $tid, time() + 86400 * 365, '/', false, "", false); //1 year
		}
	
		//authorization
		$auth = $this->session->get('auth');
		$uri = $this->request->getURI();
//		$this->logger->log("auth:".$auth.", uri:".$uri);
		if($auth != 'yes' && $auth != 'pre' && $this->request->get('func') != 'list')
		{
			$this->session->set('auth', 'pre');
			//$this->response->redirect("#/login")->sendHeaders();
		}
		else if($auth == 'yes' && $this->request->get('func') != 'list')
		{
			$this->session->set('fn', $this->request->get('fn'));
			$this->session->set('ln', $this->request->get('ln'));
			$this->session->set('m', $this->request->get('m'));
			$this->session->set('c0', $this->request->get('c0'));
			$this->session->set('c1', $this->request->get('c1'));
			$this->session->set('c2', $this->request->get('c2'));
			$this->logger->log("Already login.");
		}
		else if($this->request->get('func') == 'list')
		{
		
		}
		//juse for test
		$_SESSION['userid'] = session_id();
/*	Session DEBUG	
		$this->logger->log(__FUNCTION__." session: ". var_export($_SESSION, true));
		if(isset($_SESSION['LAST_ACTIVITY']))
		{
			$this->logger->log('LAST_ACTIVITY:'. date("Y-m-d H:i:s", $_SESSION['LAST_ACTIVITY']));
		}
		
		if(isset($_SESSION['CREATED']))
		{
			$this->logger->log('CREATED:'. date("Y-m-d H:i:s", $_SESSION['CREATED']));
		}
		
		if(isset($_SESSION['LAST_CREATED']))
		{
			$this->logger->log('LAST_CREATED:'. date("Y-m-d H:i:s", $_SESSION['LAST_CREATED']));
		}
		
		$this->logger->log('session id:'. session_id());
/*		
		if($tid === true)
		{
			$tid = $this->cookies->get('tid');
		}
		$this->logger->log('tid:'. $tid);
//*/

//*/

    }
}

