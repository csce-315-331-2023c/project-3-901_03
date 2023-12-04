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
	 	 	 	
router.get('/customerorder.ejs', (req, res) => {
    res.render('customerorder.ejs');
});

module.exports = router;