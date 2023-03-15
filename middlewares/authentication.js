module.exports = (req, res, next) => {
    if(req.session.isAuth != true) {
        res.redirect('/');
    }
}