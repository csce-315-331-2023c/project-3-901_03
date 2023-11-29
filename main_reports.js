const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const pool = require('./connection.js')
pool.connect();

app.use('/', router);
app.use(express.urlencoded({ extended: true}));

router.get('/main_reports.ejs', (req, res) => {
    res.render('main_reports', {result: null});
});

	 	 	
router.post('/main_reports/submit', async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    let result;
    
    if (!startDate || !endDate) {
        return res.status(400).send('Please provide both start and end dates.');
    }

    if (req.body.button === 'sales') {
        try {
            const sqlQuery = 'SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN $1 AND $2 GROUP BY i.ingred_name';
            
            result = await pool.query(sqlQuery, [startDate, endDate]);
    
            res.render('report_restock', {result: result.rows})
            console.log("Entry displayed successfully");
        } catch (error) {
            console.error('Error executing SQL query for Sales Report:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});



module.exports = router;