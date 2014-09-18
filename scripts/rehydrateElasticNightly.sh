#!/bin/sh

sudo mkdir -p /home/clositt-private/scripts/logs

d=$(date +%d-%m-%y_%H:%M)

# Rehydrate the elastic search
cd /home/clositt-private/scripts/elastic/
sudo /home/clositt-private/scripts/elastic/setup.sh >> "/home/clositt-private/scripts/logs/elastic_$d.log"
