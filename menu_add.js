const express = require('express');
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

const pool = require('./connection.js')
pool.connect();

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
      .query("INSERT INTO food_item (price_food, food_name, menu_type, ingredients, menu_time, description) VALUES (" + req.body.ItemPrice + ", '" + req.body.ItemName + "', '" + req.body.MenuType + "', '{" + req.body['ingredList'] + "}', '" + req.body.MenuTime + "', '" + req.body.ItemDesc + "');");
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

