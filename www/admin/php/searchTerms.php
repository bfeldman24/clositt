<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
require_once(dirname(__FILE__) . '/../../../app/Controller/ListController.php');

$lineArray = ListController::readFile("searchTerms");
$searchTerms = '';
$numColumns = 4;

if (isset($lineArray)){    
    sort($lineArray);
    for ($i=1; $i < count($lineArray); $i++){
        $field = explode(",",$lineArray[$i]);
        
        $searchTerms .= "<tr>";
        
        if (count($field) > $numColumns){
            $searchTerms .= "<td>" . $lineArray[$i] . "</td>";                        
            $columnsFilled = 1;
        }else{
            for ($f=0; $f < count($field); $f++){
                $searchTerms .= "<td>" . $field[$f] . "</td>";
            }         
            
            $columnsFilled = count($field);               
        }    
        
        // Fill in the empty columns
        for ($n=0; $n < $numColumns - $columnsFilled; $n++){
            $searchTerms .= "<td>&nbsp;</td>";
        }            
        
        $searchTerms .= "</tr>";
    }   
}


?>
<style type="text/css">
body{
	font-size:16px;	
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

</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Search Terms</h2>        
    
    <br>
    <table id="feedback" class="table table-striped table-hover table-bordered table-condensed table-responsive">
        <tr>
            <th>Search Term</th>
            <th>User Session ID</th>
            <th>IP</th>
            <th>Date</th>            
        </tr>
        <?php echo $searchTerms; ?>
    </table>                                
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
</body>
</html>
