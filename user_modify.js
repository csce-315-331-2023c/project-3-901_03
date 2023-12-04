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
    pool
        .query("UPDATE inventory SET ingred_name = '" + req.body.NewItemName + "' WHERE ingred_name = '"
        + req.body.ItemName + "';");
        //console.log("Here in mod name!");
        inventory = []
            pool
                .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
                .then(query_res => {
                    for (let i = 0; i < query_res.rowCount; i++){
                        inventory.push(query_res.rows[i]);
                    }
                    const data = {inventory: inventory};
                    //console.log(inventory);
                    res.render('admin.ejs', data);
                });
        //res.redirect('modify_ingred.ejs');
  
});

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = router;