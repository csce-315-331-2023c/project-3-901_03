const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
//const { query } = require('express');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

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

router.get('/cashier2.ejs', (req, res) => {
    menuitems = []
    pool
    .query('SELECT * FROM food_item;')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            menuitems.push(query_res.rows[i]);
        }
        const data = {menuitems: menuitems};
            //console.log(inventory);
        res.render('cashier2.ejs', data);
    });
});

router.post('/', (req, res) => {
    // var cbox = req.body['ingredList']
    console.log()
    res.render('cashier2');
});

module.exports = router;

