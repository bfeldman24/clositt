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

if (isset($_GET['pricealerts']) && !isset($_SESSION['clickedPriceAlertsForMyClositt'])){
    require_once(dirname(__FILE__) . '/../app/Controller/StatsController.php');
    StatsController::add("Clicked Price Alerts Email", "myclositt");
    $_SESSION['clickedPriceAlertsForMyClositt'] = true;
}

?>
<!DOCTYPE HTML>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>
<link rel="stylesheet" href="<?php echo HOME_ROOT; ?>lib/css/shepherd-theme-arrows.css" />
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
            
                <h4 class="text-center" id="user-closet-title"><?php echo $nickname; ?> Clositts</h4>
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


    
    
    
    
    
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/shepherd.min.js"></script>

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

pagePresenter.defaultHeaderHeight = 0;

function loggedIn(){
    <?php if (isset($isUnsavedSesssion) && $isUnsavedSesssion === true){ ?>
        location.href = location.href;   
    <?php }else{ ?>
        ShepherdTour.init();
    <?php } ?>    
    
    closetPresenter.setPriceAlerts();    
}



var ShepherdTour = {    
    init: function() {
        $(document).on("click",".startTour", ShepherdTour.setupShepherd);
        
        if (document.cookie == null || document.cookie.indexOf("closittTour=") < 0){
            document.cookie="closittTour=true; expires=Thu, 31 Dec 9999 12:00:00 UTC";
            ShepherdTour.setupShepherd();
        }else{
            gridPresenter.enableLazyLoading = true;   
        }
    },
    
    setupShepherd: function() {
        var shepherd;    
        
        var outfit = $(".outfit").eq(2);
        outfit.addClass("sheperd-outfit");
        outfit.find(".addToClosittDropdown").addClass("sheperd-outfit-clositt-btn");
        $("#loginBtns li").first().addClass("sheperd-myclositts-btn");        
        
        shepherd = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-theme-arrows',
                showCancelLink: false,
                scrollTo: false
            }
        });
        
        shepherd.addStep('welcome', {
            title: 'Welcome to Your Clositt!',
            text: ['Let us show you around.'],
            classes: 'shepherd-theme-arrows',            
            buttons: [
                {
                    text: 'Skip Tour',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.cancel
                }, {
                    text: 'Let\'s go',
                    action: shepherd.next,
                    classes: 'btn-clositt-theme'
                }
            ]
        });                
        
        shepherd.addStep('start', {
            title: 'Your Clositts',
            text: ['This is where all of your Clositts are. Click on a button to go directly to that Clositt'],
            attachTo: '.closetName left',
            classes: 'shepherd-theme-arrows',            
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: function(){                    
                        pagePresenter.scrollTo($(".mobile-toggle").offset().top - 200); 
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });                                    
        
        shepherd.addStep('foundone', {
            title: 'Price Alerts!',
            text: 'Want to know when stuff in your Clositt gets cheaper? Flip this switch to enable price alerts, and we\'ll automatically send you an email if the price goes down. Now that\'s smart shopping! Give it a try. ',
            attachTo: '.mobile-toggle right',
            classes: ' shepherd-theme-arrows',
            scrollTo: false,
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: function(){
                        pagePresenter.scrollTo(0);
                        shepherd.back();   
                    }
                }, {
                    text: 'Next',
                    action: function(){                     
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });    
        
        shepherd.addStep('showfilters', {
            title: 'Edit Clositt',
            text: 'You can edit or delete your Clositt by clicking here. But why would you ever want to do that?',
            attachTo: '.closet-title right',
            classes: ' shepherd-theme-arrows',
            scrollTo: false,
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: function(){
                        shepherd.back();   
                    }
                }, {
                    text: 'Next',
                    action: function(){  
                        pagePresenter.scrollTo(0);                                           
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });                            
        
        shepherd.addStep('yourclositts', {
          title: 'Account settings',
          text: 'You can change your password and change how often you receive Price Alert emails by clicking on your account right here.',
          attachTo: '.user-settings bottom',
          classes: ' shepherd-theme-arrows',
          scrollTo: false,
          buttons: [
            {
                text: 'Back',
                classes: 'shepherd-button-secondary',
                action: function(){
                    pagePresenter.scrollTo($(".closet-title").offset().top - 200); 
                    shepherd.back();   
                }
            }, {
                text: 'Done',
                action: shepherd.next,
                classes: 'btn-clositt-theme'
            }
          ]
        });
        
        Shepherd.once('complete', function(){
            gridPresenter.enableLazyLoading = true;    
        });
        
        Shepherd.once('cancel', function(){
            gridPresenter.enableLazyLoading = true;    
        });
        
        shepherd.start();
    }
}

</script>

</body>
</html>
