const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getLogin = (req, res, next) => {
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    context = {
        page: 'Loginpage',
        errMessage: err_message,

    }
    res.render('authentication/login', context);
}



exports.getSignup = (req, res, next) => {
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    context = {
        page: 'Signuppage',
        errMessage: err_message,
    }
    res.render('authentication/signup',context);
}


exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username})
    .then(usr => {
        if(!usr) {
            req.flash('error', 'Sorry, your credentials were invalid');
            return res.redirect('/login');
        }
        bcrypt.compare(password, usr.password)
        .then(result => {
            if(!result) {
                req.flash('error', 'Sorry, your credentials were invalid');
                return res.redirect('/login');
            }
            
            req.session.isAdmin = usr.isAdmin;
            req.session.isLoggedIn = true;
            req.session.user = usr;
            req.session.save(err => {
                return res.redirect('/');
            })
        })

    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_pass = req.body.confirm_password;
    User.findOne({ 
        $or: [
        {username: username},
        {email: email},
        ],
    })
    .then(usr => {
        if (usr) {
            req.flash('error','A user with this username or email already exist!');
            return res.redirect('/signup');
        }
        if (password != confirm_pass) {
            req.flash('error', 'Your passwords did not match');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,13)
        .then(hashedPass => {
            const created_user = new User({
                username: username,
                email: email,
                password: hashedPass,
                isAdmin: false,
                rating: 5,
                cart: { items: [] }
            });
            return created_user.save();
        })
        .then(result => {
            res.redirect('/login');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });   
}