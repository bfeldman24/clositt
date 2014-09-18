#!/bin/bash          

CURRENT_DATE=$(date +"%m%d%Y%H%M%S")

printf "Current Date is $CURRENT_DATE \n"

printf "\nCreating index and mapping:\n"
curl -XPUT http://localhost:9200/products_$CURRENT_DATE -d @mappings.json

printf "\nCreating river:\n"
./create_river.sh $CURRENT_DATE

printf "\nSleeping for 3 minute until river done"
sleep 120

printf "\nSetting up alias:\n"
./create_alias.sh $CURRENT_DATE

printf "\nDone\n"
