const Product = require('../models/product');

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
    }
    res.render('adding-products', context);
};

exports.postAddProduct = (req, res, next) => {
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
    Product.find({name: prod_name})
    .then(prod => {
        if(prod.length > 0){
            req.flash('error', 'Sorry, there already exist a product with this name');
            return res.redirect('/add-product');
        }

        const product = new Product({
            name: prod_name,
            price: prod_price,
            description: prod_description,
            UID: req.session.user._id,
            isApproved: false,
        });
        product.save()
        .then(result => {
            res.redirect('/');
        })
    })
    .catch(err => console.log(err));
       
    
};


exports.getAllProducts = (req, res, next) => {

    Product.find({isApproved: true})
    .then(products => { 
        let found_prods = []
        if(products.length == 0) {
            found_prods = undefined;
        } else {
            for(let prod of products) {
                console.log(prod);
                if(prod.UID.toString() === req.session.user._id.toString()) 
                    continue;
                else {
                    found_prods.push(prod);
                }
            }
        }
        context = {
            page: 'Productpage',
            allProds: found_prods,
        }
        res.render('product-list', context);
    })
    .catch(err => console.log(err));
};


exports.productDetail = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findOne({_id: prodId})
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
    .catch(err => console.log(err));
}