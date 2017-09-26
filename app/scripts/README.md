# Data preprocessing, JSON -> MONGO


## Input format

The input data for the treemap is a JSON file representing multiple nested hierarchies (IP address space, geograpchical location, or autonomous systems (AS)). There should be one JSON file per day (e.g. 20160415.json corresponds to data collected on April 15th 2016). The format for these JSON files is the following. **Note that for the geographical and AS data, the "group" attribute will corresponds to country codes and AS numbers respectively.**


```javascript

{
   "color":713, // Cell color code
   "group":0, //IP block /8
   "children":[
      {
         "color":713, // Cell color code
         "group":0, //IP block /16
         "children":[
            {
               "color":713, // Cell color code
               "group":0, //IP block /24 
               "children":[
                  {
                     "color":712, // Cell color code
                     "group":0, //IP block /24 
                     "children":[

                     ],
                     "size":34193 //Number of blacklisted domains
                  },
              // ...
                
            },
            {
               "color":0, // Cell color code
               "group":1, //IP block /24 
               "children":[
                  {
                     "color":0, // Cell color code
                     "group":1, //IP block /32
                     "children":[

                     ],
                     "size":1 //Number of blacklisted domains
                  },
                  {
                     "color":0, // Cell color code
                     "group":2, //IP block /32
                     "children":[

                     ],
                     "size":1 //Number of blacklisted domains
                  },
                  {
                     "color":0, // Cell color code
                     "group":124, //IP block /32
                     "children":[

                     ],
                     "size":2 //Number of blacklisted domains
                  }
               ],
               "size":4 //Number of blacklisted domains
            }

            // ...
       //...
   ],
   "size":55350 //Number of blacklisted domains
}






```




## Installation

```shell
yarn install
sudo pip install simplejson
```


**Note:** All scripts expect that there is `/data` folder (with 20160415.json ...) related to them. No relative or absolute paths for now.

## All-in-one (USE THIS!)

```
./run.sh 20160415
```

## Or you can do it in steps

### Split one day into multiple files (259)

```
./split.py 20160415
```

### Load the IP space data only

```
./iptomongo.js 20160415 0
```

### Load the AS data only

```
./astomongo.js 20160415
```

### Load the GEO data only

```
./geotomongo.js 20160415
```

### Clean-up

```
rm -f data/_*
```

## Why is it so complicated?

Node.js can't parse JSON bigger than 250MB so we first need to use python to split it. It splits one day into 259 smaller files. Node.js scripts are quite complicated since they have to be recursive, doing Mongo writes in batches and be careful about memory managment so it doesn't ever go over 2GB or RAM.

One day takes about 10-15 minutes with `./run.sh`...
