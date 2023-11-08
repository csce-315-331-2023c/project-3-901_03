const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const app = express();
const port = 3600;
const path = require('path');
//app.set('views', path.join(__dirname, '.\views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: true
 }));

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
	 	 	 	
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('menu_mod_price');
});

app.post('/mod_menu_price', (req, res) => {
    pool
        .query("UPDATE food_item SET price_food = '" + req.body.MenuItemPrice + "' WHERE food_name = '"
        + req.body.MenuItemName + "';");
    res.render('menu_mod_price');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});