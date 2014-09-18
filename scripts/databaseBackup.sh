#!/bin/sh

sudo mkdir -p data

d=$(date +%d-%m-%y_%H:%M)

# Run product upload script for all stores
mysqldump -u thewinn2_clstusr -h localhost -pC1051ttUser thewinn2_clositt > "data/clositt_db_dump_$d.sql"
