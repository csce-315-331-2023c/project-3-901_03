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
	 	 	 	
router.get('/ingred_delete.ejs', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log(inventory);
            res.render('ingred_delete', data);
        });
});

router.post('/', (req, res) => {
    pool
        .query("DELETE FROM inventory WHERE ingred_name = '" + req.body.IngredientName + "';");
        inventory = []
        pool
            .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++){
                    inventory.push(query_res.rows[i]);
                }
                const data = {inventory: inventory};
                //console.log(inventory);
                res.render('modify_ingred.ejs', data);
            });
});

module.exports = router;

