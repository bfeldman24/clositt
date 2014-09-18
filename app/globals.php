<?php 
define('DOMAIN','dev.closetta.com');
define('HOME_ROOT','/design/');
define('HOME_PAGE','http://' . DOMAIN . HOME_ROOT);
define('COOKIE_NAME','CookieClosittYum');
$GLOBALS['ADMIN_LIST'] = array(2, 35, 94);

// DEV
define('DEBUG', true);
define('CLOSITT_CSS',HOME_ROOT .'css/style.css');

$js = '<script src="' . HOME_ROOT .'js/session.js"></script>' .
'<script src="' . HOME_ROOT .'js/messenger.js"></script>' .
'<script src="' . HOME_ROOT .'js/pagePresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/productPagePresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/gridPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/gridEvents.js"></script>' .
'<script src="' . HOME_ROOT .'js/productPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/filterPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/footer.js"></script>' .
'<script src="' . HOME_ROOT .'js/tagPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/socialPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/searchController.js"></script>' .
'<script src="' . HOME_ROOT .'js/reviewsPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/closetPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'js/colorPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'admin/js/firebaseReorganizing.js"></script>' .
'<script src="' . HOME_ROOT .'admin/js/lib/bootbox.min.js"></script>' .
'<script src="' . HOME_ROOT .'lib/js/jquery.unveil.min.js"></script>'.
'<script src="' . HOME_ROOT .'lib/js/jquery.sparkline_2.1.2.min.js"></script>';

define('CLOSITT_JS',$js);

// PROD
/* 
- copy clositt.min.js to http://www.minifyjs.com/javascript-compressor/
- check: special chars, fast decode, and normal.
- use output as clositt.min.e.js
- change below to point to new file
*/

/*
define('CLOSITT_CSS',HOME_ROOT .'css/style.min.css');

$js = '<script src="' . HOME_ROOT .'js/clositt.min.js"></script>' .
'<script src="' . HOME_ROOT .'lib/js/jquery.unveil.min.js"></script>'.
'<script src="' . HOME_ROOT .'lib/js/jquery.sparkline_2.1.2.min.js"></script>;

define('CLOSITT_JS',$js);
*/


// ALL
define('QUERY_LIMIT',50);

// PAGES
define('CLOSITT_PAGE', 'clositt');
define('CONTACT_PAGE', 'contact-us');
define('PRODUCT_PAGE', 'product-page');
define('SETTINGS_PAGE', 'settings');
define('SHOUT_OUTS_PAGE', 'shout-outs');
define('TERMS_PAGE', 'terms-of-service');
define('WHOOPS_PAGE', 'whoops.php');
?>
