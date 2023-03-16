const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const adminController = require('../controllers/adminController');

router.get('/approve-products', isAdmin, adminController.getApproveProducts);

router.post('/deny-product', isAdmin, adminController.denyProduct);

router.post('/product-approved', isAdmin, adminController.productApproved);

// export our routes
module.exports = router;