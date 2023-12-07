const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const pool = require('./connection.js')
pool.connect();
	 	 	 	

// router.get('/ingred_mod_name.ejs', (req, res) => {
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

router.post('/', async(req, res) => {
    await pool
        .query("DELETE FROM users WHERE user_name = '" + req.body.UserName + "';");
    
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

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = router;