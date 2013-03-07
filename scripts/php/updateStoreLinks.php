<?php

if(isset($_POST['j']) && $_POST['j'] != ""){
	$fileName = dirname(__FILE__) . "/../js/json/storeLinks.json";
	
	$file = fopen($fileName, "w");
	
	if($file){
		if(copy($fileName, $fileName . date("mdy"))){
			fwrite($file, stripslashes($_POST['j']));
			echo "1";
		}else{
			echo "Copy Failed!";	
		}	
	}else{
		echo "Open Failed!";	
	}
	
	fclose($file);	
}


?>