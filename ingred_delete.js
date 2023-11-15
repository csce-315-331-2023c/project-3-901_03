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
    res.render('ingred_delete');
});

router.post('/', (req, res) => {
    pool
        .query("DELETE FROM inventory WHERE ingred_name = '" + req.body.IngredientName + "';");
    res.render('ingred_delete');
});

module.exports = router;

