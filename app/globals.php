<?php 
define('DOMAIN','clothies.bprowd.com');
define('HOME_ROOT','/');
$GLOBALS['ADMIN_LIST'] = array(2, 35, 94);

// DEV
define('CLOSITT_CSS',HOME_ROOT .'css/style.css');

$js = '<script src="' . HOME_ROOT .'scripts/js/firebaseExtension.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/messenger.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/pagePresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/productPagePresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/gridPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/gridEvents.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/productPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/filterPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/tagPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/socialPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/searchController.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/reviewsPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/closetPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/js/colorPresenter.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/admin/js/firebaseReorganizing.js"></script>' .
'<script src="' . HOME_ROOT .'scripts/admin/js/lib/bootbox.min.js"></script>' .
'<script src="' . HOME_ROOT .'lib/js/jquery.unveil.min.js"></script>';

define('CLOSITT_JS',$js);

// PROD
/* 
- copy clositt.min.js to http://www.minifyjs.com/javascript-compressor/
- check: special chars, fast decode, and normal.
- use output as clositt.min.e.js
- change below to point to new file
*/
//define('CLOSITT_JS','<script src="' . HOME_ROOT .'scripts/js/clositt.min.js"></script>');
//define('CLOSITT_CSS',HOME_ROOT .'css/style.min.css');




// ALL
define('QUERY_LIMIT',50);

// TODO set pages as global vars
//define('META_PAGE', 'static/meta.php');
//define('WHOOPS_PAGE', 'whoops.php');
?>