const express = require('express');
const verificationController = require('../controllers/verificationController');
const router = express.Router();

router.get('/:productId', verificationController.verifyProduct);

module.exports = router;