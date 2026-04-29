const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, productController.addProduct);
router.get('/', authMiddleware, productController.getProducts);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;