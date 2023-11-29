const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const pool = require('./connection.js')
pool.connect();


router.get('/main_reports.ejs', (req, res) => {
    orders = []
    pool
        .query('SELECT ROW_NUMBER() OVER (ORDER BY order_date DESC, order_time DESC) AS row_num, order_date, order_time, STRING_AGG(DISTINCT order_item, ', ' ORDER BY order_item) AS order_items, MAX(order_price) AS order_price, MAX(dine_in) AS dine_in, cashier_id FROM orders GROUP BY order_date, order_time, cashier_id ORDER BY order_date DESC, order_time DESC LIMIT 100;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            const data = {orders: orders};
            //console.log(inventory);
            res.render('main_reports', data);
        });
});


module.exports = router;