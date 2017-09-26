#!/usr/bin/env python2

import sys
import time
import simplejson as json

def split_file(name):

  with open('data/' + name + '.json') as data_file:
    data = json.load(data_file,encoding="latin-1")

  for i in xrange(256):
    print "Creating IP chunk #" + str(i)
    with open('data/_' + name + '_ip' + str(i) + '.json', 'w') as outfile:
      json.dump(data['children'][0]['children'][i], outfile)

  with open('data/_' + name + '_as.json', 'w') as outfile:
    json.dump(data['children'][1]['children'], outfile)

  with open('data/_' + name + '_geo.json', 'w') as outfile:
    json.dump(data['children'][2]['children'], outfile)

if __name__ == '__main__':
  if len(sys.argv[1:]) != 1:
    print "Expecting one arguments, a filename (without .json, e.g 20160515) to split..."
  else:
    start = time.time()
    split_file(sys.argv[1:][0])
    end = time.time()
    print "Execution time: " + str(end - start)
