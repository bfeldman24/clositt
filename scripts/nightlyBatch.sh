#!/bin/sh

sudo mkdir -p /home/clositt-private/scripts/logs

d=$(date +%d-%m-%y_%H:%M)

# Run product upload script for all stores
sudo phantomjs /home/clositt-private/phantomjs/phantomProxy.js 'admin/php/productSpider.php#autoSaveAll' >> "/home/clositt-private/scripts/logs/spider_$d.log"

if [ $1 = 'hydrate' ]
then
	# Rehydrate the elastic search
	sudo /home/clositt-private/scripts/elastic/setup.sh >> "/home/clositt-private/scripts/logs/elastic_$d.log"
fi

# Update any products with missing shortlinks
sudo echo "Starting to update the short links..." >> "/home/clositt-private/scripts/logs/spider_$d.log"
sudo phantomjs /home/clositt-private/phantomjs/phantomProxy.js 'spider/updateshortlinks' >> "/home/clositt-private/scripts/logs/spider_$d.log"
sudo echo "Finished updating the short links" >> "/home/clositt-private/scripts/logs/spider_$d.log"


# Sets the status of products to 5 (disabled) where the products tag is = 'delete' or 'remove'
sudo echo "Starting to update the unwanted products..." >> "/home/clositt-private/scripts/logs/spider_$d.log"
sudo phantomjs /home/clositt-private/phantomjs/phantomProxy.js 'spider/deleteunwanted' >> "/home/clositt-private/scripts/logs/spider_$d.log"
sudo echo "Finished updating the unwatned products" >> "/home/clositt-private/scripts/logs/spider_$d.log"

# Run color processing script to process colors for new products
sudo phantomjs /home/clositt-private/phantomjs/phantomProxy.js 'admin/php/colorProcessor.php#autoStart' >> "/home/clositt-private/scripts/logs/colors_$d.log"
