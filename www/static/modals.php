<div class="modal fade" id="loginSignupModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog2">
        <div class="modal-content2">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>                
                
            <!-- Nav tabs -->   
            <section id="login_box">
                <div class="login_sign_btn"> 
                    <ul class="nav nav-tabs">
                        <li class="active"><a href="#loginModalTab" id="loginModalTabBtn" data-toggle="tab">Login</a></li>
                        <li><a href="#signupModalTab" id="signupModalTabBtn"  data-toggle="tab">Sign Up</a></li>
                    </ul>
                </div>
                <!-- Tab panes -->  
                <div class="tab-content">  
                    <div class="tab-pane active" id="loginModalTab">                
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="login">
                                        <h1>Login</h1>
                                                                                
                                        <div id="signin">
                                            <input id="loginModalTab-inputEmail" type="text" placeholder="Email Address" />
                                            <input id="loginModalTab-inputPassword" type="password" placeholder="Password" />
                                            <div class="sub">
                                                <p class="pull-left"><a class="forgotpass">Forgot password?</a></p>
                                                <input id="loginModalSubmit" class="pull-right" type="submit" value="Login Now" />
                                                <div class="clear"></div>
                                            </div>
                                            <div class="border"></div>
                                            
                                            <div class="register">
                                                <p><a href="#" class="showSignupTab">Create a Clositt Account</a></p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>                    
                    </div>
                    
                    <div class="tab-pane" id="signupModalTab">                
                        <div class="container">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="login">
                                        <h1>Sign Up</h1>
                                        <p class="log">Create an account to get your own Clositt</p>
                                
                                        <div>
                                            <input id="signupModalTab-inputName" type="text" placeholder="Full Name" />
                                            <input id="signupModalTab-inputEmail" type="email" placeholder="Email Address" />
                                            <input id="signupModalTab-inputPassword" type="password" placeholder="Password" />
                                            <div class="sub">
                                                <p class="pull-left"><a href="#" class="showLoginTab">Already have an Account?</a> </p>
                                                <input id="signupModalSubmit"  class="pull-right" type="submit" value="Sign Up" />
                                                <div class="clear"></div>
                                            </div>
                                            <div class="space"></div>                                                                                
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>                    
                    </div>                    
                </div>                   
                
            </section>
        </div>
    </div>
</div>



<div class="modal fade" id="shareProductModal" tabindex="-1" role="dialog" aria-labelledby="shareProductModalLabel" aria-hidden="true">
    <div class="modal-dialog2">
        <div class="modal-content2">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>                
                
            <!-- Nav tabs -->                              
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <h1>Share via Email</h1>
                                                                                
                        <div class="form-horizontal" role="form">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <p class="log">Enter an email address to share your find</p>
                                </div>
                                <div class="col-xs-12">       
                                    <input type="text" id="shareEmail" placeholder="Email Address" class="input-xlarge form-control" />                     
                                </div>
                                <div class="col-xs-12">       
                                    <input type="text" id="shareEmailFromName" placeholder="Your Name" class="input-xlarge form-control" />                     
                                </div>
                                <div class="col-xs-12">       
                                    <textarea rows="3" id="shareEmailMessage" class="form-control" placeholder="Message..."></textarea>
                                    <p class="log" id="shareEmailFixedMessage">
                                        <q><span id="emailOutfitText">Check out this outfit from</span>
                                        <span id="emailOutfitStore"></span>: 
                                        <a id="emailOutfitLink" target="_blank"></a></q>
                                    </p>
                                </div>
                            </div>                                                                                                                                                                          
                            <div class="form-group">
                    		      <button type="submit" class="btn btn-clositt-theme center-block" id="share">Share</button>                      
                            </div>  
                        </div> 
                    </div>
                </div>
            </div>                                                         
                            
        </div>
    </div>
</div>

<!-- Forgot Password Modal -->
<div id="forgotPassModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog2">
        <div class="modal-content2">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>                
                
            <!-- Nav tabs -->                             
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <h1>Forgot Password?</h1>
                                                                                
                        <div class="form-horizontal" role="form">
                                <div class="form-group">
                                <div class="col-xs-12">
                                    <p class="log">Please enter your email address so we can send you an email to reset your password:</p>
                                </div>
                                <div class="col-xs-12">       
                                    <input type="text" id="forgotPasswordEmail" placeholder="Email Address" class="input-xlarge form-control" />                     
                                </div>
                                </div>                                                                                                                             
                                <div class="form-group">
                                <div>
                    		      <button id="resetPassButton" class="btn btn-clositt-theme center-block">Reset My Password</button>                               </div>
                                </div>  
                        </div>
                    </div>
                </div>
            </div>                                                          
                            
        </div>
    </div>            
</div>	

<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>
        </div>
    </div>
</div>

<div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog2">
        <div class="modal-content modal-content2">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>
        </div>
    </div>
</div>

<div class="modal fade" id="feedbackModal" tabindex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true">
    <div class="modal-dialog2">
        <div class="modal-content2">
            <button type="button" class="close modal_close" data-dismiss="modal">
                <span class="icon-times close-modal" aria-hidden="true"></span>
            </button>                
            
            <div class="container">                
                <div class="row">
                    <div class="col-xs-12">
                        <h1>Feedback</h1>
                                                                                
                        <div class="form-horizontal" role="form">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <p class="log">Lay it on us. We can handle it.</p>
                                </div>
                                <div class="col-xs-12">       
                                    <textarea id="feedbackMessage" placeholder="What can we do better?" class="input-xlarge form-control" rows="3"></textarea>                     
                                </div> 
                            </div>                                                                                                                                                                                                              
                            <div class="form-group">
            		              <button type="submit" class="btn btn-clositt-theme center-block" id="feedbackSubmit">Submit</button>                      
                            </div>  
                        </div>
                    </div>                                     
                </div>                 
            </div>   
                            
        </div>
    </div>
</div>