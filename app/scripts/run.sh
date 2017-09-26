#!/bin/bash

day=$1

if [[ -n "$day" ]]; then
  echo "Processing day $1..."
  python split.py $1
  node --max-old-space-size=4096 iptomongo.js $1 0
  ./astomongo.js $1
  ./geotomongo.js $1
  rm -f data/_$1*
else
  echo "MISSING ARGUMENT: Specify day file like ./run.sh 20160415"
fi
