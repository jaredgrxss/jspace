exports.Error = (req,res,next) => {
    context = {
    }
    res.status(404).render('404',context);
};


exports.Error500 = (req, res, next) => {
    context = {
        page: "Error",
    }
    res.render('500', context);
}