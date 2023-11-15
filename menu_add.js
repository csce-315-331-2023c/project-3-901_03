const express = require('express');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

// Create express app
const router = express.Router(); //chnage to router
const port = 300;
const path = require('path');
const { query } = require('express');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const pool = require('./connection.js')
pool.connect();

router.get('/menu_add.ejs', (req, res) => {
    ingredients = []
    pool
    .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            ingredients.push(query_res.rows[i]);
        }
        const data = {ingredients: ingredients};
            //console.log(inventory);
        res.render('menu_add', data);
    });
});

router.post('/', (req, res) => {
    var cbox = req.body['ingredList']
    pool
        .query("INSERT INTO food_item (price_food, food_name, menu_type, ingredients, menu_time, description) VALUES (" + req.body.ItemPrice + ", '" + req.body.ItemName + "', '" + req.body.MenuType + "', '{" + req.body['ingredList'] + "}', '" + req.body.MenuTime + "', '" + req.body.ItemDesc + "');");

    res.render('menu_add');
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

