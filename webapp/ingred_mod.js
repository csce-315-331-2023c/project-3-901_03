const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const app = express();
const port = 3300;
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
    inventory = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log(inventory);
            res.render('ingred_mod', data);
        });
});

app.post('/ingred_mod_name', (req, res) => {
    pool
        .query("UPDATE inventory SET ingred_name = '" + req.body.NewItemName + "' WHERE ingred_name = '"
        + req.body.ItemName + "';");
    res.render('ingred_mod');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});