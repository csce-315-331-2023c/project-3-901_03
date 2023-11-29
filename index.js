const express = require('express');
const dotenv = require('dotenv').config();
const passport = require('passport');
const google = require('./google');

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

const managerScreenRouter = require('./manager_screen');
index.use("/manager_screen", managerScreenRouter)

const cashierScreenRouter = require('./cashier');
index.use("/cashier", cashierScreenRouter)

const menuScreenRouter = require('./menu');
index.use("/menu", menuScreenRouter)

const pool = require('./connection.js')
pool.connect();
	 	 	 	
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

