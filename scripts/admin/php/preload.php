<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
?>
</head>
<body>

<script src="../../js/firebaseExtension.js"></script>
<script src="../js/storeSetup.js"></script>
<script type="text/javascript">
firebase.init();
storeSetup.setup();
</script>


</body>
</html>