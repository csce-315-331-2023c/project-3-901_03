const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 300;
const path = require('path');
const { query } = require('express');
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

// router.get('/menu_add.ejs', (req, res) => {
//     ingredients = []
//     pool
//     .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
//     .then(query_res => {
//         for (let i = 0; i < query_res.rowCount; i++){
//             ingredients.push(query_res.rows[i]);
//         }
//         const data = {ingredients: ingredients};
  
//         //console.log(inventory);
//         res.render('menu_add', data);
//     });
// });

router.post('/', async(req, res) => {
  var cbox = req.body['ingredList']
  await pool
      .query("INSERT INTO food_item (price_food, food_name, menu_type, ingredients, menu_time, description) VALUES (" + req.body.ItemPrice + ", '" + req.body.ItemName + "', '" + req.body.MenuType + "', '{" + req.body['ingredList'] + "}', '" + req.body.MenuTime + "', '" + req.body.description + "');");
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
  //res.render('menu_add');
});

{/* <script>console.log("script start")</script>
<% for (var i in ingredients) {%>
  <script>
    console.log("hi")
  const cb = document.querySelector('#<%=ingredients[i].ingred_name%>');
  
  if (cb.checked) {
    console.log(cb)
    ingredFinal.push(ingredients[i].ingred_name);
  }
  </script>
<% } %>  */}

module.exports = router;

