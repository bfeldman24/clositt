#!/bin/bash

curl -XPOST 'http://localhost:9200/_cluster/nodes/_local/_shutdown'
