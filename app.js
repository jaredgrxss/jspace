const path = require('path');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoSessionStorage = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

MONGODB_URI = 'mongodb+srv://jaredgrxss:jared1939@seniorprojectdb.kfltxc7.mongodb.net/market?retryWrites=true&w=majority'
//storing sessions on our db
const store = new MongoSessionStorage({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

// setting image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
});

// filtering files by mime type
const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg') {
            cb(null, true);
    } else {
        cb(null, false);
    } 
}

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

//parser to parse non url encoded files (images)
app.use(multer({storage: storage, fileFilter: imageFilter}).array('images', 4));

//funnel request to search for static files here
app.use(express.static(path.join(__dirname,'public')));

// search for static user uploaded images here
app.use('/images', express.static(path.join(__dirname,'images')));

//session middle-ware
app.use(session({secret: 'CSCI487SENIORPROJECTSECRETKEY', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

//local variables for sessions
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

//funnel request to search for routes
app.use(marketplace);
app.use(authentication);
app.use(admin);


app.get('/500', errorPage.Error500);
//error 404 page
app.use('/', errorPage.Error);

app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500');
})
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(8000);
})
.catch(err => {
    console.log(err)
});