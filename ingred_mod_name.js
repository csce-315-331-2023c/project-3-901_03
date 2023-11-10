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
	 	 	 	
// router.set("view engine", "ejs");

// router.get('/', (req, res) => {
//     inventory = []
//     pool
//         .query('SELECT * FROM inventory;')
//         .then(query_res => {
//             for (let i = 0; i < query_res.rowCount; i++){
//                 inventory.push(query_res.rows[i]);
//             }
//             const data = {inventory: inventory};
//             //console.log(inventory);
//             res.render('ingred_mod', data);
//         });
// });

router.get('/ingred_mod_name.ejs', (req, res) => {
    res.render('ingred_mod_name.ejs');
});

router.post('/ingred_mod_name', (req, res) => {
    pool
        .query("UPDATE inventory SET ingred_name = '" + req.body.NewItemName + "' WHERE ingred_name = '"
        + req.body.ItemName + "';");
    res.render('ingred_mod_name');
});

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = router;