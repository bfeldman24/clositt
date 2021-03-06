<?php
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/PriceAlertsDao.php');
require_once(dirname(__FILE__) . '/../Database/Dao/UserDao.php');
require_once(dirname(__FILE__) . '/../email.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/ListController.php');

class PriceAlertsController extends Debugger {	
	private $priceAlertsDao = null;
	private $userDao = null;

	public function __construct(){
		$this->priceAlertsDao = new PriceAlertsDao();
		$this->userDao = new UserDao();
	}
					     					
	public function sendAllPriceAlerts($html = true){
	    	   
	    date_default_timezone_set('UTC');	   	    
        $getWeeklyAlerts = date('w') == 1; // Monday
        $getMonthlyAlerts = date('d') == 1; // first day of the month        
	    	
	    // Get Daily Price Alerts	   
	    $this->getPriceAlerts('daily');
	    
	    // Get weekly alerts
	    if ($getWeeklyAlerts){
	       $this->getPriceAlerts('weekly');   
	    }
	    
	    // Get monthly alerts
	    if ($getMonthlyAlerts){
	       $this->getPriceAlerts('monthly');   
	    }
	}
	
	private function getPriceAlerts($frequency){
	   	   
	   $results = $this->getProductsWithPriceAlerts($frequency);
	    
	    print_r($results);
	    
	    if (isset($results)){
	       $sentToUsers = array();
	       
	       foreach ($results as $user => $items) {	   
	           if(ENV == "PROD" || $user == 2){	               	    	                  	   
	               $htmlAlerts = $this->getAlertsInHtml($items, $user);	    
	               $userData = $this->getUserInfo($user);           
                   $alertTemplate = $this->getAlertTemplate($userData['n'], $htmlAlerts, $frequency);                    
                   
                   $success = EmailController::sendHtmlEmail($userData['e'], 'PriceAlerts@Clositt.com', 'Clositt Price Alerts', $alertTemplate);          
                   $sentToUsers[$userData['e']] = $success;
	           }
	       }  
	       
	       // Log users sent
	       print_r($sentToUsers);
	       
	       if (count($sentToUsers) > 0){
    	       $userList = json_encode($sentToUsers, true);
    	       ListController::writeToFile($frequency."-PriceAlertsLog", $userList);
	       }
	    }  
	}
	
	private function getUserInfo($user){ 
	    $userEntity = array();
	   
        $userResult = $this->userDao->getUserInfo($user);        
        
        if(is_object($userResult)){
			if($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$userEntity = UserEntity::setFromDB($row);								
			}			
	   }
	   	   
	   return $userEntity->toArray();  
	}
	
	private function getProductsWithPriceAlerts($frequency){
	   $results = array();	   	   	   	   	   	   
	   
	   $closetItemResults = $this->priceAlertsDao->getProductsWithPriceAlerts($frequency);    	   
	   
	   if(is_object($closetItemResults)){						
			while($row = $closetItemResults->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				$userid = $row['userid'];
				$closetName = $row['closetname'];
				$sku = $row['sku'];				
				
				if (!isset($results[$userid])){
				    $results[$userid] = array();        
				}
				
				// If the item already exists in the closet, 
				// Then get set the new price
				if (isset($results[$userid][$sku]) && !in_array($closetName, $results[$userid][$sku]['closetName'])){				    
				    $results[$userid][$sku]['newprice'] = $row['newprice'];
				    $results[$userid][$sku]['date'] = $row['date'];        
				    $results[$userid][$sku]['closetName'][] = $closetName;
				}else{
				    $results[$userid][$sku] = $row;   
				    $results[$userid][$sku]['closetName'] = array($closetName);
				}								
			}					
	   }	 	   	   	   
	   	   
	   return $results;   	   
	}			
	
	private function getAlertsInHtml($items, $user){
	   ob_start();   
	       	       	       	   
        // Closet Items                 
        foreach ($items as $sku => $item) {
            echo PriceAlertsController::getProductTemplate($item, $user);
        }                            
        
        return ob_get_clean();
	}
	
	
	private static function getProductTemplate($product, $user){        
	    if (!is_array($product)){      	
	       return null;
	    }	    	    							
		    
	    // Closet Page
	    $isClosetPage = true;
		$sku = $product['sku'];
        $store = isset($product['store']) ? $product['store'] : '';
        $name = isset($product['name']) ? ucwords(strtolower($product['name'])) : '';        
        $image = $product['image'];
        $shortLink = isset($product['shortlink']) ? $product['shortlink'] : ''; 
        $price = isset($product['price']) ? $product['price'] : '';
        $oldprice = isset($product['oldprice']) ? $product['oldprice'] : '';
        $newprice = isset($product['newprice']) ? $product['newprice'] : '';
        $dateString = isset($product['date']) ? $product['date'] : ''; 
        $closetPlural = isset($product['closetName']) && count($product['closetName']) > 1 ? 's' : '';        
        $closetName = '';
        
        if (isset($product['closetName'])){
            if (count($product['closetName']) == 2){
                $closetName = $product['closetName'][0] . " and " . $product['closetName'][1];
            }else{
                $closetName = implode(", ", $product['closetName']);
            }   
        }
		
		$time = strtotime($dateString);
		$formattedDate = date('n/j/Y', $time);
		
		$price = !isset($price) || !is_numeric($price) ? '' : "$" . $price;
		$oldprice = !isset($oldprice) || !is_numeric($oldprice) ? '' : "$" . $oldprice;
		$newprice = !isset($newprice) || !is_numeric($newprice) ? '' : "$" . $newprice;
        		
        $home = 'http://www.clositt.com/'; 
        $productPageLink = $home . "!/" . $shortLink;		
        		
		ob_start();
		?>		
		
		
		<div style="padding: 20px; border: 1px solid #C2C2C2; background: #FFFFFF; margin-bottom:20px; margin-left: auto; margin-right: auto; max-width: 550px;">
            <a href="<?php echo $productPageLink; ?>?pricealerts" style="text-decoration:none;">
                <div style="float:left; width: 225px; max-height: 270px; height: 270px;">
                    <img style="width: auto; max-height: 270px;" src="<?php echo $image ?>" alt="Image is not displaying" />
                </div>
                <div style="float:left; padding: 0 0 0 20px;">
                    <h2 style="color:#7E7E7E; font-weight:bold; font-size: 24px; margin: 10px 0; line-height: 28px; width: 300px;"><?php echo $name ?></h2>
                    <h4 style="color:#7E7E7E; font-weight:normal; font-size: 18px;font-family: sans-serif; text-transform: uppercase; margin-bottom: 10px; margin-top: 0;"><?php echo $store ?></h4>                    
                    
                    <div style="display:inline; margin-top: 10px;">
                        <span style="color:#7E7E7E; font-weight:normal; font-size: 20px;font-family: sans-serif;">Price: </span>
                        <span style="font-weight:lighter;font-size:20px;color:#01A611"><?php echo $newprice ?></span>
                    </div>
                    <br>
                    <div style="display:inline;">
                        <span style="color:#7E7E7E; font-weight:normal; font-size: 18px;font-family: sans-serif;">Was: </span>
                        <span style="font-weight:lighter;font-size:18px;color:#FF7D6E;text-decoration: line-through;"><?php echo $oldprice ?></span>
                    </div>
                    <div>                        
                        <h4 style="color:#BEBEBE; font-weight: lighter;margin: 10px 0 5px;">Date: <?php echo $formattedDate; ?></h4>
                    </div>
                    <div style="display:inline;color:#AEAEAE;font-size: 12px; ">
                        <span style="font-weight: lighter;">Sent from your <strong><?php echo $closetName; ?></strong> clositt<?php echo $closetPlural; ?></span>
                    </div>
                </div>
                 <div style="clear:both;"></div>
                <img style="float: right; width: 20%; margin-top: -15px" src="http://www.clositt.com/css/images/logo.png" alt="Clositt.com"/>
                <img alt="" src="http://www.clositt.com/track/pricealerts/<?php echo $user;?>" width="1" height="1" border="0" />            
                <div style="clear:both;"></div>
            </a>
        </div>
				
        <?php	
                
        return ob_get_clean();
    }
    
    
    private static function getAlertTemplate($name, $html, $alertFrequency){
        $hey = '';
        if (isset($name)){
            $nickname = explode(' ', $name)[0];   
            $hey = "Hey " . $nickname . "! ";
        }
           
        ob_start();
        
        ?>
        
        <!DOCTYPE HTML>
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <title><?php echo $hey; ?>Some stuff in your Clositt just got cheaper!</title>
        </head>
        <body style="background: #F5F5F5;font-family: sans-serif, 'Open Sans';padding:20px;">
            <h1 style="color:#7E7E7E; font-weight:lighter; font-size: 32px;text-align: center;"><?php echo $hey; ?>Some stuff in your Clositt just got cheaper!</h1>
            
            <div>                
                <?php echo $html; ?>            
                
                <br><br>
                <a href="http://www.clositt.com/myclositt?pricealerts" style="background-color: #66ccff; color: #fff; -moz-user-select: none; background-image: none;border: 1px solid transparent;border-radius: 4px;cursor: pointer;display: block;font-size: 24px;font-weight: 700;line-height: 1.42857;margin-bottom: 0;padding: 6px 12px;text-align: center;vertical-align: middle;white-space: nowrap;margin-left: auto;margin-right: auto;width: 200px;text-decoration:none;">See it on Clositt</a>        
                
                <br><br>
                <div style="text-align: center;color:#AEAEAE;font-size: 12px; ">
                    <span style="font-weight: lighter;">You are receiving this email because you chose to receive a <?php echo $alertFrequency; ?> digest email of any products in your clositt that went down in price. If you'd like to change how frequently you receive these emails, go to <a href="http://www.clositt.com/myclositt?pricealerts" style="color:#AEAEAE; text-decoration:underline;">www.clositt.com/myclositt</a> and adjust your price alerts.</span>
                </div>
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