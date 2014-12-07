#!/bin/sh

curl -XDELETE http://localhost:9200/_river*

curl -XPUT http://localhost:9200/_river/my_jdbc_river/_meta -d '
{
    "type" : "jdbc",
    "jdbc" : {
        "index" : "attributes",
        "type" : "attribute",
        "url" : "jdbc:mysql://clositt.com:3306/thewinn2_clositt",
        "user" : "thewinn2_clstusr",
        "password" : "C1051ttUser",
        "bulk_size" : "1000",
        "sql" : [
            {
                "statement" : "select value as attribute, char_length(value) as attributelength from Filters where type =\"attribute\""
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
