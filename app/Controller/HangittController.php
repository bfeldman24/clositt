<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/ClosetController.php');


class HangittController{
    
    public static function getClosets(){
        $result = array();
        $userid = 0;
        
        if (isset($_GET['user']) && is_numeric($_GET['user']) && $_GET['user'] > 0){
            $userid = $_GET['user'];   
        }else if (isset($_SESSION['active']) && $_SESSION['active'] === true && 
                  isset($_SESSION['userid']) && is_numeric($_SESSION['userid'])){
            $userid = $_GET['userid'];               
        }  
        
        if ($userid > 0){
            $closetController = new ClosetController();  
            $result['success'] = $closetController->getAllClosets(true, $userid);
        }else{
            $result['error'] = "Need to Sign in!";   
        }
        
        return $result;
    }
}
?>