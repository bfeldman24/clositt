<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
</head>
<body>


<!--<script src="http://www.bprowd.com/lib/javascript/jquery-1.7.2.min.js"></script>-->
<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="/lib/javascript/jquery-ui-1.10.1.custom/js/jquery-ui-1.10.1.custom.min.js"></script>
<script src="/lib/javascript/bootstrap.min.js"></script>

<script src='https://cdn.firebase.com/v0/firebase.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/v0/firebase-auth-client.js'></script>
-->

<script src="../js/firebaseExtension.js"></script>
<script src="../js/storeSetup.js"></script>
<script type="text/javascript">
firebase.init();
storeSetup.setup();
</script>


</body>
</html>