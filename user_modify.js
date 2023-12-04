const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

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

router.post('/', (req, res) => {
    if (req.body.Perm == "cashier") {
        pool
            .query("UPDATE users SET cashier_perm = 'Yes', manager_perm = 'No', admin_perm = 'No' WHERE user_name = '" + req.body.UserName + "';");
    }
    else if (req.body.Perm == "manager") {
        pool
            .query("UPDATE users SET cashier_perm = 'Yes', manager_perm = 'Yes', admin_perm = 'No' WHERE user_name = '" + req.body.UserName + "';");
    }
    else if (req.body.Perm == "admin") {
        pool
            .query("UPDATE users SET cashier_perm = 'Yes', manager_perm = 'Yes', admin_perm = 'Yes' WHERE user_name = '" + req.body.UserName + "';");
    }
    res.render('admin.ejs');
});

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = router;