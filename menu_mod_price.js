const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 3600;
const path = require('path');
//app.set('views', path.join(__dirname, '.\views'));
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
	 	 	 	
router.get('/menu_mod_price.ejs', (req, res) => {
    res.render('menu_mod_price');
});

router.post('/menu_mod_price.ejs', (req, res) => {
    pool
        .query("UPDATE food_item SET price_food = '" + req.body.MenuItemPrice + "' WHERE food_name = '"
        + req.body.MenuItemName + "';");
    res.render('menu_mod_price');
});

module.exports = router;
