const path = require('path');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//templating engine setup
app.set('view engine', 'ejs');
app.set('views','./views');

//routes
const marketplace = require('./routes/market');
const errorPage = require('./controllers/error');

//parser to parse all request bodies
app.use(bodyparser.urlencoded({extended:false}));

//funnel request to search for static files here
app.use(express.static(path.join(__dirname,'public')));

//funnel request to search for routes
app.use(marketplace);

//error 404 page
app.use('/', errorPage.Error);

mongoose.connect('mongodb+srv://jaredgrxss:jared1939@seniorprojectdb.kfltxc7.mongodb.net/market?retryWrites=true&w=majority')
.then(result => {
    app.listen(8000);
})
.catch(err => console.log(err));