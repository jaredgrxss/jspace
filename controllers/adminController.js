const Product = require('../models/product');

exports.getApproveProducts = (req, res, next) => {
    Product.find({isApproved: false})
    .then(products => {
        let found_prods = products
        if(products.length == 0) {
            found_prods = undefined;
        }
        context = {
            page: 'Adminpage',
            allProds: found_prods,
        }
        res.render('admin/approve-product', context);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.denyProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteOne({_id: productId})
    .then(result => {
        res.redirect('/approve-products');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.productApproved = (req, res, next) => {
    const productId = req.body.productId;
    Product.findOne({_id: productId})
    .then(prod => {
        prod.isApproved = true;
        prod.save()
        .then(result => {
            res.redirect('/approve-products');
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}