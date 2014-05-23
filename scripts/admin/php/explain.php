<!DOCTYPE>
<html>
<head>
    <title>Search Admin</title>
<body>

<?php
require_once(dirname(__FILE__) . '/../../../app/globals.php');
require_once('vendor/autoload.php'); //should be placed on non public path in php.ini
include(dirname(__FILE__) . '/../../../app/Elastic/ElasticDao.php');

if(isset($_GET['sku'])){

    $elasticDao = new ElasticDao();

    $results = $elasticDao->explainQueryResults($_GET['sku'], $_GET['query']);
    echo "<pre>";
    echo json_encode($results, JSON_PRETTY_PRINT);
    echo "</pre>";
}
?>


</body>
</html>