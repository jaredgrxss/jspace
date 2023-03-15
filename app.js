const path = require('path');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoSessionStorage = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

MONGODB_URI = 'mongodb+srv://jaredgrxss:jared1939@seniorprojectdb.kfltxc7.mongodb.net/market?retryWrites=true&w=majority'
//storing sessions on our db
const store = new MongoSessionStorage({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

//templating engine setup
app.set('view engine', 'ejs');
app.set('views','./views');

//routes
const marketplace = require('./routes/market');
const authentication = require('./routes/authentication');
const admin = require('./routes/admin');
const errorPage = require('./controllers/error');

//parser to parse all request bodies
app.use(bodyparser.urlencoded({extended:false}));

//funnel request to search for static files here
app.use(express.static(path.join(__dirname,'public')));

//session middle-ware
app.use(session({secret: 'CSCI487SENIORPROJECTSECRETKEY', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

//local variables for sessions
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

//funnel request to search for routes
app.use(marketplace);
app.use(authentication);
app.use(admin);

//error 404 page
app.use('/', errorPage.Error);


mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(8000);
})
.catch(err => {
    console.log(err)
});