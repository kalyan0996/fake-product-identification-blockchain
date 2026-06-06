const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      const abiPath = path.join(__dirname, "ProductRegistry.json");
      if (!fs.existsSync(abiPath)) {
        console.warn("Blockchain ABI not found.");
        return false;
      }

      const contractData = JSON.parse(fs.readFileSync(abiPath, "utf8"));

      this.provider = new ethers.providers.JsonRpcProvider(
        process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545"
      );

      // Use Ganache account (0) private key directly - this is the deployer
      const privateKey = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
      const wallet = new ethers.Wallet(privateKey);
      this.signer = wallet.connect(this.provider);

      const contractAddress = process.env.CONTRACT_ADDRESS || contractData.contractAddress;
      this.contract = new ethers.Contract(contractAddress, contractData.abi, this.signer);

      const network = await this.provider.getNetwork();
      console.log(`Blockchain connected: chainId=${network.chainId}`);
      console.log(`Contract address: ${contractAddress}`);
      console.log(`Signer address: ${this.signer.address}`);
      this.initialized = true;
      return true;
    } catch (err) {
      console.error("Blockchain init failed:", err.message);
      return false;
    }
  }

  async registerProduct(productId, name, manufacturer) {
    if (!this.initialized) await this.initialize();
    try {
      const tx = await this.contract.registerProduct(productId, name, manufacturer);
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (err) {
      console.error("registerProduct error:", err.message);
      return { success: false, error: err.message };
    }
  }

  async verifyProduct(productId) {
    if (!this.initialized) await this.initialize();
    try {
      const [pid, name, manufacturer, timestamp, isRegistered] =
        await this.contract.getProduct(productId);
      return {
        success: true,
        isAuthentic: isRegistered,
        productId: pid,
        name,
        manufacturer,
        registeredAt: isRegistered
          ? new Date(timestamp.toNumber() * 1000).toISOString()
          : null
      };
    } catch (err) {
      console.error("verifyProduct error:", err.message);
      return { success: false, error: err.message, isAuthentic: false };
    }
  }

  async getProductCount() {
    if (!this.initialized) await this.initialize();
    try {
      const count = await this.contract.getProductCount();
      return { success: true, count: count.toNumber() };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = new BlockchainService();
