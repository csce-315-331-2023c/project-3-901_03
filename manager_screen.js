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

const ingredModRouter = require('./ingred_mod_name');
router.use("/ingred_mod_name", ingredModRouter)
const ingredAddRouter = require('./ingred_add');
router.use("/ingred_add", ingredAddRouter)
const ingredDeleteRouter = require('./ingred_delete');
router.use("/ingred_delete", ingredDeleteRouter)
const menuAddRouter = require('./menu_add');
router.use("/menu_add", menuAddRouter)
const menuDeleteRouter = require('./menu_delete');
router.use("/menu_delete", menuDeleteRouter)
const menuNameRouter = require('./menu_mod_name');
router.use("/menu_mod_name", menuNameRouter)
const menuPriceRouter = require('./menu_mod_price');
router.use("/menu_mod_price", menuPriceRouter)
const orderHistoryRouter = require('./order_history');
router.use("/order_history", orderHistoryRouter)
const restockReportRouter = require('./report_restock');
router.use("/report_restock", restockReportRouter)
const saleReportRouter = require('./report_sales');
router.use("/report_sales", saleReportRouter)
const togetherReportRouter = require('./report_ordered_together');
router.use("/report_ordered_together", togetherReportRouter)

	 	 	 	
//index.set('views', path.join(__dirname, 'views'));
	 	 	 	
//router.set("view engine", "ejs");

router.get('/manager_screen.ejs', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log(inventory);
            res.render('manager_screen.ejs', data);
        });
});

router.get('/modify_ingred.ejs', (req, res) => {
    res.render('modify_ingred.ejs');
});

router.get('/modify_menu.ejs', (req, res) => {
    res.render('modify_menu.ejs');
});

router.get('/reports.ejs', (req, res) => {
    res.render('reports.ejs');
});

module.exports = router;

