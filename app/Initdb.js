var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/feed.db');

db.serialize(function () {
  db.run('CREATE TABLE feeds (id INTEGER PRIMARY KEY, name TEXT, url Text, active Integer)');
});

db.close();
