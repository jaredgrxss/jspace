const Product = require('../models/product');
const fileHelper = require('../util/file');

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
    Product.findById(productId)
    .then(product => {
        fileHelper.deleteFile(product.imageUrl1);
        fileHelper.deleteFile(product.imageUrl2);
        fileHelper.deleteFile(product.imageUrl3);
        fileHelper.deleteFile(product.imageUrl4);
        return product.delete();
    })
    //Product.deleteOne({_id: productId})
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