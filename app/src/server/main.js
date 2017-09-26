import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import compression from 'compression';
import pgp from 'pg-promise';
import geoip from 'geoip-lite';
import Html from './html';
import { ipReport } from './virustotal';
import { resolutions } from './threatcrowd';
import { domainReport } from './threatminer';
import { isIp, isDate, reverse } from './utils';
import { LinkModel, ItemModel } from './db';
import psql from './postgresconfig'; 

const initPgp = pgp();

/******************* This should be adapted to your own database. *****************************/

const psql = initPgp({
  host: process.env.NODE_ENV === 'production' ? '172.17.0.2' : 'localhost',
  port: 5432,
  database: 'dbname',
  user: 'dbuser',
  password: 'dbpass',
});

/******************* This should be adapted to your own database. *****************************/

/* eslint-disable */
let tables = [];
psql.any(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`)
    .then(function(result) { tables = result.map(item => item.table_name) });
/* eslint-enable */

const app = express();
const port = process.env.PORT || 8000;

app.use(compression());
app.use('/build', express.static('build'));

// this is a hackish way how to get IP detail page directly by day & IP (5 DB queries in row...)
app.get('/go-to-ip', (req, res) => {
  const ip = req.query.ip;
  // if (!isIp(ip)) {
  //   res.redirect('/find-ip?msg=no');
  // }
  const date = req.query.day;
  if (!isDate(date)) {
    res.redirect('/find-ip?msg=no');
  }
  const parts = ip.split('.');

  if (parts.length == 4) {

      LinkModel.findOne({ type: 1, day: date }).exec().then(link => ItemModel
        .findOne({ _id: link.topId })
        .exec()
      )
      .then(partRoot => ItemModel
        .findOne({ _id: partRoot.children.find(child => child.group === parseInt(parts[0], 10))._id })
        .exec()
      )
      .then(part1 => ItemModel
        .findOne({ _id: part1.children.find(child => child.group === parseInt(parts[1], 10))._id })
        .exec()
      )
      .then(part2 => ItemModel
        .findOne({ _id: part2.children.find(child => child.group === parseInt(parts[2], 10))._id })
        .exec()
      )
      .then(part3 => {

        res.redirect(
          `/?id=${part3.children.find(child => child.group === parseInt(parts[3], 10))._id}`
        );
      })
      .catch(() => {
        res.redirect('/find-ip?msg=no');
      });

    }

    else if (parts.length == 3) {

      LinkModel.findOne({ type: 1, day: date }).exec().then(link => ItemModel
        .findOne({ _id: link.topId })
        .exec()
      )
      .then(partRoot => ItemModel
        .findOne({ _id: partRoot.children.find(child => child.group === parseInt(parts[0], 10))._id })
        .exec()
      )
      .then(part1 => ItemModel
        .findOne({ _id: part1.children.find(child => child.group === parseInt(parts[1], 10))._id })
        .exec()
      )
      .then(part2 => {
        res.redirect(
          `/?id=${part2.children.find(child => child.group === parseInt(parts[2], 10))._id}`
        );
      })
      .catch(() => {
        res.redirect('/find-ip?msg=no');
      });

    }

    else if (parts.length == 2) {

      LinkModel.findOne({ type: 1, day: date }).exec().then(link => ItemModel
        .findOne({ _id: link.topId })
        .exec()
      )
      .then(partRoot => ItemModel
        .findOne({ _id: partRoot.children.find(child => child.group === parseInt(parts[0], 10))._id })
        .exec()
      )
      .then(part2 => {
        res.redirect(
          `/?id=${part2.children.find(child => child.group === parseInt(parts[1], 10))._id}`
        );
      })
      .catch(() => {
        res.redirect('/find-ip?msg=no');
      });

    }

    else {

      
      LinkModel.findOne({ type: 1, day: date }).exec().then(link => ItemModel
        .findOne({ _id: link.topId })
        .exec()
      )
     
      .then(partRoot => {
        res.redirect(
          `/?id=${partRoot.children.find(child => child.group === parseInt(parts[0], 10))._id}`
        );
      })
      .catch(() => {
        res.redirect('/find-ip?msg=no');
      });


    }


});


app.get('/api/v1/item/:uid', (req, res) => {
  ItemModel.findOne({ _id: req.params.uid }).exec((err, item) => {
    if (err || !item) {
      res.status(400).send({ errors: [err || `The UID ${req.params.uid} doesn't exist.`] });
    } else {
      LinkModel.findOne({ topId: item.parents[0]._id }).exec((err2, result) => {
        if (err2) {
          res.status(400).send({ errors: [err2] });
        } else {
          res.send({
            data: item,
            day: result.day,
          });
        }
      });
    }
  });
});

app.get('/api/v1/links', (req, res) => {
  LinkModel.find({}).exec((err, links) => {
    if (err) {
      res.status(400).send({ errors: [err] });
    } else {
      res.send({
        links,
      });
    }
  });
});

app.get('/api/v1/ip_report/:ip', ipReport);
app.get('/api/v1/resolutions/:ip', resolutions);
app.get('/api/v1/domain_report/:domain', domainReport);

app.get('/api/v1/info/:day/:ip', (req, res) => {
  let countNew = null;
  if (!isIp(req.params.ip)) {
    res.status(400).send({ errors: [`IP ${req.params.ip} is invalid.`] });
  }
  const date = req.params.day;
  const search = req.query.search;
  if (!isDate(date)) {
    res.status(400).send({ errors: [`Day ${date} is invalid.`] });
  }
  const countAll = psql.any(
    `select COUNT(*) from $1~ where rdata = $2 ${search ? 'and $1~.qname like $3' : ''}`,
    [`dip${date}`, req.params.ip, `%${reverse(search)}%`]
  );
  const countBlacklisted = psql.any(
    `select COUNT(*) from $1~
     inner join blacklist on (blacklist.qname=$1~.qname)
     where $1~.rdata = $2 ${search ? 'and $1~.qname like $3' : ''}
    `,
    [`dip${date}`, req.params.ip, `%${reverse(search)}%`]
  );
  if (tables.indexOf(`dip${date - 1}`) > -1) {
    countNew = psql.any(
      `select COUNT(*)
       from $1~
       where not exists (select 1 FROM $2~ WHERE $2~.qname = $1~.qname)
       and $1~.rdata = $3
       ${search ? 'and $1~.qname like $4' : ''}
      `,
      [`dip${date}`, `dip${date - 1}`, req.params.ip, `%${reverse(search)}%`]
    );
  }
  Promise.all([countAll, countBlacklisted, countNew]).then(result => {
    res.send({
      countAllDomains: parseInt(result[0][0].count, 10),
      countBlacklistedDomains: parseInt(result[1][0].count, 10),
      countNewDomains: (tables.indexOf(`dip${date - 1}`) > -1) ?
        parseInt(result[2][0].count, 10) : 0,
      geo: geoip.lookup(req.params.ip),
    });
  })
  .catch(error => {
    res.status(400).send({ errors: [error.message || error] });
  });
});

app.get('/api/v1/domains/:day/:ip', (req, res) => {
  if (!isIp(req.params.ip)) {
    res.status(400).send({ errors: [`IP ${req.params.ip} is invalid.`] });
  }
  const date = req.params.day;
  if (!isDate(date)) {
    res.status(400).send({ errors: [`Day ${date} is invalid.`] });
  }

  let query = 'select qname from $1~ where rdata = $2 limit $3 offset $4';
  let args = [`dip${date}`, req.params.ip, req.query.limit, req.query.offset];

  if (req.query.search) {
    query = 'select qname from $1~ where rdata = $2 and qname like $3 limit $4 offset $5';
    args = [
      `dip${date}`,
      req.params.ip,
      `%${reverse(req.query.search)}%`,
      req.query.limit,
      req.query.offset,
    ];
  }

  psql.any(query, args).then(result => {
    res.send({
      domains: result.map(item => reverse(item.qname).slice(0, -1)),
    });
  })
  .catch(error => {
    res.status(400).send({ errors: [error.message || error] });
  });
});

app.get('/api/v1/blacklisted_domains/:day/:ip', (req, res) => {
  if (!isIp(req.params.ip)) {
    res.status(400).send({ errors: [`IP ${req.params.ip} is invalid.`] });
  }
  const date = req.params.day;
  if (!isDate(date)) {
    res.status(400).send({ errors: [`Day ${date} is invalid.`] });
  }

  let query = `select $1~.qname from $1~
     inner join blacklist on (blacklist.qname=$1~.qname)
     where $1~.rdata = $2
     limit $3
     offset $4
  `;
  let args = [`dip${date}`, req.params.ip, req.query.limit, req.query.offset];

  if (req.query.search) {
    query = `select $1~.qname from $1~
     inner join blacklist on (blacklist.qname=$1~.qname)
     where $1~.rdata = $2 and $1~.qname like $3
     limit $4
     offset $5
    `;
    args = [
      `dip${date}`,
      req.params.ip,
      `%${reverse(req.query.search)}%`,
      req.query.limit,
      req.query.offset,
    ];
  }

  psql.any(query, args).then(result => {
    res.send({
      blacklisted: result.map(item => reverse(item.qname).slice(0, -1)),
    });
  })
  .catch(error => {
    res.status(400).send({ errors: [error.message || error] });
  });
});

app.get('/api/v1/new_domains/:day/:ip', (req, res) => {
  const date = req.params.day;
  if (tables.indexOf(`dip${date - 1}`) === -1) {
    res.send({ new: [] });
    return;
  }
  if (!isIp(req.params.ip)) {
    res.status(400).send({ errors: [`IP ${req.params.ip} is invalid.`] });
  }
  if (!isDate(date)) {
    res.status(400).send({ errors: [`Day ${date} is invalid.`] });
  }

  let query = `select $1~.qname
     from $1~
     where not exists (select 1 FROM $2~ WHERE $2~.qname = $1~.qname)
     and $1~.rdata = $3
     limit $4
     offset $5
  `;
  let args = [`dip${date}`, `dip${date - 1}`, req.params.ip, req.query.limit, req.query.offset];

  if (req.query.search) {
    query = `select $1~.qname
      from $1~
      where not exists (select 1 FROM $2~ WHERE $2~.qname = $1~.qname)
      and $1~.rdata = $3
      and $1~.qname like $4
      limit $5
      offset $6
    `;
    args = [
      `dip${date}`,
      `dip${date - 1}`,
      req.params.ip,
      `%${reverse(req.query.search)}%`,
      req.query.limit,
      req.query.offset,
    ];
  }

  psql.any(query, args).then(result => {
    res.send({
      new: result.map(item => reverse(item.qname).slice(0, -1)),
    });
  })
  .catch(error => {
    res.status(400).send({ errors: [error.message || error] });
  });
});

app.get('/api/v1/ips/:day/:domain', (req, res) => {
  
  const date = req.params.day;
    if (!isDate(date)) {
    res.status(400).send({ errors: [`Day ${date} is invalid.`] });
  }

  let query = 'select distinct rdata from $1~ where qname = $2 limit $3 offset $4';
  let args = [`dip${date}`, `.` + `${reverse(req.params.domain)}`, req.query.limit, req.query.offset];

  if (req.query.search) {
    query = 'select distinct rdata from $1~ where qname = $2 and qname like $3 limit $4 offset $5';
    //query = 'select distinct rdata from $1~ where qname = $2 limit $4 offset $5';

    args = [
      `dip${date}`,
      `.` + `${reverse(req.params.domain)}`,
      `%${reverse(req.query.search)}%`,
      req.query.limit,
      req.query.offset,
    ];
    
  }

  psql.any(query, args).then(result => {
    res.send({
      ips: result.map(item => item.rdata),
    });
  })
  .catch(error => {
    res.status(400).send({ errors: [error.message || error] });
  });



});





app.get('*', (req, res) => {
  res.send(`<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(<Html />)}`);
});

app.listen(port);
console.log(`Server started on port ${port}`); // eslint-disable-line
