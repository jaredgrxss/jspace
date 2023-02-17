const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/', marketController.getIndex);



// export our routes
module.exports = router;