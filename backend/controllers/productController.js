const Product = require('../models/Product');
const blockchain = require('../services/blockchain');
const qrService = require('../services/qrService');
const crypto = require('crypto');

const productController = {
  addProduct: async (req, res) => {
    try {
      const { name, description } = req.body;
      const manufacturer = req.user.id;

      // Generate unique product ID
      const productId = crypto.randomUUID();

      // Add to blockchain
      const blockData = { productId, name, description, manufacturer };
      const block = await blockchain.addBlock(blockData);

      // Generate QR code
      const qrCode = await qrService.generateQR(productId);

      // Save product
      const product = new Product({
        productId,
        name,
        description,
        manufacturer,
        qrCode,
        blockIndex: block.index
      });
      await product.save();

      res.status(201).json({ product, qrCode });
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

      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ product: updated });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.findOneAndDelete({ productId: id, manufacturer: req.user.id });

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = productController;