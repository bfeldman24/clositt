
#if indexname passed as argument use it, otherewise exit
if [ -n "$1" ]
then :
    NEW_INDEX=products_$1
else :
    printf "Index name not set. Quitting \n"
    exit
fi

OLD_INDEX=`cat latest_alias.txt`
printf "Deleting old alias: $OLD_INDEX\n"

curl -XPOST http://localhost:9200/_aliases -d '
{
    "actions": [
       {
        "remove": {
             "index": "'"$OLD_INDEX"'",
             "alias": "products"
          }
        }
    ]
}'

printf "Creating new alias: $NEW_INDEX\n"

curl -XPOST http://localhost:9200/_aliases -d '
{
    "actions": [
       {
          "add": {
             "index": "'"$NEW_INDEX"'",
             "alias": "products"
          }
       }
    ]
}'
printf "\n Saving latest alias to file\n"
echo $NEW_INDEX > "latest_alias.txt"

printf "\n Deleting old $OLD_INDEX"
curl -XDELETE http://localhost:9200/$OLD_INDEX