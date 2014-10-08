<?php
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/PriceAlertsDao.php');
require_once(dirname(__FILE__) . '/../Database/Dao/UserDao.php');
require_once(dirname(__FILE__) . '/../email.php');
require_once(dirname(__FILE__) . '/Debugger.php');

class PriceAlertsController extends Debugger {	
	private $priceAlertsDao = null;
	private $userDao = null;

	public function __construct(){
		$this->priceAlertsDao = new PriceAlertsDao();
		$this->userDao = new UserDao();
	}
					     					
	public function sendAllPriceAlerts($html = true){
	    	   
	    $results = $this->getPriceAlerts();
	    
	    print_r($results);
	    
	    if (isset($results)){
	       foreach ($results as $user => $closets) {	       	       	   
	           if ($user == 2){
	               $htmlAlerts = $this->getAlertsInHtml($closets);
	               $userData = $this->getUserInfo($user);
                   $alertTemplate = $this->getAlertTemplate($userData['n'], $htmlAlerts);
                    
                   //print_r($alertTemplate);
                    
                   EmailController::sendHtmlEmail($userData['e'], 'Clositt Price Updates', $alertTemplate);          
	           }
	       }  
	    }	            
	}
	
	public function getUserInfo($user){ 
	    $userEntity = array();
	   
        $userResult = $this->userDao->getUserInfo($user);        
        
        if(is_object($userResult)){
			if($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$userEntity = UserEntity::setFromDB($row);								
			}			
	   }
	   	   
	   return $userEntity->toArray();  
	}
	
	public function getPriceAlerts(){
	   $results = array();	   	   	   	   	   	   
	   
	   $closetItemResults = $this->priceAlertsDao->getPriceAlerts();    	   
	   
	   if(is_object($closetItemResults)){						
			while($row = $closetItemResults->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				$userid = $row['userid'];
				$closetName = $row['closetname'];				
				
				if (!isset($results[$userid])){
				    $results[$userid] = array();        
				}
				
				if (!isset($results[$userid][$closetName])){
				    $results[$userid][$closetName] = array();        
				}
				
				$results[$userid][$closetName][] = $row;				
			}					
	   }	 	   	   	   
	   	   
	   return $results;   	   
	}			
	
	public function getAlertsInHtml($closets){
	   ob_start();   
	   
	   foreach ($closets as $name => $items) {	       	       	   
    	   ?> 
        	   <section style="clear: both;">
                    <div>             
                        <div>
                            <div>
                                <h4 style="color: #adadad; font-size: 26px; font-weight: 400;"><span><?php echo $name; ?></span>
                                </h4>
                            </div>                                                    
                            <section class="items">
                                <div>
                                    <div>
                                    
                                        <?php               
                                            // Closet Items                 
                                            foreach ($items as $item) {
                                                echo PriceAlertsController::getProductTemplate($item, false);
                                            }            
                                        ?>               
                                                                                                                                                                
                                    </div>
                                </div>
                            </section>                                                    
                        </div> 
                    </div>
                </section>  
            <?php
	    }
        
        return ob_get_clean();
	}
	
	
	public static function getProductTemplate($product){        
	    if (!is_array($product)){      	
	       return null;
	    }	    	    							
		    
	    // Closet Page
	    $isClosetPage = true;
		$sku = $product['sku'];
        $store = isset($product['store']) ? $product['store'] : '';
        $name = isset($product['name']) ? $product['name'] : '';
        $image = $product['image'];
        $shortLink = isset($product['shortlink']) ? $product['shortlink'] : ''; 
        $price = isset($product['price']) ? $product['price'] : '';
        $oldprice = isset($product['oldprice']) ? $product['oldprice'] : '';
        $newprice = isset($product['newprice']) ? $product['newprice'] : '';
        $dateString = isset($product['date']) ? $product['date'] : '';
		
		$time = strtotime($dateString);
		$formattedDate = date('n/j/Y', $time);
		
		$price = !isset($price) || !is_numeric($price) ? '' : "$" . round($price);
		$oldprice = !isset($oldprice) || !is_numeric($oldprice) ? '' : "$" . round($oldprice);
		$newprice = !isset($newprice) || !is_numeric($newprice) ? '' : "$" . round($newprice);
        		
        $home = 'http://www.clositt.com/'; 
        $productPageLink = $home . "!/" . $shortLink;		
        		
		ob_start();
		?>		
		
		<div class="outfit" style="max-width: 300px; min-height: 374px; max-height: 500px; padding-bottom: 10px; padding-left: 7px; padding-right: 7px; min-width: 250px; float: left;">
            <div style="background: none repeat scroll 0 0 #fff;border: 1px solid #d0d0d0;border-radius: 8px;margin: 0 auto;max-width: 225px;position: relative;">
                <a style="background: none repeat scroll 0 0 #fff;border-radius: 8px;position: relative;text-decoration: none;" href="<?php echo $productPageLink; ?>">
                    <div style="border-radius: 8px 8px 0 0;cursor: pointer;height: 175px;overflow: hidden;position: relative;text-align: center;width: 100%;">                        
                            <img src="<?php echo $image ?>" style="height: 100%;max-width: 100%;"/>
                    </div>
                    <div style="padding: 6px 8px 5px;">
                        <h4 style="color: #424242;display: block;font-family: Sintony,sans-serif;font-size: 13px;font-weight: 400;line-height: 18px;margin-bottom: 4px;"><?php echo $name ?></h4>
                        <div>
                            <p style="color: #adadad;font-family: 'Open Sans',sans-serif;font-size: 13px;line-height: normal;margin-bottom: 10px;margin-top: 0;text-align: right;"><?php echo $store ?></p>                            
                            <span style="clear:both;color: #42bb42;font-family: 'Doppio One';font-size: 20px;font-weight: bold;margin-right: 4px;">Price changed from <?php echo $oldprice ?></span>
                            <span style="color: #42bb42;font-family: 'Doppio One';font-size: 20px;font-weight: bold;margin-right: 4px;"> to <?php echo $newprice ?></span>
                            <span style="color: #8d8d8d;font-family: 'Doppio One';font-size: 14px;margin-right: 4px;">on <?php echo $formattedDate; ?></span>
                        </div>
                        <div style="clear: both;margin-top: 10px;"></div>                        
                    </div>                                                            
                </a>                
            </div>
        </div>

        <?php	
                
        return ob_get_clean();
    }
    
    
    public static function getAlertTemplate($name, $html){
        if (isset($name)){
            $nickname = explode(' ', $name)[0] . "'s";   
        }else{
            $nickname = "My";   
        }
           
        ob_start();
        
        ?>
           <!DOCTYPE HTML>
           <html>
           <head>                                     
           </head>
               <body style="font-family: 'Open Sans',​sans-serif">
               
               <div>
                  <div style="width: 100%; margin: 0 0 10px 0; padding-left: 5px; border-top: 5px solid #66ccff; max-height: 70px;"><img src="http://clositt.com/css/images/logo.png" /></div>
               
                   <h4 style="color: #adadad; font-size: 60px; font-weight: 400; padding: 0; margin: 0; text-align: center;"><?php echo $nickname; ?> Clositt Price Updates</h4>    
                   
                   <?php echo $html; ?>
               </div>
                                       
               </body>
           </html>
        
        <?php     
        
        return ob_get_clean();
    }				
}

$alerts = new PriceAlertsController();
$alerts->sendAllPriceAlerts();

?>