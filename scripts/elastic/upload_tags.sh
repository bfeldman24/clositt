#!/bin/sh

curl -XDELETE http://localhost:9200/categories

curl -XPUT http://localhost:9200/_river/my_jdbc_river/_meta -d '
{
    "type" : "jdbc",
    "jdbc" : {
        "index" : "categories",
        "type" : "category",
        "url" : "jdbc:mysql://clositt.com:3306/thewinn2_clositt",
        "user" : "thewinn2_clstusr",
        "password" : "C1051ttUser",
        "bulk_size" : "1000",
        "sql" : [
            {
                "statement" : "select distinct(subvalue) as category, char_length(subvalue) as categorylength from Filters where type=\"category\""
            },
            {
                "statement" : "select distinct(synonym) as category, char_length(synonym) as categorylength from Filters where type=\"category\""
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
