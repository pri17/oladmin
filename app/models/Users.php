<?php

/**
 * Description of Users
 *
 * @author tyy
 */
class Users extends ConfigBase {
    //put your code here
    protected $debug = true;
    protected $prefix = '/User/';
    protected $schema = array(
        'magic' => '/^.+$/',
        'timestamp' => 0,
        'data' => array(
            'users' => array(
                0 => array(
                    'username' => '/^.+$/',
                    'userpassword' => '/^.+$/',
                    'userphone' => '/^.+$/',
                    'usermail' => '/^.+$/',
                    'permissionsid' => '/^.+$/',
                ),
            ),
            'permissions' => array(
                0 => array(
                    'id' => '/^.+$/',
                    'name' =>'/^.+$/',
                    'explain' =>'/^.+$/',
                ),
            ),
        ),
    );
    
    protected $schema_require = array();
    
    protected $schema_default = array(
        'magic' => 'OpStorUser.v1',
        'timestamp' => 0,
        'data' => array(
            'users' => array(
                0 => array(
                    'username' => '',
                    'userpassword' => '',
                    'userphone' => '',
                    'usermail' => '',
                    'permissionsid' => '',
                ),
            ),
            'permissions' => array(
                0 => array(
                    'id' => '',
                    'name' =>'',
                    'explain' =>'',
                ),
            ),
        ),
    );
    
    protected $indice = array();
    
    public function getConfig($name) {
        $result = parent::getConfig($name);
        if($result == false){
            return array();
        }
        return $result['data'];
    }
    
    public function setConfig($name, $data) {
        $content = $this->schema_default;
        $content['data'] = $data;
    	$content['timestamp'] = time();
        return parent::setConfig($name, $content);
    }
    
}
