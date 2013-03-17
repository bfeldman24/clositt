<?php

if(isset($_POST['j']) && $_POST['j'] != ""){
	$fileName = dirname(__FILE__) . "/../js/json/storeLinks.json";
		
	if(copy($fileName, $fileName . date("mdy"))){
		$file = fopen($fileName, "w");
		
		if($file){
			fwrite($file, stripslashes($_POST['j']));
			echo "1";
		}else{
			echo "Open Failed!";	
		}
	}else{
		echo "Copy Failed!";	
	}	

	
	fclose($file);	
}


?>