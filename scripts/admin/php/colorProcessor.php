<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');

?>

<style type="text/css">
.spinner{
    height:15px;
    margin-top:-3px;   
}

.btn{
    margin: 5px;   
}


.colorMapping{
    margin: 5px;    
    height: 40px
}

.colorMapping-color, .colorMapping-color a{
    color: #000000;
    text-shadow: 1px 1px 0 #CCCCCC;   
    padding: 10px 85px;     
}

.colorMapping-parent{
    padding: 10px;
    position: relative;
    top: 2px;     
}

.colorMapping-approval{
    margin: 0 10px !important;   
}

.hexaInput {
    height: 35px;
    margin: 0 2px;
    padding: 2px;
    width: 100%;
}

td {
    vertical-align: middle !important;   
}

</style>
</head>
<body>

<script src="../../js/messenger.js" type="text/javascript"></script>
<script src="../../js/colorPresenter.js" type="text/javascript"></script>
<script src="../js/colorProcessor.js" type="text/javascript"></script>


<script type="text/javascript">
Messenger.init();
colorProcessor.init();
colorMappingProcessor.init();
</script>

</body>
</html>