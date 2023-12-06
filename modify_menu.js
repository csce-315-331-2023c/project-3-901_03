const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
// const togetherReportRouter = require('./report_ordered_together');
// router.use("/report_ordered_together", togetherReportRouter)

	 	 	 	
//index.set('views', path.join(__dirname, 'views'));
	 	 	 	
//router.set("view engine", "ejs");

/*
var async = require('async');

var results2 = [];
var categories2 = [];

async.parallel({
  results: function(callback) {
    const query2 = client.query('SELECT * FROM entries ORDER BY id desc');
    query2.on('row', (row) => {
      results2.push(row);
    });

    query2.on('end', () => {
      callback(null, results2);
    })
  },
  categories: function(callback) {
    const query3 = client.query('SELECT * FROM categories ORDER BY id desc');
    // Stream results back one row at a time
    query3.on('row', (row) => {
      categories2.push(row);
    });

    query2.on('end', () => {
      callback(null, categories2);
    });
  }
}, function(err, results) {
  if (err) {
    return res.send(err);
  }
  return res.render('index2.ejs',results);
});
*/

// router.get('/modify_menu.ejs', (req, res) => {
//     menuItems = []
    // inventory = []

    // async.parallel({
    //     results: function(callback) {
    //       const query2 = pool.query('SELECT * FROM food_item ORDER BY food_name ASC;');
    //       query2.on('row', (row) => {
    //         results2.push(row);
    //       });
      
    //       query2.on('end', () => {
    //         callback(null, menuItems);
    //       })
    //     },
    //     categories: function(callback) {
    //       const query3 = pool.query('SELECT * FROM inventory ORDER BY ingred_name ASC;');
    //       // Stream results back one row at a time
    //       query3.on('row', (row) => {
    //         categories2.push(row);
    //       });
      
    //       query3.on('end', () => {
    //         callback(null, inventory);
    //       });
    //     }
    //   }, function(err, results) {
    //     console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    //     if (err) {
    //       return res.send(err);
    //     }
    //     return res.render('modify_menu.ejs',results);
    //   });
    
    // pool
    //     .query('SELECT * FROM food_item ORDER BY food_name ASC;')
    //     .then(query_res => {
    //         for (let i = 0; i < query_res.rowCount; i++){
    //             menuItems.push(query_res.rows[i]);
    //         }
    //         const data = {menuItems: menuItems};
    //         //console.log(inventory);
    //         res.render('modify_menu.ejs', data);
    //     });
    
    // pool
    //     .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
    //     .then(query_res => {
    //         for (let i = 0; i < query_res.rowCount; i++){
    //             inventory.push(query_res.rows[i]);
    //         }
            
    //         //console.log(inventory);
            
    //     });
    //     const data1 = {menuItems: menuItems};
    //     const data2 = {inventory: inventory};
    //     res.render('modify_menu.ejs', data1,data2);
    //{ data: { arrayStuff: […], yourString: “Hello World” }}
// });



router.get('/index.ejs', (req, res) => {
    res.render('index.ejs');
});

module.exports = router;

