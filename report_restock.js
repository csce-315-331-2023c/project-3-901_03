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
require('events').EventEmitter.defaultMaxListeners = 30;

require('events').EventEmitter.defaultMaxListeners = 30;

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

router.get('/main_reports.ejs', (req, res) => {
    res.render('main_reports', {result: null});
});

	 	 	
router.post('/', async (req, res) => {
    try {
        const sqlQuery = 'SELECT ingred_name, quantity FROM inventory WHERE quantity <= 30 ORDER BY quantity ASC';
        
        const result = await pool.query(sqlQuery);

        res.render('report_restock', {result: result.rows})
        console.log("Entry displayed successfully");
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;