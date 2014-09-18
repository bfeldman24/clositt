#!/bin/sh

sudo mkdir -p logs

d=$(date +%d-%m-%y_%H:%M)

# Run product upload script for all stores
sudo phantomjs phantomjs/phantomProxy.js 'admin/php/productSpider.php#autoSaveAll' >> "logs/spider_$d.log"

if [ $1 = 'hydrate' ]
then
	# Rehydrate the elastic search
	sudo elastic/setup.sh >> "logs/elastic_$d.log"
fi

# Update any products with missing shortlinks
sudo echo "Starting to update the short links..." >> "logs/spider_$d.log"
sudo phantomjs phantomjs/phantomProxy.js 'spider/updateshortlinks' >> "logs/spider_$d.log"
sudo echo "Finished updating the short links" >> "logs/spider_$d.log"


# Sets the status of products to 5 (disabled) where the products tag is = 'delete' or 'remove'
sudo echo "Starting to update the unwanted products..." >> "logs/spider_$d.log"
sudo phantomjs phantomjs/phantomProxy.js 'spider/deleteunwanted' >> "logs/spider_$d.log"
sudo echo "Finished updating the unwatned products" >> "logs/spider_$d.log"

# Run color processing script to process colors for new products
sudo phantomjs phantomjs/phantomProxy.js 'admin/php/colorProcessor.php#autoStart' >> "logs/colors_$d.log"
