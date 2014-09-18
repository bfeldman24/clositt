#!/bin/bash          
    
#if indexname passed as argument use it, otherewise exit
if [ -n "$1" ]
then :
    INDEX=products_$1
else :
    printf "Index name not set. Quitting \n"
    exit
fi

printf "Index being used is $INDEX\n"

printf "\nDeleting old rive\n"
curl -XDELETE http://localhost:9200/_river/my_jdbc_river

printf "\nCreating new river\n"
curl -XPUT http://localhost:9200/_river/my_jdbc_river/_meta -d '
{
    "type" : "jdbc",
    "jdbc" : {
        "index" : "'"$INDEX"'",
        "type" : "product",     
        "url" : "jdbc:mysql://clositt.com:3306/thewinn2_clositt",
        "user" : "thewinn2_clstusr",
        "password" : "C1051ttUser",
        "bulk_size" : "1000",
        "sql" : [
            {
                "statement":"select p.sku as _id, p.sku, p.summary, CONVERT(p.details USING utf8) as details, p.store, p.name, p.closittCount, p.price, p.shortlink, p.image, p.customer,p.category, p.link, p.commentCount, cm.parent as color, cm2.parent as color2, t.tag from Products p left join ColorMapping cm on p.colorOne = cm.color left join ColorMapping cm2 on p.colorTwo = cm2.color left join Tags t on t.sku=p.sku and t.status=1 where p.status = 1"
            }
            ]
    }
}'
