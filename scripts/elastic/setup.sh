#!/bin/bash        

./start_elastic.sh  

CURRENT_DATE=$(date +"%m%d%Y%H%M%S")

printf "Current Date is $CURRENT_DATE \n"

printf "\nCreating index and mapping:\n"
curl -XPUT http://localhost:9200/products_$CURRENT_DATE -d @mappings.json

printf "\nCreating river:\n"
./create_river.sh $CURRENT_DATE

while :
do
    if curl --silent http://localhost:9200/_river/my_jdbc_river/_custom?pretty=true | grep '"active":false' > /dev/null
    then
        break
    else
        printf "\nSleeping for 20 seconds until hydration done"
        sleep 20
    fi

done

printf "\nSetting up alias:\n"
./create_alias.sh $CURRENT_DATE

printf "\nDeleting river\n"
curl -XDELETE http://localhost:9200/_river

printf "\nDone\n"


printf "\n\Setting up Filters \n"

./upload_attributes.sh
./upload_materials.sh
./upload_stores.sh
./upload_tags.sh