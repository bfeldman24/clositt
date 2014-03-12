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

function rgb2hex($rgb) {
   $hex = "#";
   $hex .= str_pad(dechex($rgb[0]), 2, "0", STR_PAD_LEFT);
   $hex .= str_pad(dechex($rgb[1]), 2, "0", STR_PAD_LEFT);
   $hex .= str_pad(dechex($rgb[2]), 2, "0", STR_PAD_LEFT);

   return $hex; // returns the hex value including the number sign (#)
}

function rgbTohex($r,$g,$b) {
   $rgb = array();
   $rgb[] = $r;
   $rgb[] = $g;
   $rgb[] = $b;
   
   return rgb2hex($rgb);
}

function RGB_TO_HSV ($R, $G, $B)  // RGB Values:Number 0-255
{                                 // HSV Results:Number 0-1
   $HSL = array();

   $var_R = ($R / 255);
   $var_G = ($G / 255);
   $var_B = ($B / 255);

   $var_Min = min($var_R, $var_G, $var_B);
   $var_Max = max($var_R, $var_G, $var_B);
   $del_Max = $var_Max - $var_Min;

   $V = $var_Max;

   if ($del_Max == 0)
   {
      $H = 0;
      $S = 0;
   }
   else
   {
      $S = $del_Max / $var_Max;

      $del_R = ( ( ( $max - $var_R ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
      $del_G = ( ( ( $max - $var_G ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
      $del_B = ( ( ( $max - $var_B ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;

      if      ($var_R == $var_Max) $H = $del_B - $del_G;
      else if ($var_G == $var_Max) $H = ( 1 / 3 ) + $del_R - $del_B;
      else if ($var_B == $var_Max) $H = ( 2 / 3 ) + $del_G - $del_R;

      if (H<0) $H++;
      if (H>1) $H--;
   }

   $HSL['hue'] = $H * 255;
   $HSL['sat'] = $S * 255;
   $HSL['val'] = $V * 255;

   return $HSL;
}

function HSV_TO_RGB ($H, $S, $V)  // HSV Values:Number 0-1
{                                 // RGB Results:Number 0-255
    $RGB = array();

    if($S == 0)
    {
        $R = $G = $B = $V * 255;
    }
    else
    {
        $var_H = $H * 6;
        $var_i = floor( $var_H );
        $var_1 = $V * ( 1 - $S );
        $var_2 = $V * ( 1 - $S * ( $var_H - $var_i ) );
        $var_3 = $V * ( 1 - $S * (1 - ( $var_H - $var_i ) ) );

        if       ($var_i == 0) { $var_R = $V     ; $var_G = $var_3  ; $var_B = $var_1 ; }
        else if  ($var_i == 1) { $var_R = $var_2 ; $var_G = $V      ; $var_B = $var_1 ; }
        else if  ($var_i == 2) { $var_R = $var_1 ; $var_G = $V      ; $var_B = $var_3 ; }
        else if  ($var_i == 3) { $var_R = $var_1 ; $var_G = $var_2  ; $var_B = $V     ; }
        else if  ($var_i == 4) { $var_R = $var_3 ; $var_G = $var_1  ; $var_B = $V     ; }
        else                   { $var_R = $V     ; $var_G = $var_1  ; $var_B = $var_2 ; }

        $R = $var_R * 255;
        $G = $var_G * 255;
        $B = $var_B * 255;
    }

    $RGB['R'] = $R;
    $RGB['G'] = $G;
    $RGB['B'] = $B;

    return $RGB;
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

/// <summary>
/// Returns the nearest matching label color index available from the Label color list for a given color
/// </summary>
/// <param name="color">Whose match is to be found</param>
/// <returns>Label Color Index</returns>
function GetNearestColor($color, $ColorsHSB){    
    
    // adjust these values to place more or less importance on
    // the differences between HSV components of the colors
    $weightHue = 0.8;   
    $weightSaturation = 0.1;    
    $weightValue = 0.1;    
    $minDistance = 999999;
    $minColor = 0;
    $targetHSB = RGB_TO_HSV($color['r'], $color['g'], $color['b']);    
       
    foreach ($ColorsHSB as $colorName => $colorAttr ){    
    
        $dH = $colorAttr['hue'] - $targetHSB['hue'];
        $dS = $colorAttr['sat'] - $targetHSB['sat'];
        $dV = $colorAttr['val'] - $targetHSB['val'];
                
        $curDistance = sqrt($weightHue * pow($dH, 2) + $weightSaturation * pow($dS, 2) + $weightValue * pow($dV, 2));
        
        if ($curDistance < $minDistance){        
            $minDistance = $curDistance;            
            $minColor = $colorName;                 
        }
    }
    
    return $minColor;
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
    <tr>
        <th>Actual Color Code</th>
        <th>Actual Color</th>
        <th>Closest Color Name</th>
        <th>Closest Color (HSV) Name</th>        
        <th>Parent Color</th>
        <th>Percentage</th><td rowspan="<?php echo (($num_results > 0)?($num_results+1):22500);?>"><img src="<?php echo $image; ?>" alt="test image" /></td></tr>
    <?php
    
    $productColors = array();
    foreach ( $colors as $hex => $count )
    {
    	if ( $count > 0 )
    	{    	       	   
    	   $percent = round($count * 100, 2);  
    	   $rgb = html2rgb($hex.'');  	   
    	   
    	   $closestColor = findClosestColor($rgb, $basicColors);
    	   $closestColorHSV = GetNearestColor($rgb, $basicColors); 
    	   
    	   if(!in_array($basicColors[$closestColor]['p'], $productColors)){   	   
    	       $productColors[] = $basicColors[$closestColor]['p'];
    	   }    	   
    	   
    	   echo "<tr><td>".$hex."</td>";
    	   echo "<td style=\"background-color:#".$hex.";\"></td>";
    	   
    	   echo "<td style=\"background-color:".$basicColors[$closestColor]['h']."\"><b>".$closestColor."</b></td>";
    	   
    	   echo "<td style=\"background-color:".$basicColors[$closestColorHSV]['h']."\"><b>".$closestColorHSV."</b></td>";
    	   
    	   echo "<td><b>".$basicColors[$closestColor]['p']."</b></td>";
    	   echo "<td>".$percent."%</td></tr>";
    	}
    }
    echo "<h2>$i) </h2><span><b>" . implode(", ",$productColors) . "</b></span>";  
    
    
    // PRINT CORNER COLORS
    echo "<br />";
    echo "TopLeft: " . $topLeftHex;
    echo " - TopRight: " . $topRightHex;
    echo " - BottomLeft: " . $bottomLeftHex;
    echo " - BottomRight: " . $bottomRightHex;
    echo "<br />";
    echo $sameColor ? "SAME CORNER COLORS" : "DIFFERENT CORNER COLORS";
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