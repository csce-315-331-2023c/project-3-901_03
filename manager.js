const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const app = express();
const port = 3000;
const path = require('path');
app.set('views', path.join(__dirname, '.\views'));
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

app.get('/ingred_add.ejs', (req, res) => {
    res.render('ingred_add.ejs');
});

app.get('/ingred_delete.ejs', (req, res) => {
    res.render('ingred_delete.ejs');
});

app.get('/ingred_mod_name.ejs', (req, res) => {
    res.render('ingred_mod_name.ejs');
});

app.get('/ingred_delete.ejs', (req, res) => {
    res.render('ingred_delete.ejs');
});

app.get('/order_history.ejs', (req, res) => {
    // COME BACK TO IT, DISPLAY TIME AND DATE CORRECTLY AS WELL AS THE ENTIRE LIST
    res.render('order_history.ejs');
});

app.get('/report_restock.ejs', (req, res) => {
    res.render('report_restock.ejs');
});

app.post('/ingredient_add', (req, res) => {
    console.log("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    pool
        .query("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    res.render('ingred_add');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
