#!/bin/sh

# Run product upload script for a single product
phantomjs phantomjs/phantomProxy.js "admin/php/productDetailSpider.php?o=$1&s=$2&l=$3#singleProduct"
