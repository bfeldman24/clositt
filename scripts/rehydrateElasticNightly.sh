#!/bin/sh

sudo mkdir -p logs

d=$(date +%d-%m-%y_%H:%M)

# Rehydrate the elastic search
sudo elastic/setup.sh >> "logs/elastic_$d.log"
