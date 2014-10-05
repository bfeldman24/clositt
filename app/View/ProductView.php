<?php

class ProductView {	
    
    public static function getProductGridTemplate($product, $lazyLoadImages = true, $columnSizeOverride = null){        
	    if (!is_object($product) && !is_array($product)){      	
	       return null;
	    }	    	    				
		
		if (method_exists($product,'getId')){
		    
		    // Product Entity
		    $isClosetPage = false;
    		$sku = $product->getId();
            $store = $product->getStore();
            $name = $product->getName();
            $image = $product->getImage();
            $shortLink = $product->getShortLink(); 
            $price = $product->getPrice();
    		
//    		$reviewCount = $product->getCommentCount();
//    		$reviewCount = isset($reviewCount) ? $reviewCount : 0;		
//    		
//    		$closetCount = $product->getClosittCount();
//    		$closetCount = isset($closetCount) ? $closetCount : 0;				    		
//    		$closetCountPlural = $closetCount == 1 ? "" : "s";     		    		
		
		}else if (isset($product['item']) && isset($product['cache']) && isset($product['reference'])){
		    
		    // Closet Page
		    $isClosetPage = true;
    		$sku = $product['item'];
            $store = isset($product['reference']['o']) ? $product['reference']['o'] : '';
            $name = isset($product['reference']['n']) ? $product['reference']['n'] : '';
            $image = $product['cache'];
            $shortLink = isset($product['reference']['sl']) ? $product['reference']['sl'] : ''; 
            $price = isset($product['reference']['p']) ? $product['reference']['p'] : '';

		}else{
		    return null; 
		}
		
		$price = !isset($price) || !is_numeric($price) ? '' : "$" . round($price);

        if (isset($columnSizeOverride)){
            $columnSizes = $columnSizeOverride;   
        }else{
            $columnSizes = "col-xs-12 col-sm-4 col-md-3 col-lg-box";   
        }
        
        // Get the product page links        
        $home = 'http://www.clositt.com/'; // DELETE THIS AND JUST ADD HOME_PAGE
        $productPageLink = rawurlencode($home . "!/" . $shortLink);
        $productPageImgLink = rawurlencode($image);
        $productPageDescription = rawurlencode("Found on Clositt.com");
		
		ob_start();
		?>		
		
		<div class="<?php echo $columnSizes; ?> box outfit" pid="<?php echo $sku ?>">
            <div class="item" data-url="<?php echo $shortLink ?>">
                <div class="mainwrap">
                    <div class="imagewrap">
                        <?php if ($lazyLoadImages){ ?>
                        <img class="loadingImage" src="<?php echo HOME_ROOT; ?>css/images/loading.gif"/>
                        <img style="display:none;" data-src="<?php echo $image ?>" onerror="return productPresenter.handleImageNotFound(this)" />
                        <?php }else{ ?>
                            <img src="<?php echo $image ?>" onerror="return productPresenter.handleImageNotFound(this)" />
                        <?php } ?>
                    </div>
                    <div class="detail">
                        <h4><?php echo $name ?></h4>
                        <div>
                            <span class="price pull-right"><?php echo $price ?></span>
                            <p class="pull-left"><?php echo $store ?></p>
                        </div>
                        <div class="clear"></div>                        
                    </div>
                    
                    <div class="cart_option">
                        <?php if ($isClosetPage){ ?>
                            <a class="removeProductBtn"><i class="icon-svg4 remove-prod"></i></a>
                        <?php }else{ ?>
                            <div class="addToClosittDropdown"> 
                                <a class="dropdown-toggle" data-toggle="dropdown"><i class="icon-svg20"></i></a>
                                
                                <div class="dropdown-menu create_new" role="menu">
                                    <input class="pull-left addNewClosetInput" type="text" placeholder="Create New Clositt" />
                                    <a class="create pull-right submitNewCloset"><i class="icon-plus"></i></a>
                                    <div class="clear"></div>
                                    
                                    <div class="my_opt addToClosetOptions"></div>                            
                                </div>
                            </div>
                        <?php } ?>
    
                        <div class="commentDropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown">
                                <i class="icomoon-bubble-dots-4 message-icon"></i>
                            </a>
                            
                            <div class="dropdown-menu comments" role="menu">
                                <textarea class="commentTextArea" type="text" placeholder="#LoveIt..." ></textarea>                                
                                <div class="addCommentBtn"><button class="btn btn-clositt-theme btn-xs">ADD</button></div>
                                <div class="clear"></div>
                                                                
                                <ul class="review-comments"></ul>                                
                            </div>
                        </div>
                         
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
                    <a class="socialbtn email-product" target="_blank" href="#" data-url="<?php echo $shortLink; ?>">
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
