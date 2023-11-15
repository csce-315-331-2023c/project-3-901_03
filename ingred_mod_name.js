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
	 	 	 	

router.get('/ingred_mod_name.ejs', (req, res) => {
    res.render('ingred_mod_name');
});

router.post('/', (req, res) => {
    pool
        .query("UPDATE inventory SET ingred_name = '" + req.body.NewItemName + "' WHERE ingred_name = '"
        + req.body.ItemName + "';");
    res.render('ingred_mod_name');
});

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

module.exports = router;