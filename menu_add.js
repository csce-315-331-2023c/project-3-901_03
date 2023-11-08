const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const index = express();
const port = 300;
const path = require('path');
index.set('views', path.join(__dirname, 'views'));
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({extended: true}));

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
	 	 	 	
index.set("view engine", "ejs");

index.get('/', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log(inventory);
            res.render('menu_add', data);
        });
});

index.post('/menuitem_add', (req, res) => {
    console.log("INSERT INTO food_item (price_food, food_name, menu_type, menu_time, description) VALUES (" + req.body.ItemPrice + ", '" + req.body.ItemName + "', '" + req.body.MenuType + "', '" + req.body.MenuTime + "', '" + req.body.ItemDesc + "');");
    // for (let i = 0; i < query_res.rowCount; i++) {
    //     teammembers.push(query_res.rows[i]);
    // }
    pool
        .query("INSERT INTO food_item (price_food, food_name, menu_type, menu_time, description) VALUES (" + req.body.ItemPrice + ", '" + req.body.ItemName + "', '" + req.body.MenuType + "', '" + req.body.MenuTime + "', '" + req.body.ItemDesc + "');");
    res.render('menu_add');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});