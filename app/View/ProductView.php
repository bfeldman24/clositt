<?php

class ProductView {	
    
    public static function getProductGridTemplate($product){        
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

		$rand = rand(1,3);
		$shadow = "";
		if($rand == 1){
			$shadow = 'shadow';	
		}		
		
		?>
		
		<div class="col-xs-12 col-sm-4 col-md-3 col-lg-box box">
            <div class="outfit item" pid="<?= $product->getId() ?>">
                <div class="mainwrap">
                    <div class="imagewrap">
                        <img src="<?php echo $product->getImage() ?>" onerror="return pagePresenter.handleImageNotFound(this)" />
                    </div>
                    <div class="detail">
                        <h4><?php echo $product->getName() ?></h4>
                        <span class="price"><?php echo $price ?> </span><!--<del>$50</del>-->
                        <p><?php echo $product->getStore() ?></p>
                    </div>
                    <div class="cart_option">
                        <a href="ClosittProductDetail.html">
                            <i class="icon-svg20"></i>
                        </a>
                        <a href="#">
                            <i class="icomoon-bubble-dots-4 message-icon">
                                <span class="badge">&nbsp;</span>
                            </i>
                        </a> 
                        <a class="more-opt" href="#">
                            <i class="icon-svg3 dots-icon"></i>
                        </a>
                    </div>
                </div>
                <div class="hover_more"><a href="#"><i class="icon-svg15"></i></a><a href="#"><i class="icon-svg14"></i></a><a href="#"><i class="icon-svg16"></i></a><a href="#"><i class="icon-svg17"></i></a><a href="#"><i class="icon-svg18"></i></a></div>
            </div>
        </div>


		 <!--			 		
		<div class="outfit item" pid="<?= $product->getId() ?>">
			<div class="picture">
			     <a class="productPage" target="_blank" orig-href="<?= $product->getLink() ?>">
			         <img src="<?= $product->getImage() ?>" class="<?= $shadow ?>" onerror="return pagePresenter.handleImageNotFound(this)"/>
			     </a>
			</div>			
			<div class="overlay">
				<div class="topleft">										
					<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt">
					   <i class="icon-tags icon-white"></i>
					</div>						 
				</div>
				<div class="addTagForm" style="display:none;"></div>
				<div class="topright">										
					<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt">
					   <img class="hanger-icon" src="css/images/hanger-icon-white.png" />
					   <i class="icon-plus-sign icon-white hanger-plus"></i>
					</div>
				</div>
				<div class="bottom">						    					    
				    <div class="productActions" >					    
				       <span data-toggle="tooltip" data-placement="top" title="Add to Wish List" class="addToWishList">
				            <i class="icon-gift icon-white"></i>
				       </span>
				       <span data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments numReviews">
				            <span class="counter" ><?= $reviewCount ?></span>
				            <i class="icon-comment icon-white"></i>
				       </span>
				       <span data-toggle="tooltip" data-placement="top" title="Added to '+closetCount+' Clositt'+closetCountPlural+'" class="numClosets">
				            <span class="counter"><?= $closetCount ?></span>
				            <i class="icon-hanger-white"></i>
				       </span>
				    </div>														    					    
				    					
					<div class="companyName"><?= $product->getStore() ?></div>
					<div class="price"><?= $price ?></div>
					<div class="name"><?= $product->getName() ?></div>
				</div>
				<div class="product-comments"></div>
				<div class="addToClosetForm" style="display:none;"></div>
			</div>
			<div class="clear"></div>				
		</div>	
		-->
			
		<?php		         
    }

}
?>
