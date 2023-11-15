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

router.get('/', (req, res) => {
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

router.post('/submit', (req, res) => {
    console.log(req.body);
    const { cart } = req.body;
    // for(let i = 0; i < cart.length; i++) {
    pool
        .query("INSERT INTO orders (order_num, order_date, order_time, order_item, order_price, dine_in, cashier_id) VALUES (" + 1000000 + ", '" + cart[0].name + "', '" +  cart[0].price + "');");
    res.render('cashier2.ejs');
});

module.exports = router;

