#!/bin/sh

sudo mkdir -p logs

d=$(date +%d-%m-%y_%H:%M)

# Run product upload script for all stores
sudo phantomjs phantomjs/phantomProxy.js 'admin/php/productDetailSpider.php#autoRun' >> "logs/spider_details_$d.log"
