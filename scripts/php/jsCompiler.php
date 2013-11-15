<?php

  function getDirectoryList ($directory) 
  {

    // create an array to hold directory list
    $results = array();

    // create a handler for the directory
    $handler = opendir($directory);

    // open directory and walk through the filenames
    while ($file = readdir($handler)) {

      // if file isn't this directory or its parent, add it to the results
      if ($file != "." && $file != "..") {
        $results[] = $file;
      }

    }

    // tidy up: close the handler
    closedir($handler);

    // done!
    return $results;

  }
  
  $dir = "../js";
  
  
//  $filesInDir = getDirectoryList($dir);
//  $files = array();
//
//  for($i=0; $i < count($filesInDir); $i++){
//     
//     if (strpos($filesInDir[$i], ".js") > 0){
//        echo $filesInDir[$i] . "<br>";
//        $files[] = $filesInDir[$i];
//     }
//     
//  }
//  
//  echo "<br><br><br><br>";
  
  
$files = array("firebaseExtension.js",
"messenger.js",
"pagePresenter.js",
"gridPresenter.js",
"gridEvents.js",
"productPresenter.js",
"filterPresenter.js",
"tagPresenter.js",
"searchController.js",
"reviewsPresenter.js",
"closetPresenter.js",
"colorPresenter.js");



  
  for($i=0; $i < count($files); $i++){
     echo $files[$i] . "<br>";
  }

  $jsFiles = "";  
  for($i=0; $i < count($files); $i++){
     $jsFiles .= file_get_contents($dir . "/" . $files[$i]);
  }
  
  $file = fopen("../java/clositt.js","w");
  fwrite($file,$jsFiles);                       
  fclose($file);
  
  echo "DONE! <br>";
  echo "Check out ../java/clositt.js";
    
?>
