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

router.get('/menu_delete.ejs', (req, res) => {
    menuItems = []
    pool
        .query('SELECT * FROM food_item ORDER BY food_name ASC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menuItems.push(query_res.rows[i]);
            }
            const data = {menuItems: menuItems};
            //console.log(inventory);
            res.render('menu_delete', data);
        });
});

router.post('/', (req, res) => {
    pool
        .query("DELETE FROM food_item WHERE food_name = '" + req.body.ItemName + "';");
    res.render('menu_delete');
});

module.exports = router;