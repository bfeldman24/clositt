#!/bin/sh

curl -XDELETE http://localhost:9200/stores*

curl -XPUT http://localhost:9200/_river/my_jdbc_river/_meta -d '
{
    "type" : "jdbc",
    "jdbc" : {
        "index" : "stores",
        "type" : "store",
        "url" : "jdbc:mysql://clositt.com:3306/thewinn2_clositt",
        "user" : "thewinn2_clstusr",
        "password" : "C1051ttUser",
        "bulk_size" : "1000",
        "sql" : [
            {
                "statement" : "select value as store, char_length(value) as storelength from Filters where type =\"company\""
            }
        ]
    }
}'



while :
do
    if python river_done.py | grep 'Done'  > /dev/null
    then
        break
    else
        printf "\nSleeping for 10 seconds until hydration done"
        sleep 10
    fi

done

printf "\nDeleting river\n"
curl -XDELETE http://localhost:9200/_river*

printf "\nDone\n"
