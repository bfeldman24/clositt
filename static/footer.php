<footer class="clositt-theme">
	<div id="footer-wrapper">
		<div class="center footer-item">Clositt Inc &copy; 2014</div>
		<div class="footer-item"><a href="<?php echo HOME_ROOT; ?>contact-us.php">Contact Us</a></div>
		<div class="footer-item hidden-xs"><a href="<?php echo HOME_ROOT; ?>terms-of-service.php">Terms</a></div>
		<div class="footer-item hidden-xs"><a href="<?php echo HOME_ROOT; ?>shout-outs.php">Shout Outs</a></div>
		<div class="footer-item"><a href="http://blog.clositt.com">Blog</a></div>
		
		<?php if ($_SERVER['PHP_SELF'] == "<?php echo HOME_ROOT; ?>index.php" || $_SERVER['PHP_SELF'] == "<?php echo HOME_ROOT; ?>clositt.php"){ ?>
    		<div class="last footer-item"><a class="joyride-start" href="#">Tour</a></div>						
		<?php } ?>
		
		<?php
		if((isset($_GET['ben']) && $_GET['ben'] != "") || (isset($_GET['eli']) && $_GET['eli'] != "")){
		?>
		<div class="last footer-item"><a href="<?php echo HOME_ROOT; ?>scripts/admin/php/productSpider.php" style="margin: 0 5px;">Upload</a></div>
		<?php } ?>						
	</div>
	
	<div class="feedback hidden-xs">
	   <div class="feedback-maximize">
    	   <div class="feedback-popup">
        	  <textarea class="feedback-textarea" rows="3" placeholder="What can we do better?"></textarea>
    	  </div>
    	  <div class="arrow-down"></div>
    	  <button class="feedback-submit-btn btn btn-xs" type="button">Submit</button>
    	  <div class="feedbackMinimize"><div class="minimize">-</div></div>
	  </div>
	  <div class="feedback-minimized" style="display:none;">
	      <button class="feedback-minimized-btn btn btn-success btn-xs" type="button">Feedback</button> 
	  </div>
	</div>
</footer>


<!-- Modal -->
<div id="signinModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 id="myModalLabel">Log in or Sign up</h3>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#loginModalTab" data-toggle="tab">Log in</a></li>
                    <li><a href="#signupModalTab" data-toggle="tab">Sign Up</a></li>
                </ul>
              	
              	<div class="tab-content">
              	    <div id="loginModalTab" class="tab-pane active">
                		<form id="signin" class="form-horizontal" action="clositt.php">
                			<h3 class="account">Got an Account? Log in.</h3>
                			<div class="row">
                    			<div id="signinModalEmail" class="col-xs-12 col-sm-6 col-sm-offset-3">            			                         			  
                    			    <input type="text" id="loginModalTab-inputEmail" placeholder="Email" class="form-control inputBox" />
                    			</div>
                			</div>
                			<div class="row">
                    			<div id="password" class="col-xs-12 col-sm-6 col-sm-offset-3">	
                    				<input type="password" id="loginModalTab-inputPassword" placeholder="Password" class="form-control inputBox" />		
                    			</div>		   	
                			</div>	
                			<div>	        			    
                			    <div class="forgotpass">Forgot Password?</div>
                			</div>
                		</form> 
                	</div> 	
                
                	<div id="signupModalTab" class="tab-pane">
                		<form id="signup-form" class="form-horizontal" action="clositt.php">
                			<h3 class="account">New to Clositt? Sign up.</h3>
                			<div class="row">
                    			<div id="signinModalName" class="col-xs-12 col-sm-6 col-sm-offset-3" >
                    			   <input type="text" id="signupModalTab-inputName" placeholder="Full Name" class="form-control inputBox" />
                    			</div>
                    	    </div>
                    	    <div class="row">
                    			<div id="signup-email" class="col-xs-12 col-sm-6 col-sm-offset-3">
                    			   <input type="text" id="signupModalTab-inputEmail" placeholder="Email" class="form-control inputBox" />
                    			</div>
                			</div>
                    	    <div class="row">                			
                    			<div id="signinModalPassword" class="col-xs-12">	
                                    <div class="row">
                        			    <div class="col-xs-12 col-sm-3 col-sm-offset-3">                            
                                            <input type="password" id="signupModalTab-inputPassword" placeholder="Password" class="form-control">                                
                                        </div>
                                        <div class="col-xs-12 col-sm-3">
                                            <input type="password" id="signupModalTab-inputPassword2" placeholder="Confirm" class="form-control">
                                        </div>
                                    </div>
                    			</div>		   	
                			</div>	        			
                		</form> 
                	</div>
              	</div>
            </div>
            <div class="modal-footer">
                <button type="submit" id="signupModalLoginButton" class="btn btn-success">Login</button>
            </div>      	
        </div>          	
    </div>    
</div>	

<!-- Forgot Password Modal -->
<div id="forgotPassModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 id="myModalLabel">Forgot Password</h3>
            </div>
            <div class="modal-body">
                <p>Please enter your email address so we can send you an email to reset your password:</p>
                <input type="text" id="forgotPasswordEmail" placeholder="Email" class="inputBox form-control" />        
            </div>
            <div class="modal-footer">
                <button id="resetPassButton" class="btn btn-success">Reset My Password</button>
            </div>
        </div>            
    </div>            
</div>	


<!-- Product Popup -->
<div id="productModal" class="modal fade item"> 
    <div class="modal-dialog"> 
        <div class="modal-content">             
            <button type="button" class="productPageClose" data-dismiss="modal" aria-hidden="true">&times;</button>             
            <div class="modal-body"> 
            <div class="row"> 
                <div class="col-xs-12 col-sm-4"> 
                    <div class="productPageImage picture"> 
    			        <a class="productPagePicture" target="_blank" > 
    			            <img onerror="return pagePresenter.handleImageNotFound(this)" /> 
    			        </a> 
    				</div> 
                </div> 
                <div class="col-xs-12 col-sm-8">                             
                        
                    <div class="productPageContent"> 
                        <div class="row"> 
                            <div class="col-xs-12 col-sm-6"> 
                				<div class="productPageDesc">             				    				
                				    <div class="productPageName"></div>                 				
                    				<div class="productPagePrice"></div>
                    				<div class="historicalPrices"> 
                    				    <span class="sparkChartTitle"></span>                			
                    				    <span class="sparkChart" sparkType="line" sparkWidth="100px" sparkHighlightLineColor="#CCC" sparkSpotRadius="3" sparkTooltipPrefix="$" sparkTooltipClassname="sparkTooltip jqstooltip"></span>	
                    				</div>
                    				<div class="productPageStore"></div> 
                				</div> 
            				</div> 
            				
            				<div class="col-xs-12 col-sm-6"> 
                				<div class="productPageActions">             				    				
                				    <a class="productPageBuyLink" target="_blank"> 
                				        <div class="productPageBuy"> 
                				            <img src="<?php echo HOME_ROOT; ?>css/images/cart-empty.png" /> 
                				                <span>SHOP IT</span> 
                				                <br> 
                				                <span class="productPageBuySiteName"></span> 
                    				    </div> 
                    				</a> 
                    				
                    				<div class="productPageClositt"> 
                    				    <img class="productPageHanger" src="<?php echo HOME_ROOT; ?>css/images/hanger-icon.png" /> 
                    				    <span>CLOSITT</span> 
                    				    <div class="addToClosetForm" style="display:none;"></div> 
                    				</div> 
                    				
                    				<div class="productPageTagitt"> 
                    				    <img src="<?php echo HOME_ROOT; ?>css/images/price-tag.png" /> 
                    				    <span>TAGITT</span>	
                    				    <div class="addTagForm" style="display:none;"></div> 
                    				</div> 
                				</div> 
                			</div>
            			</div> 
            		</div>                 			
        			                        
                </div> 
            </div> 
            <div class="productPageBottom"> 
                <div class="row"> 
                    <div class="col-xs-6 col-sm-offset-4">                                             				
        				<div class="productPageComments">Talkitt 
        				    <span class="productPageCommentCount"></span>         				    
        				</div>                 				                				
    				</div> 
    				<div class="col-xs-4 col-xs-offset-1 col-sm-2 col-sm-offset-1"> 
                        <div class="productPageClosittCount"> 
                            <img class="productPageHanger" src="<?php echo HOME_ROOT; ?>css/images/hanger-icon.png" />  
            				<span class="counter"></span> 				
            			</div> 
                    </div> 
                </div>
                <div class="row">
                    <div class="product-comments" style="display:none"></div>
                </div>
            </div> 
            
            </div>                   
        </div><!-- /.modal-content --> 
    </div><!-- /.modal-dialog --> 
</div><!-- /.modal -->  









<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
    var sessionInit = {            
        <?php if (isset($_SESSION['active']) && $_SESSION['active'] === true){ ?>            
            active: true,
            userid: <?php echo $_SESSION["userid"]; ?>, 
            email: '<?php echo $_SESSION["email"]; ?>',
            name: '<?php echo $_SESSION["name"]; ?>',
        <?php }else{ ?>
            active: false
        <?php } ?>                                    
    };
</script>
<script type="text/javascript">
$(document).ready(function() {
    firebase.init();
    session.init();
    Messenger.init();       
    footer.init();
});
</script>

<?php if( defined(DEBUG) && DEBUG){ ?>
<script type="text/javascript">
  var vglnk = { api_url: '//api.viglink.com/api',
                key: 'ace9fa11ba4e122d7318924968832a6d' };

  (function(d, t) {
    var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
    s.src = ('https:' == document.location.protocol ? vglnk.api_url :
             '//cdn.viglink.com/api') + '/vglnk.js';
    var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
  }(document, 'script'));
</script>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-39518320-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
<?php } ?>