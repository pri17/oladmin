<?php

/**
 * Description of Users
 *
 * @author tyy
 */
class Groups extends ConfigBase{
    //put your code here
    protected $debug = true;
    protected $prefix = '/Group';
    protected $schema = array(
        'magic' => '/^.+$/',
        'timestamp' => 0,
        'data' => array(
            0 => array(
                'id' => 0,
                'name' =>'/^.+$/',
                'camera' =>'/^.+$/',
            ),
        ),
    );

    protected $schema_require = array();
    
    protected $schema_default = array(
        'magic' => 'OpStorGroup.v1',
        'timestamp' => 0,
        'data' => array(
            0 => array(
                'id' => 0,
                'name' =>'/^.+$/',
                'camera' =>'/^.+$/',
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
