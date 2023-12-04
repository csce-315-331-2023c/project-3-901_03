const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
//index.set('views', path.join(__dirname, 'views'));
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
	 	 	 	
router.post('/', async(req, res) => {
        if (req.body.Perm == "cashier") {
            await ool
                .query("INSERT INTO users VALUES ('" + req.body.UserName + "', 'Yes', 'No', 'No');");
        }
        else if (req.body.Perm == "manager") {
            await pool
                .query("INSERT INTO users VALUES ('" + req.body.UserName + "', 'Yes', 'Yes', 'No');");
        }
        else if (req.body.Perm == "admin") {
            await pool
                .query("INSERT INTO users VALUES ('" + req.body.UserName + "', 'Yes', 'Yes', 'Yes');");
        }
        users = []
        await pool
        .query('SELECT * FROM users ORDER BY user_name ASC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                users.push(query_res.rows[i]);
            }
            const data = {users: users};
            //console.log(inventory);
            res.render('admin.ejs', data);
        });
});

module.exports = router;