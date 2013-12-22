<?php
$delta = 24;
$reduce_brightness = false;
$reduce_gradients = false;
$num_results = 5;

$focus_width = .4;
$focus_height = .8;

include_once("../colors.inc.php");
$ex=new GetMostCommonColors();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
	<style type="text/css">
		* {margin: 0; padding: 0}
		//body {text-align: center;}
		div#wrap {margin: 10px auto; text-align: left; position: relative; width: 500px;}
		img {width: 200px;}
		table {border: solid #000 1px; border-collapse: collapse;}
		td, th {border: solid #000 1px; padding: 2px 5px; white-space: nowrap;}
		br {width: 100%; height: 1px; clear: both; }
	</style>
</head>
<body>
<h1>COLOR DETECTION TEST</h1><br>
<?php
$myFile = "clothies-products-export.json";
$fh = fopen($myFile, 'r');
$theData = fread($fh, filesize($myFile));
fclose($fh);
$products = json_decode($theData, true);

/********************/

$colorsFile = "../colors.json";
$fha = fopen($colorsFile, 'r');
$colorsJson = fread($fha, filesize($colorsFile));
fclose($fha);
$basicColors = json_decode($colorsJson, true);


/************************/

function html2rgb($color)
{
    if ($color[0] == '#')
        $color = substr($color, 1);

    if (strlen($color) == 6)
        list($r, $g, $b) = array($color[0].$color[1],
                                 $color[2].$color[3],
                                 $color[4].$color[5]);
    elseif (strlen($color) == 3)
        list($r, $g, $b) = array($color[0].$color[0], $color[1].$color[1], $color[2].$color[2]);
    else
        return false;

    $r = hexdec($r); $g = hexdec($g); $b = hexdec($b);

    return array('r' => $r, 'g' => $g, 'b' => $b);
}


// color1 and color 2
function getColorDiff($c1, $c2, $weight = true){
    
    if($weight){
        $redWeight = .299;
        $greenWeight = .587;
        $blueWeight = .114;
    }else{
        $redWeight = 1;
        $greenWeight = 1;
        $blueWeight = 1;    
    }
    
    return pow((intval($c1['r']) - intval($c2['r'])) * $redWeight,2) + 
           pow((intval($c1['g']) - intval($c2['g'])) * $greenWeight,2) + 
           pow((intval($c1['b']) - intval($c2['b'])) * $blueWeight,2);
}


function findClosestColor($color, $colorSet){
    $minDiff = 9999;
    $minColor = null;        
    
    foreach ($colorSet as $colorName => $colorAttr ){
        $diff = getColorDiff($color, $colorAttr, false);
        //$colorAttr['diff'] = $diff;
        
        if ($diff < $minDiff){
            $minDiff = $diff;
            $minColor = $colorName;
            
            if($diff == 0){
                break;   
            }
        }
    }            
        
    return $minColor;
}

$limit = 40;
$i=0;
$time_start = microtime(true);
foreach($products as $key => $value){    
    if ($i >= $limit){
        break;
    }
    $i++;
    
    $image = $value['i'];
?>

    <?php
        $colors=$ex->Get_Color($image, $num_results, $reduce_brightness, $reduce_gradients, $delta);
    ?>
    <table>
    <tr><th>Color Code</th><th>Color</th><th>Color Name</th><th>Color Name Code</th><th>Parent Color</th><th>Percentage</th><td rowspan="<?php echo (($num_results > 0)?($num_results+1):22500);?>"><img src="<?php echo $image; ?>" alt="test image" /></td></tr>
    <?php
    
    $productColors = array();
    foreach ( $colors as $hex => $count )
    {
    	if ( $count > 0 )
    	{    	       	   
    	   $percent = round($count * 100, 2);  
    	   $rgb = html2rgb($hex.'');  	   
    	   
    	   $closestColor = findClosestColor($rgb, $basicColors); 
    	   
    	   if(!in_array($basicColors[$closestColor]['p'], $productColors)){   	   
    	       $productColors[] = $basicColors[$closestColor]['p'];
    	   }
    	   
    	   echo "<tr><td>".$hex."</td><td style=\"background-color:#".$hex.";\"></td><td style=\"background-color:".$basicColors[$closestColor]['h']."\"><b>".$closestColor."</b></td><td>".$basicColors[$closestColor]['h']."</td><td><b>".$basicColors[$closestColor]['p']."</b></td><td>".$percent."%</td></tr>";
    	}
    }
    echo "<h2>$i) </h2><span><b>" . implode(", ",$productColors) . "</b></span>";    
    ?>
    </table>
    <br />
    
<?php 
} 


$time_end = microtime(true);
$time = round($time_end - $time_start, 2);

echo "<h2>Took $time seconds for $limit products!</h2>";
?>    
</body>
</html>