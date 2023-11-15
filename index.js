const express = require('express');
const dotenv = require('dotenv').config();

// Create express app
const index = express();
const port = 3000;
const path = require('path');
index.set('views', path.join(__dirname, 'views'));
index.use(express.static(__dirname + '/'));

const managerScreenRouter = require('./manager_screen');
index.use("/manager_screen", managerScreenRouter)

const cashierScreenRouter = require('./cashier');
index.use("/cashier", cashierScreenRouter)

const pool = require('./connection.js')
pool.connect();
	 	 	 	
index.set("view engine", "ejs");

index.get('/', (req, res) => {
    res.render('index');
});

index.get('/login_screen.ejs', (req, res) => {
    res.render('login_screen.ejs');
});

index.get('/cashier.ejs', (req, res) => {
    res.render('cashier.ejs');
});

index.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

