const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const passport = require('passport');
const google = require('./google');

var bodyParser = require("body-parser");

let currentUser = "NA";
// Create express app
const index = express();
const port = 3000;
const path = require('path');
index.set('views', path.join(__dirname, 'views'));
index.use(express.static(__dirname + '/'));

index.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
index.use(passport.initialize());
index.use(passport.session());

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// // Add process hook to shutdown pool
// process.on('SIGINT', function() {
//     pool.end();
//     console.log('Application successfully shutdown');
//     process.exit(0);
// });

const managerScreenRouter = require('./manager_screen');
index.use("/manager_screen", managerScreenRouter)

const cashierScreenRouter = require('./cashier');
index.use("/cashier", cashierScreenRouter)

const menuScreenRouter = require('./menu');
index.use("/menu", menuScreenRouter)

const seasonalmenuScreenRouter = require('./seasonalmenu');
index.use("/seasonalmenu", seasonalmenuScreenRouter)

const breakfastmenuScreenRouter = require('./breakfastmenu');
index.use("/breakfastmenu", breakfastmenuScreenRouter)

const sweetmenuScreenRouter = require('./sweetmenu');
index.use("/sweetmenu", sweetmenuScreenRouter)

const savorymenuScreenRouter = require('./savorymenu');
index.use("/savory", savorymenuScreenRouter)

const drinksmenuScreenRouter = require('./drinksmenu');
index.use("/drinksmenu", drinksmenuScreenRouter)

// const pool = require('./connection.js')
// pool.connect();
	 	 	 	
index.set("view engine", "ejs");

index.get('/', (req, res, next) => { 
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    res.render('index', {currentUser: currentUser});
});

index.get('/login_screen.ejs', (req, res) => {
    res.render('login_screen.ejs');
});

index.get('/menu.ejs', (req, res) => {
    res.render('menu.ejs');
});

index.get('/seasonalmenu.ejs', (req, res) => {
    seasonal = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Seasonal Item';")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                seasonal.push(query_res.rows[i]);
            }
            const data = {seasonal: seasonal};
            //console.log(inventory);
            res.render('seasonalmenu.ejs', data);
    });
});

index.get('/breakfastmenu.ejs', (req, res) => {
    res.render('breakfastmenu.ejs');
});

index.get('/sweetmenu.ejs', (req, res) => {
    res.render('sweetmenu.ejs');
});

index.get('/savorymenu.ejs', (req, res) => {
    res.render('savorymenu.ejs');
});

index.get('/drinksmenu.ejs', (req, res) => {
    res.render('drinksmenu.ejs');
});

index.get('/cashier2.ejs', (req, res) => {
    let currentOrder = [];
    res.render('cashier2.ejs', { currentOrder: currentOrder });
});

index.get('/api/auth/google/redirect', passport.authenticate('google'),  (req, res) => {
    res.redirect('/');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

