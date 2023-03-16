module.exports = (req, res, next) => {
    if(req.session.isLoggedIn != true && req.session.isAdmin != true) {
        return res.redirect('/');
    }
    next();
}