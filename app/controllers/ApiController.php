<?php

class ApiController extends ApiControllerBase
{
	public function indexAction()
	{
		echo "This is the default controller/action";
		echo "route name: ".$this->getRouteName()." action name: ".$this->getActionName();
	}


}
