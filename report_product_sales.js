const express = require('express');
const app = express();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');

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

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.use('/', router);
app.use(express.urlencoded({ extended: true}));

router.get('/report_product_sales.ejs', (req, res) => {
    res.render('report_product_sales', {result: null});
});

	 	 	
router.post('/report_product_sales', async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    
    if (!startDate || !endDate) {
        return res.status(400).send('Please provide both start and end dates.');
    }

    try {
        const sqlQuery = 'SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN $1 AND $2 GROUP BY i.ingred_name';
        
        const result = await pool.query(sqlQuery, [startDate, endDate]);

        res.render('report_product_sales', {result: result.rows})
        console.log("Entry displayed successfully");
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;