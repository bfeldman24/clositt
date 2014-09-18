#!/bin/sh

sudo mkdir -p /home/clositt-private/scripts/logs

d=$(date +%d-%m-%y_%H:%M)

# Run product upload script for all stores
sudo phantomjs /home/clositt-private/phantomjs/phantomProxy.js 'admin/php/productDetailSpider.php#autoRun' >> "/home/clositt-private/scripts/logs/spider_details_$d.log"
