const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const isAuth = require('../middlewares/authentication');

router.get('/', marketController.getIndex);

router.get('/add-product', isAuth, marketController.getAddProduct);
router.post('/add-product', isAuth, marketController.postAddProduct);


router.get('/all-products', isAuth, marketController.getAllProducts);


router.get('/product-detail/:prodId', isAuth, marketController.productDetail);


// export our routes
module.exports = router;