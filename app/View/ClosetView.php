<?php

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
            $closittPageImgLink = rawurlencode($items[0]['cache']);
            $closittPageDescription = rawurlencode($name . " - Clositt.com");
            
            // Closet header            
            ?>            
            <div class="panel panel-default closetPanel" id="<?php echo $closetRef; ?>" number="<?php echo $items[0]['id']; ?>" original="<?php echo $items[0]['title']; ?>">
                        <div class="panel-heading">
                            <h4 class="panel-title"><span class="closet-title" data-toggle="tooltip" data-placement="bottom" title="Edit or Delete"><?php echo $name; ?></span>&nbsp;<span class="badge"><?php echo $itemsCount; ?></span>
                                <a class="icon-svg6 suffle-btn"></a>                               
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
                if (!isset($item) || !isset($item['item']) || !isset($item['cache'])){
                    continue;   
                }
                
                // Get the product page links        
                $home = 'http://www.clositt.com/'; // DELETE THIS AND JUST ADD HOME_PAGE
                $productPageLink = rawurlencode($home . "!/" . $item['reference']['sl']);
                $productPageImgLink = rawurlencode($item['cache']);
                $productPageDescription = rawurlencode("Found on Clositt.com");
                
                ?>                                           
                                            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-box box outfit" pid="<?php echo $item['item']; ?>">
                                                <div class="item">
                                                    <div class="mainwrap">
                                                        <div class="imagewrap">
                                                            <img src="<?php echo $item['cache']; ?>">
                                                        </div>
                                                        <div class="detail">
                                                            <h4><?php echo $item['reference']['n']; ?></h4>
                                                            <div>
                                                                <span class="price pull-right"><?php echo $item['reference']['p']; ?></span>
                                                            <p class="pull-left"><?php echo $item['reference']['o']; ?></p>
                                                            </div>
                                                            <div class="clear"></div>
                                                            
                                                        </div>
                                                        <div class="cart_option">
                                                            <a class="removeProductBtn"><i class="icon-svg4 remove-prod"></i></a>
                                                            <a><i class="icomoon-bubble-dots-4 message-icon"><span class="badge">&nbsp;</span></i></a> 
                                                            <a class="more-opt"><i class="icomoon-share-2 dots-icon"></i></a>
                                                        </div>
                                                    </div>
                                                    <div class="hover_more">
                                                        <a style="margin-left: 12%;" class="socialbtn" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $productPageLink; ?>">
                                                            <i class="icon-svg17"></i>
                                                        </a>
                                                        <a class="socialbtn" target="_blank" href="https://twitter.com/share?url=<?php echo $productPageLink; ?>">
                                                            <i class="icon-svg16"></i>
                                                        </a>
                                                        <a class="socialbtn" target="_blank" href="https://plus.google.com/share?url=<?php echo $productPageLink; ?>">
                                                            <i class="icon-svg14"></i>
                                                        </a>
                                                        <a class="socialbtn" target="_blank" href="http://pinterest.com/pin/create/button/?url=<?php echo $productPageLink; ?>&media=<?php echo $productPageImgLink; ?>&description=<?php echo $productPageDescription; ?>">
                                                            <i class="icon-svg18"></i>
                                                        </a>
                                                        <a class="socialbtn email-product" target="_blank" href="#" data-url="<?php echo $productPageLink; ?>">
                                                            <i class="icomoon-envelop"></i>
                                                        </a>                                                        
                                                    </div>
                                                </div>
                                            </div>
                <?php
            }
            
            // Container closing tags
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
