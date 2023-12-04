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
let currentUser = "NA";

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

const userModRouter = require('./user_modify');
router.use("/user_modify", userModRouter)
const userAddRouter = require('./user_add');
router.use("/user_add", userAddRouter)
const userDeleteRouter = require('./user_delete');
router.use("/user_delete", userDeleteRouter)
//index.set('views', path.join(__dirname, 'views'));
	 	 	 	
//router.set("view engine", "ejs");
const userQuery = 'SELECT user_name, cashier_perm, manager_perm, admin_perm FROM public.users;';

router.get('/admin.ejs', async(req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) { 
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    isAuthorized = false;
    await pool
        .query(userQuery)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){   
                if(query_res.rows[i].user_name === currentUser && (query_res.rows[i].admin_perm === "Yes"))
                {
                    isAuthorized = true;
                    console.log("isAuthorized = true=" +isAuthorized);                     
                }
            }
        });      


    console.log("isAuthorized=" + isAuthorized);       
    if(!isAuthorized) {
        res.render('unauthorized_manager.ejs', {currentUser: currentUser, currentScreen: "admin"});
    }
    else {
        users = []
        pool
            .query('SELECT * FROM users ORDER BY user_name ASC;')
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++){
                    users.push(query_res.rows[i]);
                }
                const data = {users: users};
                //console.log(inventory);
                res.render('admin.ejs', data);
            });
        }
});

router.get('/', (req, res) => {
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
