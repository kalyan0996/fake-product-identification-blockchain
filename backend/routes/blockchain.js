const express = require("express");
const router = express.Router();
const blockchainService = require("../blockchain/blockchainService");

// GET /api/blockchain/status
router.get("/status", async (req, res) => {
  try {
    await blockchainService.initialize();
    const count = await blockchainService.getProductCount();
    res.json({
      status: "connected",
      contractAddress: blockchainService.contract?.address,
      productCount: count.count || 0
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// POST /api/blockchain/register
router.post("/register", async (req, res) => {
  const { productId, name, manufacturer } = req.body;
  if (!productId || !name || !manufacturer) {
    return res.status(400).json({ error: "productId, name, and manufacturer are required" });
  }
  const result = await blockchainService.registerProduct(productId, name, manufacturer);
  if (result.success) {
    res.json({ message: "Product registered on blockchain", ...result });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// GET /api/blockchain/verify/:productId
router.get("/verify/:productId", async (req, res) => {
  const { productId } = req.params;
  const result = await blockchainService.verifyProduct(productId);
  res.json(result);
});

module.exports = router;
