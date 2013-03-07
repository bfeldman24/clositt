<?php 
if(isset($_REQUEST['u']) && $_REQUEST['u'] != ""){
	$file = file_get_contents($_REQUEST['u']);
	
	if(strpos($file, "<body") > 0 && false){
		$file = trim(substr($file,strpos($file,"<body")));
		$file = str_replace('"/',substr($_REQUEST['u'],0,strpos($_REQUEST['u'],".com")+5),$file);	
		$file = str_replace('url(/',"url(" . substr($_REQUEST['u'],0,strpos($_REQUEST['u'],".com")+5),$file);	
		$file = str_replace('"">','">',$file);	
	}
	
	//echo stripslashes($file);
	echo $file;
}
?>