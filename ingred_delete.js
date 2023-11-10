const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

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
	 	 	 	
router.get('/ingred_delete.ejs', (req, res) => {
    res.render('ingred_delete');
});

router.post('/delete', (req, res) => {
    console.log("DELETE FROM inventory WHERE ingred_name = '" + req.body.IngredientName + "';");
    pool
        .query("DELETE FROM inventory WHERE ingred_name = '" + req.body.IngredientName + "';");
    res.render('ingred_delete');
});

module.exports = router;

