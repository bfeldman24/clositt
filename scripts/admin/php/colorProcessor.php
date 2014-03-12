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
</style>
</head>
<body>

<!--<script src="../../js/firebaseExtension.js" type="text/javascript"></script>-->
<script src="../../js/messenger.js" type="text/javascript"></script>
<script src="../js/colorProcessor.js" type="text/javascript"></script>


<script type="text/javascript">
//firebase.init();
Messenger.init();

<?php if ($_GET['manual'] == "y"){ ?>
    $("body").append($("<input>").attr("type","text").addClass("fileEnding").css("height","30px"));
    $("body").append($("<button>").addClass("btn btn-large btn-primary getColors").text("Save Processed Images").attr("type","button"));
    
    colorProcessorSaveToFirebase.firebase = new Firebase('https://clothies.firebaseio.com'); 	 
	$(document).on("click",".getColors", colorProcessorSaveToFirebase.getColorsFromSavedFile);    
<?php }else{ ?>
    colorProcessor.init();
<?php } ?>

</script>

</body>
</html>