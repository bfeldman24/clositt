<!DOCTYPE>
<html>
<head>
<?php 
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   

require_once(dirname(__FILE__) . '/../../../app/Controller/UserController.php');
$userController = new UserController();             
$users = $userController->getAllUserInfo();
$userTable = '';
$userCount = '';

if (isset($users)){    
    $userCount = count($users);
    for ($i=0; $i < $userCount; $i++){
                
        $userTable .= "<tr>";                
        $userTable .= "<td>".($userCount - $i)."</td>";
        $userTable .= "<td>".$users[$i][USER_NAME]."</td>";
        $userTable .= "<td>".$users[$i][USER_EMAIL]."</td>";
        $userTable .= "<td>".$users[$i][USER_LOGIN_COUNT]."</td>";
        $userTable .= "<td>".$users[$i][USER_LAST_SIGNED_IN]."</td>";
        $userTable .= "<td>".$users[$i][USER_DATE_SIGNED_UP]."</td>";        
        $userTable .= "</tr>";
    }   
}

?>
<style type="text/css">
body{
	font-size:16px;	
	line-height: 1.42857;
}

h2 {
    font-size: 30px;
}

h1, .h1, h2, .h2, h3, .h3 {
    margin-bottom: 10px;
    margin-top: 20px;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    color: inherit;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
}

th{
 font-weight: bold;   
}

#mainContent{
  padding: 20px;      
}

li{
    list-style: decimal outside none;   
}

#users{
    margin-bottom: 50px;   
}

.user{
    font-weight: bolder;   
}
</style>

</head>
<body>
<div class="wrapper">
    <?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
    <div id="mainContent">
        <a href="#" name="top"></a>
        <h2>Users <span class="badge"><?php echo $userCount; ?></span></h2>                
        <br>        
        
        <table id="users" class="table table-striped table-hover table-bordered table-condensed table-responsive">
            <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Login Count</th>
                <th>Last Logged In</th>
                <th>Date Signed Up</th>
            </tr>
            <?php echo $userTable; ?>
        </table>                                        
    </div>
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php'); ?>
</body>
</html>
