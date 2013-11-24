<?php 
function file_get_contents_curl($url) {       
    $curl = curl_init($url);    
    curl_setopt($curl, CURLOPT_USERAGENT, 'search/1.0 (www.search.com)'); //'Googlebot/2.1 (http://www.googlebot.com/bot.html)')
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
    $file = file_get_contents($url);
	
	if (strpos($_REQUEST['u'],"anthropologie")){
    	// Combine multiple url <body> into one
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
    	// Combine multiple url <body> into one
    	$subUrl = substr($url, 0, strpos($url, "?"));
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=0&sz=60&format=ajax");
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=61&sz=60&format=ajax");
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=121&sz=60&format=ajax");
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=181&sz=60&format=ajax");
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=241&sz=60&format=ajax");
    	$file = combineMultipleUrls($file, $subUrl . "?pmin=1&start=301&sz=60&format=ajax");
	}	 		 
	
	else if (strpos($url,"lordandtaylor")){
    	// Combine multiple url <body> into one
    	$file = combineMultipleUrls($file, $url);
    	$file = combineMultipleUrls($file, $url . "?beginIndex=100");
    	$file = combineMultipleUrls($file, $url . "?beginIndex=200");
    	$file = combineMultipleUrls($file, $url . "?beginIndex=300");
    	$file = combineMultipleUrls($file, $url . "?beginIndex=400");	
	}	

    // only strip starting and ending body if the body tag exists (could be in json format)	
	if (strpos($file,"<body")){
    	// strip before opening <body>
        $file = trim(substr($file, strpos($file,"<body")));   
        // strip ending </body> and after
        $file = trim(substr($file,0,  strpos($file,"</body")));   
        
        $file = "<html>" . $file . "</body></html>";			
	}
        		
	echo $file;
}
else{
 echo "Got nothing";   
}


?>