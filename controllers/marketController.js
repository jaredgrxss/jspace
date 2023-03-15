exports.getIndex = (req,res,next) => {
    context = {
        page: 'Homepage',
    }
    res.render('index',context);
}