<!DOCTYPE>
<html>
<head>
<?php 
//error_reporting(E_ALL);
//ini_set("display_errors", 1);


require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
require_once(dirname(__FILE__) . '/../../../app/Controller/ListController.php');

$lineArray = ListController::readProdFile("feedback");
$feedback = '';
$numColumns = 7;

if (isset($lineArray)){    
    for ($i=0; $i < count($lineArray); $i++){
        $field = explode(",",$lineArray[$i]);
        
        $feedback .= "<tr>";
        
        if (count($field) > $numColumns){
            $feedback .= "<td>" . $lineArray[$i] . "</td>";
            
            // Fill in the empty columns
            for ($n=0; $n < $numColumns - 1; $n++){
                $feedback .= "<td>&nbsp;</td>";
            }
        }else{
            for ($f=0; $f < count($field); $f++){
                $feedback .= "<td>" . $field[$f] . "</td>";
            }
            
            // Fill in the empty columns
            for ($n=0; $n < $numColumns - count($field); $n++){
                $feedback .= "<td>&nbsp;</td>";
            }
        }                
        
        $feedback .= "</tr>";
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

#feedback{
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
        <h2>Feedback</h2>        
        
        <br>
        <table id="feedback" class="table table-striped table-hover table-bordered table-condensed table-responsive">
            <tr>
                <th>Feedback</th>
                <th>Email</th>
                <th>Name</th>
                <th>User ID</th>
                <th>User Session ID</th>
                <th>IP</th>
                <th>Date</th>            
            </tr>
            <?php echo $feedback; ?>
        </table>
    </div>
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php'); ?>
<?php include(dirname(__FILE__) . '/../../static/footerMeta.php'); ?>

<?php echo CLOSITT_JS; ?>
</body>
</html>
