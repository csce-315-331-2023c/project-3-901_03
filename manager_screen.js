const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
var bodyParser = require("body-parser");
var async = require('async');

// Create express app
const router = express.Router(); //chnage to router
const port = 3000;
const path = require('path');
//index.set('views', path.join(__dirname, 'views'));
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

const ingredModRouter = require('./ingred_mod_name');
router.use("/ingred_mod_name", ingredModRouter)
const ingredAddRouter = require('./ingred_add');
router.use("/ingred_add", ingredAddRouter)
const ingredDeleteRouter = require('./ingred_delete');
router.use("/ingred_delete", ingredDeleteRouter)
const ingredRestockRouter = require('./ingred_restock');
router.use("/ingred_restock", ingredRestockRouter)
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
const togetherReportRouter = require('./report_together');
router.use("/report_together", togetherReportRouter)
const togetherProductSalesRouter = require('./report_product_sales');
router.use("/report_product_sales", togetherProductSalesRouter)
const excessReportRouter = require('./report_excess');
router.use("/report_excess", excessReportRouter)

	 	 	 	
//index.set('views', path.join(__dirname, 'views'));
	 	 	 	
//router.set("view engine", "ejs");

router.get('/manager_screen.ejs', (req, res) => {
    employees = []
    pool
        .query('SELECT * FROM employees ORDER BY employee_type DESC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                employees.push(query_res.rows[i]);
            }
            const data = {employees: employees};
            //console.log(inventory);
            res.render('manager_screen.ejs', data);
        });
});

router.get('/modify_ingred.ejs', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory ORDER BY ingred_name ASC;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            //console.log('in manager_screen.js get function');
            res.render('modify_ingred.ejs', data);
        });
});

router.get('/modify_menu.ejs', async(req, res) => {
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
});

router.get('/main_reports.ejs', async (req, res) => {
        const sqlquery = "SELECT ROW_NUMBER() OVER (ORDER BY order_date DESC, order_time DESC) AS row_num, order_date, order_time, STRING_AGG(DISTINCT order_item, ', ' ORDER BY order_item) AS order_items, MAX(order_price) AS order_price, MAX(dine_in) AS dine_in, cashier_id FROM orders GROUP BY order_date, order_time, cashier_id ORDER BY order_date DESC, order_time DESC LIMIT 100"
        const result = await pool.query(sqlquery);

        res.render('main_reports', {result: result.rows})
});

router.get('/index.ejs', (req, res) => {
    res.render('index.ejs');
});

router.get('/logout', (req, res) => {
    console.log("logoutStarting...");     
    let previousUser = null;
    if(req.session != null && req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        previousUser = req.session.passport.user.googleProfile.displayName;
    }
       
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                console.log("logout error");           
            }
            else {
                console.log("logout ok");           
            }
        })
    }    
    if(req.session != null && req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }
    else {
        currentUser = previousUser;
    }    
    res.render('logout.ejs', {currentUser: currentUser});
});

module.exports = router;

