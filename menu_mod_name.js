const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3600;
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
	 	 	 	
// router.get('/menu_mod_name.ejs', (req, res) => {
//     menuItems = []
//     pool
//         .query('SELECT * FROM food_item ORDER BY food_name ASC;')
//         .then(query_res => {
//             for (let i = 0; i < query_res.rowCount; i++){
//                 menuItems.push(query_res.rows[i]);
//             }
//             const data = {menuItems: menuItems};
//             //console.log(inventory);
//             res.render('menu_mod_name', data);
//         });
// });

router.post('/', async(req, res) => {
    await pool
        .query("UPDATE food_item SET food_name = '" + req.body.NewMenuItemName + "' WHERE food_name = '"
        + req.body.MenuItemName + "';");
    try {
        // Assuming you have a table named 'items' with columns 'name' and 'description'
        const queryArray1 = 'SELECT * FROM food_item ORDER BY food_name ASC;';
        const queryArray2 = 'SELECT * FROM inventory ORDER BY ingred_name ASC;';
    
        const resultArray1 = await pool.query(queryArray1);
        const resultArray2 = await pool.query(queryArray2);
    
        const menuItems = resultArray1.rows;
        const ingredients = resultArray2.rows;
        res.render('modify_menu.ejs', { menuItems, ingredients });
    } 
    catch (error) {
        console.error('Error fetching data from PostgreSQL:', error);
        res.status(500).send('Internal Server Error');
    }
    //res.render('menu_mod_name');
});

module.exports = router;