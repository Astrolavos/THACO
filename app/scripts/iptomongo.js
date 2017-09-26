#!/usr/bin/env node
/*eslint-disable*/
'use strict'

const ObjectId = require('objectid');
const MongoUrl = 'mongodb://localhost:27017/vizapp';
const MongoClient = require('mongodb').MongoClient;
const walk = require('./common').walk;

const loadFile = (db, day, children, objId, chunk = 0) => {
  console.log(`Processing day ${day}, IP chunk ${chunk}`);
  const collection = db.collection('items');
  try {
    if (chunk < 256) {
      var result = [];
      const data = require(`./data/_${day}_ip${chunk}.json`);
      children.push(walk(result, day, data, [{
        _id: objId,
        group: 'IP'
      }]));
      collection.insertMany(result, (err, res) => {
        if (err) {
          console.log(`Error: ${err}`)
        } else {
          console.log(`Inserted ${res.ops.length}/${result.length} documents into the items collection`);
          result = null;
          loadFile(db, day, children, objId, chunk + 1);
        }
      });
    } else {
      collection.insert({
        _id: objId,
        parents: [{
          _id: objId,
          group: 'IP'
        }],
        children,
      }, (err, res) => {
        if (err) {
          console.log(`Error: ${err}`)
        } else {
          console.log(`Inserted ROOT: ${res.ops.length} documents into the items collection`);
          db.collection('links').insert({
            topId: objId,
            day: parseInt(day, 10),
            type: 1,
          }, (err, res) => {
            if (err) {
              console.log(`Error: ${err}`)
            } else {
              console.log(`Top link for IPs added into the top collection`);
              console.timeEnd("Time");
              db.close();
            }
          });
        }
      });
    }
  } catch (e) {
    console.log(`Error when opening ./data/_${day}_ip${chunk}.json`);
    console.log(e);
  }
}

MongoClient.connect(MongoUrl, function(err, db) {
  console.log("Connected successfully to MongoDB");
  if (process.argv.length < 3) {
    console.log('Expecting one arguments, a filename (without .json, e.g 20160515) to load into MongoDB.')
  } else {
    console.time("Time");
    loadFile(db, process.argv[2], [], new ObjectId(), parseInt(process.argv[3], 10));
  }
});
