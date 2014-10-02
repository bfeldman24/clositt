#!/bin/bash          


SERVICE='org.elasticsearch.bootstrap.Elasticsearch'

#Start service if not runnig yet
if ps ax | grep -v grep | grep $SERVICE > /dev/null
then
    echo "$SERVICE service running, checking health"

    if curl --silent http://localhost:9200/_cluster/health | grep "status.*red" > /dev/null
    then
        echo "ES is not healthy, restarting!"
        curl -XPOST http://localhost:9200/_shutdown
        ./../../elasticsearch-1.1.0/bin/elasticsearch -d -Xmx96m -Xms96m
    else
        echo "ES is healthy!"
    fi

else
    echo "$SERVICE is not running, starting"
    ./../../elasticsearch-1.1.0/bin/elasticsearch -d -Xmx96m -Xms96m
fi