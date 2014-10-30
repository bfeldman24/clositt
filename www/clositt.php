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

if(isset($_GET['user'])){
    require_once(dirname(__FILE__) . '/../app/Controller/UserController.php'); 
    $userController = new UserController();
    $userid = $_GET['user'];
    $name = $userController->getUserName($userid, false);    
    
    if(isset($_GET['closittname'])){
        $isFound = false;
        
        foreach ($closets as $closetName => $items) {
            $selector = preg_replace('/\s+/', '', $closetName);
            
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
    
}else{
    $name = $_SESSION['name']; 
    $userid = $_SESSION['userid']; 
}

$nickname = explode(' ', $name)[0];

if (!isset($nickname) || $nickname == ""){
    $nickname = "My";
}else{
    $nickname .= "'s";   
}   

?>
<!DOCTYPE HTML>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
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

<!-- Joyride Content -->
<ol id="joyRideTipContent">
    <li data-class="closetNameHeader" data-text="Next" class="custom">
        <h2>Your Clositt </h2>
        <p>Welcome to YOUR Clositt! This is where you keep stuff you like. We've already created a Clositt for you to get you started. Feel free to create as many Clositts as you'd like.</p>
    </li>
    <li data-class="carousel-left" data-button="Next" data-options="tipLocation:right;">
        <h2>Scrolling</h2>
        <p>Click on the arrows to scroll through your Clositt.</p>
    </li>
    <li data-class="social-people-icon" data-button="Next" data-options="tipLocation:left;">
        <h2>Share</h2>
        <p>Share your Clositt with anyone by clicking here.</p>
    </li>    
    <li data-id="closet-settings" data-button="Next" data-options="tipLocation:left;">
        <h2>Edit</h2>
        <p>You can delete items from your Clositt, or change your Clositt names by clicking here.</p>
    </li>    
    <li data-id="subheader-trending" data-button="Finish" >
        <h2>Let me Shop!</h2>
        <p>You can get back to shopping by clicking here.</p>
    </li>    
</ol>


<script type="text/javascript">

<?php if(isset($_GET['user'])){ ?>
    $(document).ready(function(){
        pagePresenter.enableLazyLoading = false;     
        closetPresenter.setUser(<?php echo $_GET['user']; ?>);
        pagePresenter.init();    
        closetPresenter.init();        	
        productPagePresenter.init();	
        productPresenter.init();	
        reviewsPresenter.init();
        tagPresenter.init();
        socialPresenter.init();	
     });
<?php }else{ ?>
    function userDataReady(user){    
        pagePresenter.enableLazyLoading = false;
        pagePresenter.init();    
        closetPresenter.init();             
        productPresenter.init();	
        productPagePresenter.init();
        reviewsPresenter.init();       
        tagPresenter.init();
        socialPresenter.init();
    }        
<?php } ?>

function loggedOut(){
	location.href = window.HOME_URL;
}

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

</script>

</body>
</html>
