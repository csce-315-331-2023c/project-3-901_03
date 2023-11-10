const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
//index.set('views', path.join(__dirname, 'views'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

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
	 	 	 	
router.get('/ingred_add.ejs', (req, res) => {
    res.render('ingred_add');
});

router.post('/ingred_add', (req, res) => {
    // console.log("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    pool
        .query("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    res.render('ingred_add');
});

module.exports = router;