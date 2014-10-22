<?php

$searchValue = '';
if (isset($_GET['outfit'])){
    $searchValue = 'value="' .$_GET['outfit'] . '"';       
}

?>

<header id="header">
    <div class="header-container">
        <nav class="navbar navbar-default" role="navigation">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span class="sr-only">Toggle navigation</span> 
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="<?php echo HOME_PAGE; ?>"><img src="<?php echo HOME_ROOT; ?>css/images/logo.png"></a>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <div class="col-sm-1 col-md-2 browse clearfix">                                                                    
                    </div>
                    <form id="search-form" class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input id="search-bar" type="text" class="form-control input-search" placeholder="Stop searching, Start finding. Start Here" <?php echo $searchValue; ?> />
                        </div>
                        <button type="submit" id="seach-bar-icon" class="btn btn-default search-btn icon-svg2"></button>
                    </form>
                    <ul id="loginBtns" class="nav navbar-nav navbar-right">                        
                    </ul>
                </div>
            </div>
        </nav>
        <div class="clear"></div>
    </div>
</header>