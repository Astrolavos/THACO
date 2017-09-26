#!/usr/bin/env node
/*eslint-disable*/
'use strict'

const ObjectId = require('objectid');
const MongoUrl = 'mongodb://localhost:27017/vizapp';
const MongoClient = require('mongodb').MongoClient;
const walk = require('./common').walk;

const loadFile = (db, day, objId) => {
  console.log(`Processing day ${day}, AS`);
  const collection = db.collection('items');
  try {
    var result = [];
    const data = require(`./data/_${day}_as.json`).sort((a, b) => b.size - a.size);

    result.push({
      _id: objId,
      parents: [{
        _id: objId,
        group: 'AS'
      }],
      children: data.slice(0, 200).map(continent => walk(result, day, continent, [{
        _id: objId,
        group: 'AS'
      }])),
    })
    collection.insertMany(result, (err, res) => {
      if (err) {
        console.log(`Error: ${err}`)
      } else {
        console.log(`Inserted ${res.ops.length}/${result.length} documents into the items collection`);
        console.log(`Inserted ROOT: ${res.ops.length} documents into the items collection`);
        db.collection('links').insert({
          topId: objId,
          day: parseInt(day, 10),
          type: 3,
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
  } catch (e) {
    console.log(`Error when processing ./data/_${day}_as.json`);
    console.log(e);
  }
}

MongoClient.connect(MongoUrl, function(err, db) {
  console.log("Connected successfully to MongoDB");
  if (process.argv.length < 3) {
    console.log('Expecting one arguments, a filename (without .json, e.g 20160515) to load into MongoDB.')
  } else {
    console.time("Time");
    loadFile(db, process.argv[2], new ObjectId());
  }
});
