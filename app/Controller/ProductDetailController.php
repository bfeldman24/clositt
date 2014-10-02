<?php
$script = dirname(__FILE__) . "/../../scripts/populateSingleProductDetail.sh";

if (isset($product) && isset($product->o) && isset($product->s) && isset($product->l)){
	echo "starting...";
	$command = $script . " " . $product->o . " " . $product->s . " " . $product->l;
	$escaped_command = escapeshellcmd($command);
	
	echo " -> $command ";
	$results = exec($escaped_command);
	print_r($results);
}else{
	echo " nothing...";
}

echo "Done";

?>
