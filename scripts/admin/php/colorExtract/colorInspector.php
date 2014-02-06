<?php
// Libraries
include_once("colors.inc.php");

// Constants
$delta = 24;
$reduce_brightness = false;
$reduce_gradients = false;
$num_results = 5;
$focus_width = .4;
$focus_height = .8;
$colorsFile = "colors.json";
$numColorsToTag = 2;


    /**************************
    * Functions
    **************************/
    
    function html2rgb($color){
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
    
    function getColors($products, $basicColors, $numColorsToTag, $num_results, $reduce_brightness, $reduce_gradients, $delta, $focus_width, $focus_height){
        $i=1;
        $ex=new GetMostCommonColors();                   
        
        // loop through all products and get image colors
        $colorStore = array();
        $colorStore['colors'] = array();
        foreach($products as $sku => $image){            
            
            // Gets the top colors in the image  
            try{          
                $colors=$ex->Get_Color($image, $num_results, $reduce_brightness, $reduce_gradients, $delta, $focus_width, $focus_height);
                
                if (is_array($colors) && count($colors)){                                
                    // For each top color, get the closest matching color in our fixed list of colors 
                    $productColors = array();
                    foreach ( $colors as $hex => $count ){
                    	if ( $count > 0 ){    	       	   
                    	   $percent = round($count * 100, 2);  
                    	   $rgb = html2rgb($hex.'');  	   
                    	   
                    	   $closestColor = findClosestColor($rgb, $basicColors); 
                    	   
                    	   // add the parent color of the closest color to the list of returned colors
                    	   if(!in_array($basicColors[$closestColor]['p'], $productColors)){   	   
                    	       $productColors[$basicColors[$closestColor]['p']] = $percent; 
                    	   }else{
                    	       $productColors[$basicColors[$closestColor]['p']] += $percent;   
                    	   }            	   
                    	}
                    }
                                
                    // Add the top colors to the color store
                    foreach ( $productColors as $parentColor => $percent ){            
                       
                       if ($parentColor != null && trim($parentColor) != ""){                
                           if(!array_key_exists($parentColor, $colorStore['colors'])){   	                   
                    	       $colorStore['colors'][$parentColor] = array();
                    	   }
                    	   
                    	   $colorStore['colors'][$parentColor][$sku] = $percent;            	   
                       }
                    }  
                    
                    $colorStore['numProducts'] = $i++;
                    
                    if (filesize("colorInspectorSaved.json") < 500000000){
                        $file = fopen("colorInspectorSaved.json","w");
                        fwrite($file,json_encode($colorStore));                       
                        fclose($file);
                    }
                }else{
                    $colorStore['colors']['error'][$sku] = -1;      
                }
            
            }catch(Exception $e){
                echo "Caught Error: " . $e->getMessage();
            }
        }        
                
        return $colorStore;             
    }
            
    
/********************
* start script
*********************/
    
if (isset($_POST['store'])){
    
    // Get data and convert to json
    $products = json_decode(stripslashes($_POST['store']),true);
    
    // Get Color file    
    $file = fopen($colorsFile, 'r');
    $colorsJson = fread($file, filesize($colorsFile));
    fclose($file);
    $basicColors = json_decode($colorsJson, true);    
    
    if (isset($_POST['numColorsToTag']) && is_numeric($_POST['numColorsToTag'])){
        $numColorsToTag = $_POST['numColorsToTag'];
    }
    
    $colorStoreResults = getColors($products, $basicColors, $numColorsToTag, $num_results, $reduce_brightness, $reduce_gradients, $delta, $focus_width, $focus_height);

    echo json_encode($colorStoreResults);
 } 
 
 class ColorInspector {
    
    public static function processImageColors($colorStore, $numColorsToTag){       
       $delta = 24;
       $reduce_brightness = false;
       $reduce_gradients = false;            
       $focus_width = .4;
       $focus_height = .8;                       
       $num_results = 5;  
       $colorsFile = dirname(__FILE__) . "/colors.json";      
        
       // Get data
       $products = $colorStore;
       
       // Get Color file    
       $file = fopen($colorsFile, 'r');
       $colorsJson = fread($file, filesize($colorsFile));
       fclose($file);
       $basicColors = json_decode($colorsJson, true);    
       
       if (isset($numColorsToTag) && is_numeric($numColorsToTag)){         
           $colorStoreResults = getColors($products, $basicColors, $numColorsToTag, $num_results, $reduce_brightness, $reduce_gradients, $delta, $focus_width, $focus_height);
           
           return $colorStoreResults;
       }else{
           echo "Missing Parameters";   
       }
       
    }
 }
 ?>