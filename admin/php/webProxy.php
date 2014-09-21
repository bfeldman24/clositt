<?php 
function file_get_contents_curl($url) {       
    $curl = curl_init($url);    
    //curl_setopt($curl, CURLOPT_USERAGENT, 'search/1.0 (www.search.com)'); //'Googlebot/2.1 (http://www.googlebot.com/bot.html)')
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:26.0) Gecko/20100101 Firefox/26.0');    
    curl_setopt($curl, CURLOPT_AUTOREFERER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt($curl, CURLOPT_TIMEOUT, 2 );
    $html = curl_exec( $curl );
    curl_close( $curl);
    return $html;
}

function combineMultipleUrls($file, $nextPage, $curl = false){
    if(isset($nextPage) && $nextPage != ""){
        
        if ($curl){
            file_get_contents_curl($nextPage);
        }else{
            $page = file_get_contents($nextPage);
        }        
        
        // strip before opening <body>
        $page = trim(substr($page, strpos($page,"<body")));
        // strip <body> tag
        $page = trim(substr($page, strpos($page,">") + 1));   
        // strip ending </body> and after
        $page = trim(substr($page,0,  strpos($page,"</body")));   
        
        // get part before end body tag
        $partOne = trim(substr($file, 0, strpos($file,"</body")));        
        // get part after end body tag
        $partTwo = trim(substr($file, strpos($file,"</body")));   
        return $partOne . $page . $partTwo;         
    }
    
    return $file; 
}


if(isset($_REQUEST['u']) && $_REQUEST['u'] != ""){   
    $url = stripslashes($_REQUEST['u']);   
    $file = "";
    
    if (isset($_REQUEST['d'])){
        echo "url: " . $url;
    }

    if (isset($_REQUEST['phantom'])){
    	$phantom = "phantomjs";
        $phantomScript = "/home/ben/clositt-private/phantomjs/phantomWebProxy.js";
        $command = $phantom . " " . $phantomScript . " " . $url;
        
        exec($command, $output);
        $file = implode("", $output);
    }else{    
	
	if (strpos($_REQUEST['u'],"anthropologie")){
    	// Combine multiple url <body> into one
    	$file = combineMultipleUrls($file, $url);
    	$file = combineMultipleUrls($file, $url . "&page=2&startValue=51");
    	$file = combineMultipleUrls($file, $url . "&page=3&startValue=101");
    	$file = combineMultipleUrls($file, $url . "&page=4&startValue=151");
    	$file = combineMultipleUrls($file, $url . "&page=5&startValue=201");	      	
	}
	
	else if (strpos($url,"bloomingdales")){
    	// Combine multiple url <body> into one
    	$file = combineMultipleUrls($file, $url . "&pageIndex=2");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=3");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=4");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=5");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=6");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=7");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=8");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=9");
    	$file = combineMultipleUrls($file, $url . "&pageIndex=10");	
	}	
		
	else if (strpos($url,"intermix")){
    	// Combine multiple url <body> into one
    	$file = combineMultipleUrls($file, $url . "&page=2");
    	$file = combineMultipleUrls($file, $url . "&page=3");
    	$file = combineMultipleUrls($file, $url . "&page=4");
    	$file = combineMultipleUrls($file, $url . "&page=5");
    	$file = combineMultipleUrls($file, $url . "&page=6");
    	$file = combineMultipleUrls($file, $url . "&page=7");
    	$file = combineMultipleUrls($file, $url . "&page=8");
    	$file = combineMultipleUrls($file, $url . "&page=9");
    	$file = combineMultipleUrls($file, $url . "&page=10");	
	}	 
	
	else if (strpos($url,"nordstrom")){
    	// Combine multiple url <body> into one
    	$file = file_get_contents_curl($url);   	
    	$file = combineMultipleUrls($file, $url . "&page=2");
    	$file = combineMultipleUrls($file, $url . "&page=3");
    	$file = combineMultipleUrls($file, $url . "&page=4");
    	$file = combineMultipleUrls($file, $url . "&page=5");
    	$file = combineMultipleUrls($file, $url . "&page=6");
    	$file = combineMultipleUrls($file, $url . "&page=7");
    	$file = combineMultipleUrls($file, $url . "&page=8");
    	$file = combineMultipleUrls($file, $url . "&page=9");
    	$file = combineMultipleUrls($file, $url . "&page=10");	
	}	 
	
	else if (strpos($url,"brooksbrothers")){
	   
	    $file = file_get_contents_curl($url);   	
	    $file = "<html><body>" . $file . "</body></html>";   
	   
    	// Combine multiple url <body> into one
//    	$subUrl = substr($url, 0, strpos($url, "?"));
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=0&sz=60&format=ajax");
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=61&sz=60&format=ajax");
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=121&sz=60&format=ajax");
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=181&sz=60&format=ajax");
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=241&sz=60&format=ajax");
//    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=301&sz=60&format=ajax");
	}	 		 
	
	else if (strpos($url,"lordandtaylor")){
    	// Combine multiple url <body> into one
    	$file = file_get_contents_curl($url);
//    	$file = combineMultipleUrls($file, $url);
//    	$file = combineMultipleUrls($file, $url . "?beginIndex=100");
//    	$file = combineMultipleUrls($file, $url . "?beginIndex=200");
//    	$file = combineMultipleUrls($file, $url . "?beginIndex=300");
//    	$file = combineMultipleUrls($file, $url . "?beginIndex=400");	
	}
	
	else if (strpos($url,"kohls")){
    	// Combine multiple url <body> into one
    	$file = combineMultipleUrls($file, $url . "&WS=0");
    	$file = combineMultipleUrls($file, $url . "&WS=96");
    	$file = combineMultipleUrls($file, $url . "&WS=192");
    	$file = combineMultipleUrls($file, $url . "&WS=288");
    	$file = combineMultipleUrls($file, $url . "&WS=382");
	}
	
	else if (strpos($url,"topshop") || strpos($url,"target") || strpos($url,"anntaylor") || strpos($url,"zara")){
	   $file = file_get_contents_curl($url);   
	   
	   if ($_REQUEST['d']){
           echo "contents: " . $file;
       }
	}
	
	else{
	   $file = file_get_contents($url); 
	   
	   if ($file == null || trim($file) == ""){
	       $file = file_get_contents_curl($url);
	   }  
	   	
	   if (isset($_REQUEST['d'])){
	       $html = htmlspecialchars($file, ENT_QUOTES);
           echo " contents: " . $html;
       }	   
	}	    
		
	}
	
	// only strip starting and ending body if the body tag exists (could be in json format)	
	if (strpos($file,"<body") && strpos($file,"{") != 0){
	    $file = preg_replace("/<!--.*?-->/ms", "", $file);
    	//$file = preg_replace('#[\t\n\r]#i', "", $file);
    	$file = str_replace("<noscript","<div ", $file);
    	$file = str_replace("</noscript>","</div>", $file);
    	$file = preg_replace('#<script(.*?)>(.*?)</script>#is', "", $file);
    	$file = preg_replace('#<style(.*?)>(.*?)</style>#is', "", $file);

//    	$file = strip_tags($file, '<p><a><img><strong><div><span><h1><h2><h3><h4><ul><li><ol><html><body>');
	    //	$file = preg_replace('#<style(.*?)>(.*?)</style>#is', "", $file);
        //	$file = preg_replace('#<head>(.*?)</head>#i', "", $file);   
	   
	   
    	// strip before opening <html>
//        $file = trim(substr($file, strpos($file,"<body")));   
//        
//        // strip ending </html> and after
//        $file = trim(substr($file,0,  strpos($file,"</body")));   
//        
//        $file = $file . "</body>";			
	}
        		
	echo $file;
}
else if(isset($_REQUEST['t']) && $_REQUEST['t'] != ""){ 
    ?>
    <form method="post">
        <input type="text" name="u" />
        <input type="submit" />
    </form>
    <?php
}else{
 echo "Got nothing";   
}


?>
