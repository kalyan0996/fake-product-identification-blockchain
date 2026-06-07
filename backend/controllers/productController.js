const Product = require('../models/Product');
const blockchainService = require('../blockchain/blockchainService');
const qrService = require('../services/qrService');
const crypto = require('crypto');

const productController = {
  addProduct: async (req, res) => {
    try {
      const { name, description } = req.body;
      const manufacturer = req.user.id;
      const productId = crypto.randomUUID();
      const blockResult = await blockchainService.registerProduct(productId, name, manufacturer);
      console.log('Blockchain result:', blockResult);
      const qrCode = await qrService.generateQR(productId);
      const product = new Product({
        productId, name, description, manufacturer, qrCode,
        blockIndex: blockResult.blockNumber || 0,
        transactionHash: blockResult.transactionHash || ''
      });
      await product.save();
      res.status(201).json({ product, qrCode, blockchain: blockResult });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await Product.find({ manufacturer: req.user.id });
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const updated = await Product.findOneAndUpdate(
        { productId: id, manufacturer: req.user.id },
        { name, description },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      res.json({ product: updated });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.findOneAndDelete({ productId: id, manufacturer: req.user.id });
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = productController;
