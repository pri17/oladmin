<?php
/**
 * Created by IntelliJ IDEA.
 * User: zwj
 * Date: 2018/5/14
 * Time: 10:44
 */
/**
 * @RoutePrefix("/api/clusters")
 */
class ClusterController extends ApiControllerBase{
    //put your code here
    protected $debug = true;
    protected $model = "Cluster";
    protected $limit_default = 200;

    public function outputFilter($output)
    {
        return $output;
    }

    public function inputFilter($input)
    {
        return $input;
    }
    

}
