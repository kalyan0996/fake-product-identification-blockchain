const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  timestamp: { type: Date, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // product data
  previousHash: { type: String, required: true },
  hash: { type: String, required: true }
});

module.exports = mongoose.model('Block', blockSchema);