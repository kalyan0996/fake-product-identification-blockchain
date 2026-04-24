const crypto = require('crypto');
const Block = require('../models/Block');

class Blockchain {
  constructor() {
    this.chain = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    await this.loadChain();
    this.initialized = true;
  }

  async loadChain() {
    try {
      const blocks = await Block.find().sort({ index: 1 });
      this.chain = blocks;
      if (this.chain.length === 0) {
        await this.createGenesisBlock();
      }
    } catch (error) {
      console.error('Error loading blockchain:', error);
    }
  }

  async createGenesisBlock() {
    const genesisBlock = new Block({
      index: 0,
      timestamp: new Date(),
      data: 'Genesis Block',
      previousHash: '0',
      hash: this.calculateHash(0, new Date(), 'Genesis Block', '0')
    });
    await genesisBlock.save();
    this.chain.push(genesisBlock);
  }

  calculateHash(index, timestamp, data, previousHash) {
    return crypto.createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest('hex');
  }

  async addBlock(data) {
    if (this.chain.length === 0) {
      await this.init();
    }

    const previousBlock = this.chain[this.chain.length - 1];
    const newIndex = previousBlock.index + 1;
    const newTimestamp = new Date();
    const newHash = this.calculateHash(newIndex, newTimestamp, data, previousBlock.hash);

    const newBlock = new Block({
      index: newIndex,
      timestamp: newTimestamp,
      data: data,
      previousHash: previousBlock.hash,
      hash: newHash
    });

    await newBlock.save();
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.timestamp, currentBlock.data, currentBlock.previousHash)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getBlockByIndex(index) {
    return this.chain.find(block => block.index === index);
  }
}

module.exports = new Blockchain();