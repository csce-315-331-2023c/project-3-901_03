const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const passport = require('passport');
const google = require('./google');

var bodyParser = require("body-parser");
const fetch = require("node-fetch");

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

const customerScreenRouter = require('./customerorder');
index.use("/customerorder", customerScreenRouter)

const adminScreenRouter = require('./admin');
index.use("/admin", adminScreenRouter)

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

    //getting weather data
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();
    let currentDate  = `${year}-${month}-${day}`;
    let weather_req = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/College Station/${currentDate}?key=VJJGNCLMUX552BNFYVJ9RYCNS`;
    // var weather_data;
    fetch(weather_req, {
    method: 'GET', 
    headers: {
    
    },
            
    }).then(response => {
    if (!response.ok) {
        throw response; //check the http response code and if isn't ok then throw the response as an error
    }
                
    return response.json(); //parse the result as JSON

    }).then(response => {
    //response now contains parsed JSON ready for use
    var {tempmax, tempmin, current_temp, icon} = processWeatherData(response);
    //console.log(tempmax + " " + tempmin + " " + current_temp + " " + icon);
    res.render('index', {currentUser: currentUser, tempmax: tempmax, tempmin: tempmin, current_temp: current_temp, icon: icon});

    }).catch((errorResponse) => {
    if (errorResponse.text) { //additional error information
        errorResponse.text().then( errorMessage => {
        //errorMessage now returns the response body which includes the full error message
        })
    } else {
        //no additional error information 
    } 
    });

    function processWeatherData(response) {
    
        var location=response.resolvedAddress;
        var days=response.days;
        var current = response.currentConditions;
        var icon = response.icon;
        console.log("Location: "+location);
        console.log("current: " + current.temp);
        var tempmax; 
        var tempmin;
        var icon;
        var current_temp = current.temp;
        for (var i=0;i<days.length;i++) {
            tempmax = days[i].tempmax;
            tempmin = days[i].tempmin;
            icon = days[i].icon;
        //console.log(days[i].datetime+": tempmax="+tempmax+", tempmin="+ tempmin + ", icon=" + icon);
        }
        return {
            tempmax,
            tempmin,
            current_temp,
            icon
        };
    }
    
});

index.get('/login_screen.ejs', (req, res) => {
    res.render('login_screen.ejs');
});

index.get('/menu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }
    res.render('menu.ejs', {currentUser: currentUser});
});

index.get('/seasonalmenu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    seasonal = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Seasonal Item' ORDER BY food_name ASC;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                seasonal.push(query_res.rows[i]);
            }
            const data = {seasonal: seasonal};
            //console.log(inventory);
            res.render('seasonalmenu.ejs', {data, currentUser: currentUser});
    });
});

index.get('/breakfastmenu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    breakfast = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Breakfast' ORDER BY food_name ASC;;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                breakfast.push(query_res.rows[i]);
            }
            const data = {breakfast: breakfast};
            //console.log(inventory);
            res.render('breakfastmenu.ejs', {data, currentUser: currentUser});
    });
});

index.get('/sweetmenu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    sweet = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Sweet Crepes' ORDER BY food_name ASC;;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sweet.push(query_res.rows[i]);
            }
            const data = {sweet: sweet};
            //console.log(inventory);
            res.render('sweetmenu.ejs', {data, currentUser: currentUser});
    });
});

index.get('/savorymenu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    savory = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Savory Crepes' ORDER BY food_name ASC;;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                savory.push(query_res.rows[i]);
            }
            const data = {savory: savory};
            //console.log(inventory);
            res.render('savorymenu.ejs', {data, currentUser: currentUser});
    });
});

index.get('/drinksmenu.ejs', (req, res) => {
    if(req.session.passport != null && req.session.passport.user != null && req.session.passport.user.googleProfile != null) {
        console.log("index req.session.passport.user.googleProfile");      
        console.log(req.session.passport.user.googleProfile.id);   
        console.log(req.session.passport.user.googleProfile.displayName);   
        currentUser = req.session.passport.user.googleProfile.displayName;
    }

    drinks = []
    pool
        .query("SELECT * FROM food_item WHERE menu_type = 'Drink' ORDER BY food_name ASC;;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                drinks.push(query_res.rows[i]);
            }
            const data = {drinks: drinks};
            //console.log(inventory);
            res.render('drinksmenu.ejs', {data, currentUser: currentUser});
    });
});

index.get('/customerorder.ejs', async(req, res) => {
    let currentOrder = [];
    res.render('customerorder.ejs', { currentOrder: currentOrder });
});


// index.get('/cashier2.ejs', (req, res) => {
//     let currentOrder = [];
//     console.log('renderrrrrr');
//     res.render('cashier2.ejs', { currentOrder: currentOrder });
// });

index.get('/api/auth/google/redirect', passport.authenticate('google'),  (req, res) => {
    res.redirect('/');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

