const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrCode: { type: String }, // base64 encoded QR
  blockIndex: { type: Number }, // index in blockchain
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);