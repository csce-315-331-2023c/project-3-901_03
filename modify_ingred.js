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
// const togetherReportRouter = require('./report_ordered_together');
// router.use("/report_ordered_together", togetherReportRouter)

	 	 	 	
//index.set('views', path.join(__dirname, 'views'));
	 	 	 	
//router.set("view engine", "ejs");



// router.get('/modify_ingred.ejs', (req, res) => {
//     inventory = []
//     pool
//         .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
//         .then(query_res => {
//             for (let i = 0; i < query_res.rowCount; i++){
//                 inventory.push(query_res.rows[i]);
//             }
//             const data = {inventory: inventory};
//             //console.log(inventory);
//             res.render('modify_ingred.ejs', data);
//         });
// });



router.get('/index.ejs', (req, res) => {
    res.render('index.ejs');
});

module.exports = router;

