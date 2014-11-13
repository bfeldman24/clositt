<?php 
require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/ClosetController.php');
require_once(dirname(__FILE__) . '/../app/View/ClosetView.php');

$closetController = new ClosetController();              

$owner = null;
if(isset($_GET['user'])){
    $owner = array();
    $owner['owner'] = $_GET['user'];
}

$closets = $closetController->getAllClosetItems($owner);
$isUnsavedSesssion = false;

$hasItemsInCloset = false;
foreach ($closets as $closetName => $items) {       
    foreach ($items as $item) {
        if (isset($item['item'])){
               $hasItemsInCloset = true;
               break;
        }
    }
    
    if ($hasItemsInCloset){
        break;   
    }
}

if(isset($_GET['user'])){
    require_once(dirname(__FILE__) . '/../app/Controller/UserController.php'); 
    $userController = new UserController();
    $userid = $_GET['user'];
    $name = $userController->getUserName($userid, false);    
    
    if(isset($_GET['closittname'])){
        $isFound = false;
        
        foreach ($closets as $closetName => $items) {
            $selector = preg_replace('/[\s\W]+/', '', $closetName);
            
            if ($selector == $_GET['closittname']){
                $closets = array($closetName => $items);
                $isFound = true;
                break;   
            }
        }
        
        if (!$isFound){
            $closets = array();       
        }
    }
    
}else if ($_SESSION['active']){
    $name = $_SESSION['name']; 
    $userid = $_SESSION['userid']; 
    $sessionClosets = $closetController->getAllSessionClosetItems();
}else{
    $userid = $_SESSION['userid']; 
    $isUnsavedSesssion = true;   
}

if (isset($name)){
    $nickname = explode(' ', $name)[0];
}

if (!isset($nickname) || $nickname == ""){
    $nickname = "My";
}else{
    $nickname .= "'s";   
}   

if (isset($_GET['pricealerts'])){
    require_once(dirname(__FILE__) . '/../app/Controller/StatsController.php');
    StatsController::add("Clicked Price Alerts Email", "myclositt");
}

?>
<!DOCTYPE HTML>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>
<style type="text/css">
.clositt-inner{
    min-height: 300px;   
}
</style>		

</head>
<body>
<div class="wrapper">
    <?php include(dirname(__FILE__) . '/static/header.php');   ?>
    
    <section class="my-clositt">
        <div id="nav">
            <div class="container">
            
                <h4 class="text-center" id="user-closet-title"><?php echo $nickname; ?> Clositt</h4>
                <!--
                <div class="col-xs-2 col-xs-offset-5">
                    <a class="icon-svg6 suffle-btn"></a>
                    <a class="icon-svg9"></a>
                    <a class="icon-svg7"></a>
                    <a class="icon-svg10"></a>
                    <a class="icon-svg11"></a>
                </div>
                -->                
                
                <?php if ($isUnsavedSesssion){ ?>
                    <?php if ($hasItemsInCloset){ ?>
                       <p class="log bg-warning">These clositts will be lost once you close your browser. Please <a class="showSignupTab" data-toggle="modal" data-target="#loginSignupModal">sign up</a> or <a class="showLoginTab" data-toggle="modal" data-target="#loginSignupModal">login</a> to save them.</p>                
                    <?php }else{ ?>
                        <p class="log alert-info">You have nothing in your clositt! Go back to find products that you love and organize them in your clositt below.</p>
                    <?php } ?>
                <br/><br/>
                <?php } ?>
                
                <div class="col-sm-offset-1 col-md-offset-2">
                    <div class="nav">
                        <ul id="closetNameList">                            
                            <?php if(!isset($_GET['closittname'])){ ?>	
                                <?php echo ClosetView::getClosetNames($closets); ?>
                                
                                <?php if(!isset($_GET['user'])){ ?>	
                                <li class="addnew">
                                    <div class="btn-group disabled">
                                        <button type="button" class="btn btn-default nav-filter"  data-toggle="modal" data-target="#addclositt" >ADD NEW  + </button>
                                    </div>
                                </li>
                                <?php } ?>
                            <?php } ?>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
                                  
    <?php if($_SESSION['active'] && isset($sessionClosets) && is_array($sessionClosets) && count($sessionClosets) > 0){ ?>               
        <section class="clositt-inner unsaved-clositt-inner bg-warning">
            <h4 id="user-unsaved-closet-title" class="text-center">Unsaved Clositts</h4>
            <p class="log">These clositts will be lost if not saved once you close your browser</p>
            <div class="panel-group">
                <?php echo ClosetView::getClosets($sessionClosets, $userid, true); ?>                       
            </div>
        </section>
    <?php } ?>        

    <section class="clositt-inner">
        <div class="panel-group">             
            <?php echo ClosetView::getClosets($closets, $userid); ?>       
        </div>
    </section>
    
    <?php include(dirname(__FILE__) . '/static/footer.php');   ?>
</div>

<?php include(dirname(__FILE__) . '/static/footerMeta.php');   ?>
    
    
    
    
<!-- MODALS -->
<div class="modal fade" id="addclositt" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close modal_close2" data-dismiss="modal">
            <span aria-hidden="true" class="icon-times"></span>
            <span class="sr-only">Close</span>
        </button>
        <h4 class="modal-title">Add New Clositt</h4>
      </div>
      <div class="modal-body">
        <input type="text" class="form-control" placeholder="New Clositt Name..." id="newClosetName" />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="submit" id="saveNewClosetName" class="btn btn-clositt-theme">Add Clositt</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="editClosittModal" tabindex="-1" role="dialog" aria-labelledby="editClosittModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close modal_close2" data-dismiss="modal">
            <span aria-hidden="true" class="icon-times"></span>
            <span class="sr-only">Close</span>
        </button>
        <h4 class="modal-title">Edit Clositt</h4>
      </div>
      <div class="modal-body">
        <input type="text" class="form-control" id="editClosetName" />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="submit" id="saveEditNewClosetName" class="btn btn-clositt-theme">Save</button>
        <button type="button" id="confirmRemoveClosetBtn" class="btn btn-danger">Remove Clositt</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="confirmRemoveClosittModal" tabindex="-1" role="dialog" aria-labelledby="confirmRemoveClosittModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close modal_close2" data-dismiss="modal">
            <span aria-hidden="true" class="icon-times"></span>
            <span class="sr-only">Close</span>
        </button>
        <h4 class="modal-title">Remove Clositt</h4>
      </div>
      <div class="modal-body">
        <p class="log">Are you sure that you want to remove <span id="removeClosetName">that clositt</span> and all of its outfits?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">NO</button>
        <button type="button" id="removeClosetBtn" class="btn btn-clositt-theme">YES</button>
      </div>
    </div>
  </div>
</div>


    
    
    
    
    
<script src="<?php echo HOME_ROOT; ?>lib/js/jquery.joyride-2.1.js"></script>

<div id="closetId" style="display:none;"><?php if (isset($_GET['user'])){ echo $_GET['user']; };?></div>

<script type="text/javascript">


$(document).ready(function(){        
    <?php if(isset($_GET['user'])){ ?>
        closetPresenter.setUser(<?php echo $_GET['user']; ?>);        
    <?php } ?>        

    pagePresenter.enableLazyLoading = false;     
    pagePresenter.init();    
    closetPresenter.init();        	
    productPagePresenter.init();	
    productPresenter.init();	
    reviewsPresenter.init();
    tagPresenter.init();
    socialPresenter.init();	        
});   

function startClosittTour(manual){
    if(manual || session.loginCount <= 3){
        
        if (localStorage.myClositt == undefined || localStorage.myClositt == null){
            localStorage.myClositt = 1;   
        }        
        
        if (localStorage.myClositt < 5){
        	$('#joyRideTipContent').joyride({
                autoStart : true,                  
                modal:true,
                expose: false,
                preStepCallback : function (index, tip) {
                  if (index == 0) {
                    $(tip).find(".joyride-close-tip").text("Skip Tour");
                  }
                }
            });
        }
    			
    	localStorage.myClositt++;
    }
}

$(".joyride-start").click(function(e){
    startClosittTour(true);
});    

pagePresenter.defaultHeaderHeight = 0;

function loggedIn(){
    <?php if (isset($isUnsavedSesssion) && $isUnsavedSesssion === true){ ?>
        location.href = location.href;   
    <?php } ?>
    
    closetPresenter.setPriceAlerts();
}

</script>

</body>
</html>
