const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');


let currentUser = "NA";
// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
const { maxHeaderSize } = require('http');
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



const userQuery = 'SELECT user_name, cashier_perm, manager_perm, admin_perm FROM public.users;';

router.get('/customerorder', async(req, res) => {
    menuitems = []
    pool
    .query('SELECT * FROM food_item;')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            menuitems.push(query_res.rows[i]);
        }
        const data = {menuitems: menuitems};
            //console.log(inventory);
        res.render('customerorder.ejs', data);
    });
});

function randCashierNum(){
    var x = 'customer';
    return x;
}

function randDineIn(){
    var dineInResp = ["Yes", "No"];
    var x = Math.floor(Math.random() * 2);
    return dineInResp[x];
}
router.post('/submit', (req, res) => {
    var cashier_num = randCashierNum();
    var dineIn = randDineIn();
    const date = new Date();
    currentHours = date.getHours();
    currentHours = ("0" + currentHours).slice(-2);
    currentMin = date.getMinutes();
    currentMin = ("0" + currentMin).slice(-2);
    currentSec = date.getSeconds();
    currentSec = ("0" + currentSec).slice(-2);
    const timestamp = currentHours + ":" + currentMin + ":" + currentSec;
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let currentDate  = `${year}-${month}-${day}`;
    // console.log(req.body);
    const { cart } = req.body;
    //var ordernum = 118219;
    for(let i = 0; i < cart.length; i++) {
        for (let j = 0; j < cart[i].count; j++) {
        pool
            .query("INSERT INTO orders (order_num, order_date, order_time, order_item, order_price, dine_in, cashier_id) VALUES ((SELECT COALESCE(MAX(order_num), 0) + 1 FROM orders), '" + currentDate + "', '" + timestamp + "', '" + cart[i].name + "', " +  cart[i].price + ", '" + dineIn + "', " + cashier_num + ");");
        pool
            .query("UPDATE inventory SET quantity = quantity - 1 WHERE ingred_name IN (SELECT unnest(ingredients) AS item FROM food_item WHERE food_name = '" +  cart[i].name + "');");
        }    
    }
    
    let currentOrder = [];
    res.render('customerorder.ejs', { currentOrder: currentOrder });
});

	 	

module.exports = router;