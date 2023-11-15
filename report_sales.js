const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");

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

router.get('/report_sales.ejs', (req, res) => {
    res.render('report_sales', {result: null});
});



router.post('/report_sales', async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (!startDate || !endDate) {
        return res.status(400).send('Please provide both start and end dates.');
    }

    try {
        const sqlQuery = 'SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= $1 AND order_date <= $2 GROUP BY order_item ORDER BY item_total DESC';
        
        const result = await pool.query(sqlQuery, [startDate, endDate]);
    
        res.render('report_sales', {result: result.rows})
        console.log("Entry displayed successfully");
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;