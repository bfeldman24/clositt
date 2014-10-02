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
                "statement" : "select p.sku as _id, p.sku, p.summary, CONVERT( p.details USING utf8) as details, p.store, p.name, p.closittCount, p.customer, p.price, p.shortlink, p.image, p.link, p.commentCount, cm.name as color, catTags.tag as category, (select tag from Tags t, TagGroups tg where t.sku=p.sku and t.status=1 and t.groupid=tg.groupid and tg.groupid=6 limit 1) as color2 from Products p left join ColorMapping cm ON p.colorOne = cm.color left join Tags catTags on catTags.sku = p.sku and catTags.status=1 left join TagGroups categories on catTags.groupid=categories.groupid and categories.groupid=2 where p.status = 1"
            }
        ]
    }
}'
