#!/bin/python

import urllib
import json
from dateutil.parser import parse

url = 'http://localhost:9200/_river/jdbc/*/_state?pretty'
result = json.load(urllib.urlopen(url))
start = parse(result['state'][0]['last_active_begin'])
end = parse(result['state'][0]['last_active_end'])

if start < end :
    print "Done"
else:
    print "Still working"
