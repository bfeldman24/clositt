<?php
require_once(dirname(__FILE__) . '/../globals.php');
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
		      
		      $selector = preg_replace('/[\s\W]+/', '', $name);
		  ?>				
    		<li>
                <div class="btn-group">                    
                    <button type="button" class="btn btn-default nav-filter closetName" name="<?php echo $selector; ?>" data-toggle="tooltip" data-placement="top" title="<?php echo $shortName == $name ? '' : $name; ?>"><?php echo $shortName; ?></button>
                </div>
            </li>							
        <?php }	
                
        $html = ob_get_clean();
        return preg_replace('/^\s+|\n|\r|\s+$/m', '', $html);
    }             
    
    
    public static function getClosets($closets, $userid, $unsaved = false){
        if (!isset($closets) || !is_array($closets)){      	
	       return null;
	    }	    	
	    
	    global $isUnsaved;
	    $isUnsaved = $unsaved;    								
		
		ob_start();        
        
        foreach ($closets as $name => $items) {                        				
                        
            $closetRef = preg_replace('/[\s\W]+/', '', $name);
            $closetRef .= $isUnsaved ? "-unsaved" : '';            
            $itemsCount = 0;            
            
            foreach ($items as $item) {
                if (isset($item) && !empty($item['item']) && !empty($item['cache'])){
                    $itemsCount++;
                }   
            }  
            
            // Get the Price alerts info
            $priceAlertsFrequency = "Daily";
            
            switch($_SESSION['pricealerts']){
                case 2:
                    $priceAlertsFrequency = "Weekly";
                    break;
                case 3:
                    $priceAlertsFrequency = "Monthly";
                    break;   
            }
                        
            $areAlertsOn = isset($items[0]['alert']) ? $items[0]['alert'] : false;            
            $priceAlertsTooltip = $priceAlertsFrequency . " Price Alerts " . ($areAlertsOn === 'Y' ? "On" : "Off");
            $priceAlertsClass = $areAlertsOn === 'Y' ? '' : "off";
            
            // Get the clositt page links        
            $home = HOME_PAGE;
            $closittPageLink = $home . "!+/" . $userid . "/" . $closetRef;
            $closittPageLinkEncoded = rawurlencode($closittPageLink);            
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
                            <h4 class="panel-title"><span class="closet-title" data-toggle="tooltip" data-placement="bottom" title="Click to Edit or Delete"><?php echo $name; ?></span>&nbsp;<span class="badge itemCount" data-toggle="tooltip" data-placement="bottom" title="# of items in this Clositt"><?php echo $itemsCount; ?></span>
                            
                                <?php if($unsaved){ ?>
                                    <button class="unsavedCloset btn btn-clositt-theme">SAVE ENTIRE CLOSET</button>
                                <?php } ?>                                   
                                
                                <?php if (!isset($_GET['user']) && !$unsaved){ ?>
                                    <span class="mobile-toggle <?php echo $priceAlertsClass; ?>" data-toggle="tooltip" data-placement="bottom" title="<?php echo $priceAlertsTooltip; ?>"><span class="mobile-toggle-btn">$</span></span>            
                                <?php } ?>                             
                            
                                <?php if (($_SESSION['active'] || isset($_GET['user'])) && !$unsaved){ ?>                                                                            
                                
                                    <a class="socialbtn" site="facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $closittPageLinkEncoded; ?>">
                                        <i class="icon-svg9"></i>
                                    </a>
                                    <a class="socialbtn" site="twitter" target="_blank" href="https://twitter.com/share?url=<?php echo $closittPageLinkEncoded; ?>">
                                        <i class="icon-svg7"></i>
                                    </a>
                                    <a class="socialbtn" site="google" target="_blank" href="https://plus.google.com/share?url=<?php echo $closittPageLinkEncoded; ?>">
                                        <i class="icon-svg10"></i>
                                    </a>
                                    <a class="socialbtn" site="pinterest" target="_blank" href="http://pinterest.com/pin/create/button/?url=<?php echo $closittPageLinkEncoded; ?>&media=<?php echo $closittPageImgLink; ?>&description=<?php echo $closittPageDescription; ?>">
                                        <i class="icon-svg11"></i>
                                    </a>
                                    <a class="socialbtn email-product" site="email" href="#" data-url="<?php echo $closittPageLink; ?>">
                                        <i class="icomoon-envelop"></i>
                                    </a>
                                <?php } ?>
                                
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
