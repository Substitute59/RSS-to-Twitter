'use strict'

var express = require('express')
var feedRoutes = express.Router()
const sqlite3 = require('sqlite3').verbose();
let Parser = require('rss-parser');
let parser = new Parser();

// get all feed items in the db
feedRoutes.route('/all').get(function (req, res, next) {
  // open the database
  let db = new sqlite3.Database('./db/feed.db');

  let sql = 'SELECT * FROM feeds ORDER BY name';

  db.all(sql, [], (err, feeds) => {
    if (err) {
      res.json(err);
    }
    res.json(feeds);
  });

  // close the database connection
  db.close();
})

// add a feed item
feedRoutes.route('/add').post(function (req, res) {
  // open the database
  let db = new sqlite3.Database('./db/feed.db');

  let sql = 'INSERT INTO feeds (name, url, active) VALUES (?, ?, ?)';

  let lastID;

  db.run(sql, [req.body.name, req.body.url, req.body.active], function(err) {
    if (err) {
      res.json(err);
    }
    lastID = this.lastID;
    res.json(this.lastID);
  });

  (async () => {
    let feed = await parser.parseURL(req.body.url);
    const items = feed.items.map(function (item) {
      return item['link'];
    });

    let sqlupdate = 'UPDATE feeds SET items = ? WHERE id = ?';

    db.run(sqlupdate, [items.toString(), lastID], function (err) {
      if (err) {
        throw err;
      }
    });

    // close the database connection
    db.close();
  })();
})

// delete a feed item
feedRoutes.route('/delete/:id').get(function (req, res, next) {
  // open the database
  let db = new sqlite3.Database('./db/feed.db');

  let sql = 'DELETE FROM feeds WHERE id=?';

  db.run(sql, req.params.id, function (err) {
    if (err) {
      res.json(err);
    }
    res.json('Successfully removed');
  });

  // close the database connection
  db.close();
})

// update a feed item
feedRoutes.route('/update/:id').post(function (req, res, next) {
  // open the database
  let db = new sqlite3.Database('./db/feed.db');

  let sql = 'UPDATE feeds SET active = ? WHERE id = ?';

  db.run(sql, [req.body.active, req.params.id], function (err) {
    if (err) {
      res.json(err);
    }
    res.json(this.changes);
  });

  // close the database connection
  db.close();
})
module.exports = feedRoutes
