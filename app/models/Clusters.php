<?php

class Clusters extends ConfigBase
{
    protected $debug = true;
    protected $prefix = '/Cluster/';
    protected $schema = array (
        'magic' => '/^.+$/',
        'timestamp' => 0,
        'data' =>
            array (
                0 =>
                    array (
                        'ip' => '/^.+$/',
                        'nickname' => '/^.+$/',
                        'version' => '/^.+$/',
                    ),
            ),
    );
    protected $schema_require = array (
    );
    protected $schema_default = array (
        'magic' => 'OpStorIpc.v1',
        'timestamp' => 0,
        'data' =>
            array (
                0 =>
                    array (
                        'ip' => '',
                        'nickname' => '',
                        'version' => '',
                    ),
            ),
    );
    protected $indice = array (
    );

    public function getConfig($name)
    {
        $result = parent::getConfig($name);
        if($result == false)
            return array();
        return $result['data']; //only return the key part
    }

    public function setConfig($name, $data)
    {
        $content = $this->schema_default;
//        $content['data'] = $data;
//        $content['timestamp'] = time();
        return parent::setConfig($name, $content);
    }

}

