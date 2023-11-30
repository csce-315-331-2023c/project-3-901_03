const express = require('express');
const app = express();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');

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

app.use('/', router);
app.use(express.urlencoded({ extended: true}));

router.get('/main_reports.ejs', (req, res) => {
    res.render('main_reports', {result: null});
});

	 	 	
router.post('/', async (req, res) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    
    if (!startDate || !endDate) {
        return res.status(400).send('Please provide both start and end dates.');
    }

    try {
        const sqlQuery = 'SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN $1 AND $2 GROUP BY i.ingred_name';
        console.log("inside the try block");

        const result = await pool.query(sqlQuery, [startDate, endDate]);
        let ingredients = [];
        let quantities = [];
        let amountSold = [];
        let soldIngredNames = [];
        let soldUsages = [];
        let startQuantity = 100;
        let name = [];

        for (const row of result.rows) {
            name = row.ingred_name;
            ingredients.push(name);
            quantities.push(startQuantity);
        }

        for (const row of result.rows){
            const ingredName = row.ingred_name;
            const amount = row.total_usage;
            soldIngredNames.push(ingredName);
            soldUsages.push(parseInt(amount, 10));
        }
        for(let i = 0 ; i < quantities.length; i++){
            amountSold.push(0);
            console.log("inside the amount sold for loop");
        }

        for(let i = 0; i < soldIngredNames.length; i++){
            for(let j = 0; j < ingredients.length; j++){
                if(ingredients[j] === soldIngredNames[i]){
                    const usage = soldUsages[i];
                    const currQuantity = quantities[i] - usage;
                    
                    quantities[j] = currQuantity;
                    amountSold[j] = usage;
                    console.log("inside the curr quanity loop");
                }
                
            }
        }

        //now calculate the inventory items that sold less than 10% of their inventory
        let text = "";
        for(let i = 0 ; i < ingredients.length; i++){
            console.log("inside the for loop");
            console.log(amountSold[i]);
            console.log(0.1 * startQuantity);
            if(amountSold[i] < (0.1*startQuantity)){
                text += ingredients[i] + " " + quantities[i] + '\n';
                console.log("inside of the if in text loop");
            }
        }

        if (text.length === 0){
            text = "No excess items in this time window \n";
        }

        res.render('report_excess', {text: text.rows})
        console.log("Entry displayed successfully");
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;