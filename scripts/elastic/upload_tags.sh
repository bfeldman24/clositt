#!/bin/sh
curl -XPUT http://localhost:9200/_river/my_jdbc_river/_meta -d '
{
    "type" : "jdbc",
    "jdbc" : {
        "index" : "tags",
        "type" : "tag",
        "url" : "jdbc:mysql://clositt.com:3306/thewinn2_clositt",
        "user" : "thewinn2_clstusr",
        "password" : "C1051ttUser",
        "bulk_size" : "1000",
        "sql" : [
            {
                "statement" : "select distinct(tag) as tag, char_length(tag) as taglength from Tags "
            }
        ]
    }
}'



while :
do
    if curl --silent http://localhost:9200/_river/my_jdbc_river/_custom?pretty=true | grep '"active":false' > /dev/null
    then
        break
    else
        printf "\nSleeping for 10 seconds until hydration done"
        sleep 10
    fi

done

printf "\nDeleting river\n"
curl -XDELETE http://localhost:9200/_river

printf "\nDone\n"
