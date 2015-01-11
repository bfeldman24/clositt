<?php
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
            $userid = $_SESSION['userid'];               
        }  
        
        if ($userid > 0){
            $closetController = new ClosetController();  
            $result['user'] = $userid;
	    $result['success'] = $closetController->getAllClosets(false, $userid);
        }else{
            $result['error'] = "Need to Sign in!";   
        }
        
        return $result;
    }
}
?>
