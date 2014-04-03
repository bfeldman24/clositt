<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">            
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-main">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <button type="button" class="toggle-filter-nav navbar-toggle hidden">
                <span class="sr-only">Toggle filter</span>
                <span class="glyphicon glyphicon-filter"></span>
            </button>
            <a class="navbar-brand brand" id="brand" href="<?php echo HOME_ROOT;?>">Clositt <span class="logo-beta">beta</span></a>
        </div>
    
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-collapse-main">
            <ul class="nav navbar-nav">
                <li><a href="<?php echo HOME_ROOT;?>" ><i class="browse-small-icon"></i>Browse</a></li>
                <li><a href="<?php echo HOME_ROOT;?>clositt.php" id="subheader-myclositt"><i class="myclositt-small-icon"></i>MyClositt</a></li>                    
            </ul>                 
            <ul id="loginBtns" class="nav navbar-nav navbar-right">
                <!--
                <li><a class="btn btn-default" onclick="showSigninModal()">LOGIN</a></li>
                <li><a class="btn btn-default inverse" href="<?php echo HOME_ROOT;?>signup.php" >SIGNUP</a></li>
                -->
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>		