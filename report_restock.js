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

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	
// router.get('/report_restock.ejs', (req, res) => {
//     ingredients = []
//     pool
//         .query("SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN '" + req.body.startDate + "' AND '" + req.body.endDate + "' GROUP BY i.ingred_name;")
//         .then(query_res => {
//             for (let i = 0; i < query_res.rowCount; i++){
//                 ingredients.push(query_res.rows[i]);
//             }
//             const data = {ingredients: ingredients};
//             //console.log(inventory);
//             res.render('report_restock', data);
//         });
// });

router.get('/report_retock.ejs', (req, res) => {
    res.render('report_restock.ejs');
});

module.exports = router;