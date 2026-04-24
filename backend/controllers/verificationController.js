const Product = require('../models/Product');
const blockchain = require('../services/blockchain');

const verificationController = {
  verifyProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      // Find product in DB
      const product = await Product.findOne({ productId });
      if (!product) {
        return res.status(404).json({ authentic: false, message: 'Product not found' });
      }

      // Verify blockchain integrity
      const isValid = blockchain.isChainValid();
      if (!isValid) {
        return res.status(500).json({ authentic: false, message: 'Blockchain corrupted' });
      }

      // Check if block exists and matches
      const block = blockchain.getBlockByIndex(product.blockIndex);
      if (!block || block.data.productId !== productId) {
        return res.status(404).json({ authentic: false, message: 'Block data mismatch' });
      }

      res.json({ authentic: true, product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = verificationController;