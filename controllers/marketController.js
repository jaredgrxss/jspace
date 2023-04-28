const Product = require('../models/product');
const user = require('../models/user');
const User = require('../models/user');
const fileHelper = require('../util/file');

exports.getIndex = (req,res,next) => {
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    context = {
        page: 'Homepage',
        errMessage: err_message,
    }
    res.render('index',context);
};


exports.getAddProduct = (req, res, next) => {
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    context = {
        page: 'Sellpage',
        errMessage: err_message,
        editingProduct: false,
    }
    res.render('adding-products', context);
};


exports.postAddProduct = (req, res, next) => {
    const UID = req.body.UID;
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    context = {
        page: 'Sellpage',
        errMessage: err_message,
    }
    const prod_name = req.body.name;
    const prod_price = req.body.price;
    const prod_description = req.body.description;
    const images = req.files;
    if(images.length != 4) {
        req.flash('Sorry, you either did not upload enough images or JPG/PNG images');
        return res.redirect('/add-product');
    }
    Product.find({name: prod_name, isPurchased: false})
    .then(prod => {
        if(prod.length > 0){
            req.flash('error', 'Sorry, there already exist a product with this name');
            return res.redirect('/add-product');
        }
        const image1 = req.files[0];
        const image2 = req.files[1];
        const image3 = req.files[2];
        const image4 = req.files[3];

        const product = new Product({
            name: prod_name,
            price: prod_price,
            description: prod_description,
            UID: req.session.user._id,
            isApproved: false,
            imageUrl1: image1.path.replace('\\','/'),
            imageUrl2: image2.path.replace('\\','/'),
            imageUrl3: image3.path.replace('\\','/'),
            imageUrl4: image4.path.replace('\\','/'),
            isPurchased: false,
        });
        product.save()
        .then(result => {
            const URL = '/profile/' + UID;
            return res.redirect(URL);
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
       
    
};


exports.getAllProducts = (req, res, next) => {
    Product.find({isApproved: true, isPurchased: false})
    .then(products => { 
        let found_prods = []
        if(products.length == 0) {
            found_prods = undefined;
        } else {
            for(let prod of products) {
                // if(prod.UID.toString() === req.session.user._id.toString()) 
                //     continue;
                // else {
                    found_prods.push(prod);
                // }
            }
        }

        context = {
            page: 'Productpage',
            allProds: found_prods,
        }
        res.render('product-list', context);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.productDetail = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findOne({_id: prodId})
    .populate('UID')
    .then(product => {
        if(!product){
            return res.redirect('product-list');
        }
        context = {
            page: 'Detailpage',
            product: product,
        }
        res.render('product-detail',context);

    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProfile = (req, res, next) => {
    const UID = req.params.UID;
    User.findOne({_id: UID})
    .then(usr => {
        if(!usr) {
            return res.redirect('/');
        }
        const session_id = req.session.user._id.toString();
        const user_id = usr._id.toString();
        if (session_id !== user_id) {
            context = {
                page: 'Profilepage',
                session_usr: '123',
                usr_id: '456',
                user: usr,
            }
            return res.render('profile',context);
        }

        Product.find({UID: usr._id})
        .then(products => {
            let not_purchased = [];
            let purchased = [];
            let revenue = 0;
            for (let prod of products) {
                if (prod.isPurchased) {
                    revenue += prod.price;
                    purchased.push(prod);
                } else {
                    not_purchased.push(prod);
                }
            }
            context = {
                page: 'Profilepage',
                session_usr: '111',
                usr_id: '111',
                user: usr,
                purchased_prods : purchased,
                not_purchased_prods : not_purchased,
                revenue: revenue,
            }
            res.render('profile', context)
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
    })
};


exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    const UID = req.params.UID;
    let err_message = req.flash('error');
    if (err_message.length > 0) {
        err_message = err_message[0];
    } else {
        err_message = null;
    }
    Product.findById(prodId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        
        console.log(product.UID.toString());
        console.log(UID);

        if(UID != product.UID.toString()) {
            return res.redirect('/');
        }

        context = {
            page : 'Profilepage',
            product: product,
            UID : UID,
            editingProduct: true,
            errMessage: err_message,
        }
        res.render('edit-product', context);
    })
    .catch(err => {
        return next(err);
    })
};

exports.postEditProduct = (req, res, next) => {
    const UID = req.body.UID;
    const prodId = req.body.prodId;
    const name = req.body.name;
    const images = req.files;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(prodId)
    .then(product => {
        product.name = name;
        if (price) {
            product.price = price;
        }
        product.description = description;
        const image1 = req.files[0];
        const image2 = req.files[1];
        const image3 = req.files[2];
        const image4 = req.files[3];
        if(image1){
            fileHelper.deleteFile(product.imageUrl1);
            product.imageUrl1 = image1.path.replace('\\','/');
        }
        if(image2){
            fileHelper.deleteFile(product.imageUrl2);
            product.imageUrl2 = image2.path.replace('\\','/');
        }
        if(image3){
            fileHelper.deleteFile(product.imageUrl3);
            product.imageUrl3 = image3.path.replace('\\','/');
        }
        if(image4){
            fileHelper.deleteFile(product.imageUrl4);
            product.imageUrl4 = image4.path.replace('\\','/');
        }
        return product.save()
        .then(result => {
            const URL = '/profile/' + UID;
            res.redirect(URL);
        });
    })
    .catch(err => {
        return next(err);
    });
};

exports.deleteProduct = (req,res,next) => {
    const prodId = req.body.prodId;
    const UID = req.body.UID
    Product.findById(prodId)
    .then(product => {
        if(!product) {
            return next(new Error('Product not found'));
        }
        fileHelper.deleteFile(product.imageUrl1);
        fileHelper.deleteFile(product.imageUrl2);
        fileHelper.deleteFile(product.imageUrl3);
        fileHelper.deleteFile(product.imageUrl4);
        return Product.deleteOne({_id: prodId, UID: req.session.user._id})
    })
    .then(result => {
        const url = '/profile/' + UID;
        res.redirect(url);
    })
    .catch(err  => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getUserCart = (req, res, next) => {
    User.findById(req.session.user._id)
    .populate('cart.items.productId')
    .then(usr => {
        const products = usr.cart.items;
        console.log(products);
        context = { 
            page : '/cart',
            products : products
        }
        res.render('cart', context);
    })
    .catch(err => {
        return next(err);
    })

}

exports.postUserCart = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return next(error);
        }
        return User.findById(req.session.user._id)
            .then(usr => {
                usr.addToCart(product);
            })
    })
    .then(result => {
        return res.redirect('/cart');
    })
    .catch(err => {
        return next(err);
    });
};

exports.deleteFromUserCart = (req, res, next) => {
    
}

