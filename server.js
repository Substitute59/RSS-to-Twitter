/* jslint node: true */
'use strict'

var express = require('express')
var morgan = require('morgan')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')

// Sends static files  from the public path directory
app.use(express.static(path.join(__dirname, '/public')))

// Use morgan to log request in dev mode
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = 4000
app.listen(port) // Listen on port defined in config file

console.log('App listening on port ' + port)

// Cron check rss change to tweet it
let Parser = require('rss-parser');
let parser = new Parser();
const sqlite3 = require('sqlite3').verbose();
var Twitter = require('twitter');
var shortUrl = require('node-url-shortener');

var client = new Twitter({
    consumer_key: '4Sx5L18M8xugVuBSmKzxqZrfD',
    consumer_secret: 'wrdCl7Z6yxKwWNQzehqthAXuKPTnqMcEjENeKSelfeSqEVyDnw',
    access_token_key: '1151961280481284097-mxu8RW1QyoenhMDuoTBmyxjiYKOVyU',
    access_token_secret: 'ofIEDzlC9XUuSgvOC80WPIai3pjx2thq9HMTx7vuI1xzh'
});

setInterval(() => {
    let db = new sqlite3.Database('./db/feed.db');

    let sql = 'SELECT * FROM feeds ORDER BY name';

    db.all(sql, [], (err, feeds) => {
        if (err) {
            res.json(err);
        }
        feeds.forEach((flux) => {
            (async () => {
                let feed = await parser.parseURL(flux.url);
                feed.items.forEach(item => {
                    if (flux.items) {
                        if (flux.items.indexOf(item.link) < 0) {
                            shortUrl.short(item.link, function (err, url) {
                                client.post('statuses/update', {
                                    status: `${item.title} ${url}`
                                }, function (error, tweet, response) {
                                    if (error) throw error;
                                    console.log(tweet); // Tweet body
                                });

                                let db = new sqlite3.Database('./db/feed.db');

                                const items = feed.items.map(function (item) {
                                    return item['link'];
                                });

                                let sqlupdate = 'UPDATE feeds SET items = ? WHERE id = ?';

                                db.run(sqlupdate, [items.toString(), flux.id], function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                });

                                // close the database connection
                                db.close();
                            });
                        }
                    }
                });
            })();
        });
    });

    // close the database connection
    db.close();
}, 10000);

var feedRoutes = require('./app/Routes')
//  Use routes defined in Route.js and prefix with feed
app.use('/api', feedRoutes)
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    // Pass to next layer of middleware
    next()
})
// Server index.html page when request to the root is made
app.get('/', function (req, res, next) {
    res.sendfile('./public/index.html')
})
