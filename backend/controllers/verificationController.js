const blockchainService = require('../blockchain/blockchainService');

const verificationController = {
  verifyProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const result = await blockchainService.verifyProduct(productId);
      if (result.isAuthentic) {
        res.json({ authentic: true, product: result });
      } else {
        res.status(404).json({ authentic: false, message: 'Product not found on blockchain' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
module.exports = verificationController;
