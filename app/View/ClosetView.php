<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/ProductView.php');

class ClosetView {	        
    
    public static function getClosetNames($closets){        
	    if (!isset($closets) || !is_array($closets)){      	
	       return null;
	    }	    	    								
		
		ob_start();
		
		foreach ($closets as $name => $items) {
		      $shortName = $name;
		   
		      // Trim names to fix boxes
		      if (strlen($shortName) > 15){
		          $shortName = substr($shortName, 0, 15) . "...";   
		      }
		      
		      $selector = preg_replace('/\s+/', '', $name);
		  ?>				
    		<li>
                <div class="btn-group">                    
                    <button type="button" class="btn btn-default nav-filter closetName" name="<?php echo $selector; ?>" ><?php echo $shortName; ?></button>
                </div>
            </li>							
        <?php }	
                
        $html = ob_get_clean();
        return preg_replace('/^\s+|\n|\r|\s+$/m', '', $html);
    }             
    
    
    public static function getClosets($closets, $userid){
        if (!isset($closets) || !is_array($closets)){      	
	       return null;
	    }	    	    								
		
		ob_start();        
        
        foreach ($closets as $name => $items) {                        				
            
            $closetRef = str_replace(' ', '', $name);
            $countItems = count($items);
            $itemsCount = 0;
            
            foreach ($items as $item) {
                if (isset($items[0]) && isset($items[0]['item']) && isset($items[0]['cache'])){
                    $itemsCount = $countItems;
                    break;       
                }   
            }  
            
            // Get the clositt page links        
            $home = 'http://www.clositt.com/'; // DELETE THIS AND JUST ADD HOME_PAGE
            $closittPageLink = rawurlencode($home . "!+/" . $userid . "/" . $closetRef);            
            $closittPageDescription = rawurlencode($name . " - Clositt.com");           
            
            if (isset($items[0]['cache'])){
                $closittPageImgLink = rawurlencode($items[0]['cache']);   
            }else{
                $closittPageImgLink = LOGO;
            }           
            
            // Closet header            
            ?>            
            <div class="panel panel-default closetPanel" id="<?php echo $closetRef; ?>" number="<?php echo $items[0]['id']; ?>" original="<?php echo $items[0]['title']; ?>">
                        <div class="panel-heading">
                            <h4 class="panel-title"><span class="closet-title" data-toggle="tooltip" data-placement="bottom" title="Edit or Delete"><?php echo $name; ?></span>&nbsp;<span class="badge itemCount"><?php echo $itemsCount; ?></span>
                                <a class="socialbtn" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $closittPageLink; ?>">
                                    <i class="icon-svg9"></i>
                                </a>
                                <a class="socialbtn" target="_blank" href="https://twitter.com/share?url=<?php echo $closittPageLink; ?>">
                                    <i class="icon-svg7"></i>
                                </a>
                                <a class="socialbtn" target="_blank" href="https://plus.google.com/share?url=<?php echo $closittPageLink; ?>">
                                    <i class="icon-svg10"></i>
                                </a>
                                <a class="socialbtn" target="_blank" href="http://pinterest.com/pin/create/button/?url=<?php echo $closittPageLink; ?>&media=<?php echo $closittPageImgLink; ?>&description=<?php echo $closittPageDescription; ?>">
                                    <i class="icon-svg11"></i>
                                </a>
                                <a class="socialbtn email-product" target="_blank" href="#" data-url="<?php echo $closittPageLink; ?>">
                                    <i class="icomoon-envelop"></i>
                                </a>
                <a class="icon-svg8 collapse-btn" data-toggle="collapse" href="#collapse<?php echo $closetRef; ?>"></a>
                            </h4>
                        </div>
                        <div id="collapse<?php echo $closetRef; ?>" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <section class="items">
                                    <div class="container">
                                         <div class="row box-row">

                                            <?php               
                                                // Closet Items                 
                                                foreach ($items as $item) {                                
                                                    echo ProductView::getProductGridTemplate($item, false);
                                                }            
                                            ?>               
                                                                                                                                                                 
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>            
            <?php 
        }
        
        $html = ob_get_clean();
        return preg_replace('/^\s+|\n|\r|\s+$/m', '', $html);  
    }
}
?>
