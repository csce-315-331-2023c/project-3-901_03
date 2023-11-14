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


// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	

// router.post('/report_sales.ejs',(req, res) => { 
//     pool
//         .query("SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '" + req.body.startDate + "' AND order_date <= '" + req.body.endDate + "' GROUP BY order_item ORDER BY SUM(order_price) DESC;");
//     res.render('report_sales');
// });

router.get('/report_sales.ejs', (req, res) => {
    res.render('report_sales');
});

router.post('/report_sales', (req, res) => {
    try {
    orders = []
    console.log(req.body.startDate);
    pool
        .query("SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '" + req.body.startDate + "' AND order_date <= '" + req.body.endDate + "' GROUP BY order_item ORDER BY item_total DESC;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            const data = {orders: orders};
            //console.log(inventory);
            res.render('report_sales.ejs', data);
        });
    } catch (err) {
        next(err)
    }
});

router.get('/report_sales', (req, res) => {
    try {
    orders = []
    console.log(req.body.startDate);
    pool
        .query("SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '" + req.body.startDate + "' AND order_date <= '" + req.body.endDate + "' GROUP BY order_item ORDER BY item_total DESC;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            const data = {orders: orders};
            //console.log(inventory);
            res.render('report_sales.ejs', data);
        });
    } catch (err) {
        next(err)
    }
});






// <% for (var i in orders) {%>
//     <p>Menu Item: <%=orders[i].order_item%>, Sales Total: <%=orders[i].item_total%><p>
//     <% } %>


module.exports = router;