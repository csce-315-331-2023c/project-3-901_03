const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3600;
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
	 	 	 	
// router.get('/menu_mod_name.ejs', (req, res) => {
//     menuItems = []
//     pool
//         .query('SELECT * FROM food_item ORDER BY food_name ASC;')
//         .then(query_res => {
//             for (let i = 0; i < query_res.rowCount; i++){
//                 menuItems.push(query_res.rows[i]);
//             }
//             const data = {menuItems: menuItems};
//             //console.log(inventory);
//             res.render('menu_mod_name', data);
//         });
// });

router.post('/', async(req, res) => {
    await pool
        .query("DELETE FROM orders WHERE order_date = '" + req.body.orderdate + "' AND order_time = '" + req.body.ordertime + "' AND cashier_id = "+ req.body.ordercashier + ";");
    const sqlquery = "SELECT ROW_NUMBER() OVER (ORDER BY order_date DESC, order_time DESC) AS row_num, order_date, order_time, STRING_AGG(DISTINCT order_item, ', ' ORDER BY order_item) AS order_items, SUM(order_price) AS total_order_price, MAX(dine_in) AS dine_in, cashier_id, MAX(status) AS status FROM orders GROUP BY order_date, order_time, cashier_id ORDER BY order_date DESC, order_time DESC LIMIT 100"
    const result = await pool.query(sqlquery);

    res.render('order_management.ejs', {result: result.rows});
    //res.render('menu_mod_name');
});

module.exports = router;