const express = require('express');
const dotenv = require('dotenv').config();

// Create express app
const index = express();
const port = 3000;
const path = require('path');
index.set('views', path.join(__dirname, 'views'));

const ingredModRouter = require('./ingred_mod_name');
index.use("/ingred_mod_name", ingredModRouter)
const ingredAddRouter = require('./ingred_add');
index.use("/ingred_add", ingredAddRouter)
const ingredDeleteRouter = require('./ingred_delete');
index.use("/ingred_delete", ingredDeleteRouter)
const menuAddRouter = require('./menu_add');
index.use("/menu_add", menuAddRouter)
const menuDeleteRouter = require('./menu_delete');
index.use("/menu_delete", menuDeleteRouter)
const menuNameRouter = require('./menu_mod_name');
index.use("/menu_mod_name", menuNameRouter)
const menuPriceRouter = require('./menu_mod_price');
index.use("/menu_mod_price", menuPriceRouter)

const pool = require('./connection.js')
pool.connect();
	 	 	 	
index.set("view engine", "ejs");

index.get('/', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log(inventory);
            res.render('index', data);
        });
});

index.get('/modify_ingred.ejs', (req, res) => {
    res.render('modify_ingred.ejs');
});

index.get('/modify_menu.ejs', (req, res) => {
    res.render('modify_menu.ejs');
});

index.get('/reports.ejs', (req, res) => {
    res.render('reports.ejs');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

