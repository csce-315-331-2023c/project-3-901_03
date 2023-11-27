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

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.use('/', router);
app.use(express.urlencoded({ extended: true}));

router.get('/report_together.ejs', (req, res) => {
    res.render('report_together', {result: null});
});

	 	 	
router.post('/report_together', async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.startDate;

    
    if (!startDate || !endDate) {
        return res.status(400).send('Please select a month to parse through.');
    }

    try {
        // COME BACK TO IT, DISPLAY TIME AND DATE CORRECTLY AS WELL AS THE ENTIRE LIST
        const sqlQuery = 'WITH PairedItems AS ( SELECT DISTINCT LEAST(o1.order_item, o2.order_item) AS item1, GREATEST(o1.order_item, o2.order_item) AS item2, o1.order_date, o1.order_time FROM orders o1 JOIN orders o2 ON o1.order_time = o2.order_time AND o1.order_date = o2.order_date AND o1.cashier_id = o2.cashier_id AND o1.order_num <> o2.order_num WHERE o1.order_date BETWEEN $1 AND $2) SELECT item1, item2, order_date, order_time FROM PairedItems ORDER BY ( SELECT COUNT(*) FROM PairedItems AS p WHERE item1 = p.item1 AND item2 = p.item2 ) DESC';
        
        
        const result = await pool.query(sqlQuery, [startDate, endDate]);

        res.render('report_together', {result: result.rows})
        console.log("Entry displayed successfully");
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;