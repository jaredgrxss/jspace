const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const isAuth = require('../middlewares/authentication');

router.get('/', marketController.getIndex);

router.get('/add-product', isAuth, marketController.getAddProduct);

router.post('/add-product', isAuth, marketController.postAddProduct);

router.get("/success", isAuth, marketController.successPostProduct);

router.get('/all-products', marketController.getAllProducts);

router.get('/product-detail/:prodId', marketController.productDetail);

router.get('/profile/:UID', isAuth, marketController.getProfile);

router.get('/edit-product/:UID/:prodId', isAuth, marketController.getEditProduct);

router.post('/edit-product', isAuth, marketController.postEditProduct);

router.post('/delete-product', isAuth, marketController.deleteProduct);

router.get('/cart', isAuth, marketController.getUserCart);

router.post('/add-to-cart/:prodId', isAuth, marketController.postUserCart);

router.post('/deleteFromCart', isAuth, marketController.deleteFromUserCart);

router.get('/checkout', isAuth, marketController.getCheckout);

router.get('/checkout/success', isAuth, marketController.getCheckoutSuccess);

router.get('/checkout/cancel', isAuth, marketController.getCheckout);

router.get('/orders', isAuth, marketController.getUserOrders);
// export our routes
module.exports = router;