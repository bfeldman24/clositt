#!/bin/bash          


SERVICE='org.elasticsearch.bootstrap.Elasticsearch'
CURRENTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_LOCATION="$CURRENTDIR/../../lib/elasticsearch-1.4.0/bin/elasticsearch"
#Start service if not runnig yet
if ps ax | grep -v grep | grep $SERVICE > /dev/null
then
    echo "$SERVICE service running, checking health"

    if curl --silent http://localhost:9200/_cluster/health | grep "status.*red" > /dev/null
    then
        echo "ES is not healthy, restarting!"
        curl -XPOST http://localhost:9200/_shutdown
        $SCRIPT_LOCATION -d -Xmx96m -Xms96m
    else
        echo "ES is healthy!"
    fi

else
    echo "$SERVICE is not running, starting"
    $SCRIPT_LOCATION -d -Xmx96m -Xms96m
    sleep 10
fi