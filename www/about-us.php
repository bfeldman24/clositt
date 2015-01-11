<?php 
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../app/session.php'); ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <?php include(dirname(__FILE__) . '/static/meta.php'); ?>

    <style type="text/css">
        body, div, section, a, span, p, h1, h2 {
            font-family: "Open Sans", sans-serif !important;               
            color: #FFF;
        }        
        
        body, div, section, a, span, p{
             font-size: 25px;   
        }
        
        h1, h2{
            font-weight: bold;  
            margin: 0; 
        }
        
        h1 {
            font-size: 55px;  
        }
        
        h2 {
            font-size: 40px;  
        }
        
        h2, p, img {
            margin-bottom: 20px;   
        }
    
        #landing-header{
            position: absolute;
            right: 20px;
            top: 10px;   
        }
        
        .btn {
            font-weight: bold;
            color: #FFF;   
            text-decoration:none !important;
            padding-bottom: 4px;
        }
        
        .btn:hover, .btn:active {
            color: #EFEFEF;   
        }
        
        .signup {
            background-color: #66CCFF;
            margin-right: 10px
        }
        
        .login {
            background-color: #00C984;         
        }
        
        .start{
            background-color: #0080ff;
            box-shadow: 3px 3px 13px #000;
            font-size: 20px;
            margin: 157px auto 0;
            padding: 10px 0 5px;
            text-align: center;
            width: 200px;                     
        }
        
        section {
            width: 100%;
            height: 100%;
            min-height: 300px;  
            margin: 0 !important; 
        }                
        
        #first-section {
            background: url('css/images/landing/laptop.jpg') no-repeat scroll center center / cover  rgba(0, 0, 0, 0);   
            min-height: 520px;
        }
        
        #first-section h1{            
            padding-top: 75px;
            text-align: center;
        }
        
        #second-section {
            background-color: #00C984; 
            padding: 50px 20px;  
        }
        
        #third-section {
            background-color: #54E5F5;   
            padding: 50px 20px;
        }
        
        #fourth-section {
            background-color: #6666FF;
            padding: 50px 20px;   
        }                
        
        .text-middle{
            display:inline-block; 
            vertical-align:middle 
        }
        
        #fifth-section{
            background: url('css/images/landing/bike-panoramic.jpg') no-repeat scroll center center / cover  rgba(0, 0, 0, 0);   
            min-height: 520px;   
        }
        
        #fifth-section h1{
            text-align: center; 
            padding-top: 75px;  
        }
        
        #fifth-section .center-block{            
            margin-top: 250px;
            width: 500px;
        }
        
        #fifth-section a{
            margin-left: 20px;               
        }
        
        #fifth-section a:hover, #fifth-section a:active {
            text-decoration: none;
            color: #54E5F5;  
        }                                 
        
        @media (max-width: 767px) {
            h2, p, a, div {
                text-align:center   
            }
        }
    </style>
</head>
<body>
<div id="landing-wrapper">
    <div id="landing-header">
        <a class="btn signup" href="<?php echo HOME_PAGE; ?>signup">SIGNUP</a>
        <a class="btn login" href="<?php echo HOME_PAGE; ?>login">LOGIN</a>
    </div>
    
    <section id="first-section">        
            <h1>FIND & DISCOVER CLOTHES</h1>
            <a class="btn start center-block" href="<?php echo HOME_PAGE; ?>">GET STARTED</a>
    </section>
    
    <section id="second-section">
        <div class="text-middle row">
            <div class="col-xs-10 col-xs-offset-1 visible-xs">
                <img src="css/images/landing/shopping_bag.png" />
            </div>
            <div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1">
                <h2>All Your Favorite Brands at Your Fingertips</h2>
                <p>Close all those browser tabs you have open for every store. We'll help you browse hundreds of brands at once, so you can find the perfect outfit.</p>
            </div>
            <div class="col-sm-3 col-sm-offset-1 hidden-xs">
                <img src="css/images/landing/shopping_bag.png" />
            </div>
        </div>
    </section>
    
    <section id="third-section">
        <div class="text-middle row">
            <div class="col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-1">
                <img src="css/images/landing/template.png" />
            </div>
            <div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1">
                <h2>Create a Clositt to Save Stuff for Later</h2>
                <p>No more sending emails full of links. Simply add an item to your Clositt and we'll save it for you. You can share you Clositt with friends, and we'll even let you know if stuff in your Clositt gets cheaper!</p>
            </div>        
        </div>        
    </section>
    
    <section id="fourth-section">
        <div class="text-middle row">
            <div class="col-xs-10 col-xs-offset-1 visible-xs">
                <img src="css/images/landing/chat.png" />
            </div>
            <div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1">
                <h2>- COMING SOON -</h2>
                <p>Pretty soon you'll be able to follow the brands and friends so you can find the latest trends.</p>
            </div>        
            <div class="col-sm-3 col-sm-offset-1 hidden-xs">
                <img src="css/images/landing/chat.png" />
            </div>            
        </div>
    </section>    
    
    <section id="fifth-section">
        <h1>FIND & DISCOVER CLOTHES</h1>
        <div class="center-block">
            <a href="<?php echo HOME_PAGE; ?>faq">FAQ</a>
            <a href="<?php echo HOME_PAGE; ?>">GET STARTED</a>
            <a href="<?php echo HOME_PAGE; ?>contact-us">CONTACT US</a>
        </div>
    </section>
</div>

<?php include(dirname(__FILE__) . '/static/footerMeta.php');   ?>
</body>
</html>