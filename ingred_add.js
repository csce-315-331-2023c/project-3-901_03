const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
//index.set('views', path.join(__dirname, 'views'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const pool = require('./connection.js')
pool.connect();
	 	 	 	
// router.get('/ingred_add.ejs', (req, res) => {
//     res.render('ingred_add.ejs');
// });

router.post('/', (req, res) => {
    // console.log("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    pool
        .query("INSERT INTO inventory VALUES ('" + req.body.IngredName + "', " + req.body.quantity + ", " + req.body.price + ", '" + req.body.startDate + "', '" + req.body.endDate + "', '" + req.body.storageMethod + "');");
    
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