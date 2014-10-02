<?php

class ProductView {	
    
    public static function getProductGridTemplate($product, $lazyLoadImages = true, $columnSizeOverride = null){        
	    if (!is_object($product)){      	
	       return null;
	    }	    	    				
		
		$reviewCount = $product->getCommentCount();
		$reviewCount = isset($reviewCount) ? $reviewCount : 0;		
		
		$closetCount = $product->getClosittCount();
		$closetCount = isset($closetCount) ? $closetCount : 0;				
		
		$closetCountPlural = $closetCount == 1 ? "" : "s"; 
		
		$price = $product->getPrice();
		$price = !isset($price) || !is_numeric($price) ? "" : "$" . round($price);		 						

        if (isset($columnSizeOverride)){
            $columnSizes = $columnSizeOverride;   
        }else{
            $columnSizes = "col-xs-12 col-sm-4 col-md-3 col-lg-box";   
        }
        
        // Get the product page links        
        $home = 'http://www.clositt.com/'; // DELETE THIS AND JUST ADD HOME_PAGE
        $productPageLink = rawurlencode($home . "!/" . $product->getShortLink());
        $productPageImgLink = rawurlencode($product->getImage());
        $productPageDescription = rawurlencode("Found on Clositt.com");
		
		ob_start();
		?>		
		
		<div class="<?php echo $columnSizes; ?> box outfit" pid="<?php echo $product->getId() ?>">
            <div class="item" data-url="<?php echo $product->getShortLink() ?>">
                <div class="mainwrap">
                    <div class="imagewrap">
                        <?php if ($lazyLoadImages){ ?>
                        <img class="loadingImage" src="<?php echo HOME_ROOT; ?>css/images/loading.gif"/>
                        <img style="display:none;" data-src="<?php echo $product->getImage() ?>" onerror="return productPresenter.handleImageNotFound(this)" />
                        <?php }else{ ?>
                            <img src="<?php echo $product->getImage() ?>" onerror="return productPresenter.handleImageNotFound(this)" />
                        <?php } ?>
                    </div>
                    <div class="detail">
                        <h4><?php echo $product->getName() ?></h4>
                        <div>
                            <span class="price pull-right"><?php echo $price ?></span>
                            <p class="pull-left"><?php echo $product->getStore() ?></p>
                        </div>
                        <div class="clear"></div>                        
                    </div>
                    
                    <div class="cart_option"> 
                        <a class="dropdown-toggle addToClosittDropdown" data-toggle="dropdown"><i class="icon-svg20"></i></a>
                        
                        <div class="dropdown-menu create_new" role="menu">
                            <input class="pull-left addNewClosetInput" type="text" placeholder="Create New Clositt" />
                            <a class="create pull-right submitNewCloset"><i class="icon-plus"></i></a>
                            <div class="clear"></div>
                            
                            <div class="my_opt addToClosetOptions"></div>                            
                        </div>
    
                        <a>
                            <i class="icomoon-bubble-dots-4 message-icon">
                                <span class="badge">&nbsp;</span>
                            </i>
                        </a> 
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
                    <a class="socialbtn email-product" target="_blank" href="#" data-url="<?php echo $product->sl; ?>">
                        <i class="icomoon-envelop"></i>
                    </a>                                                 
                </div>
            </div>
        </div>								
		
    <?php	
                
        $html = ob_get_clean();
        return preg_replace('/^\s+|\n|\r|\s+$/m', '', $html);
    }

}
?>
