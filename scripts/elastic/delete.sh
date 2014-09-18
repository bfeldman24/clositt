#!/bin/bash          

printf "Deleting index and mapping:\n"
curl -XDELETE http://localhost:9200/products

printf "\nDeleting river:\n"
curl -XDELETE http://localhost:9200/_river

printf "\nDone\n"