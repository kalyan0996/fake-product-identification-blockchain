import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying to local Ganache...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const contract = await ProductRegistry.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SUCCESS deployed to:", address);

  const info = { address, chainId: 1337, rpcUrl: "http://127.0.0.1:8545" };
  fs.writeFileSync(path.join(__dirname, "../contract-info.json"), JSON.stringify(info, null, 2));

  const artifact = JSON.parse(fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json"), "utf8"
  ));

  const backendDir = path.join(__dirname, "../../backend/blockchain");
  if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });

  fs.writeFileSync(path.join(backendDir, "ProductRegistry.json"), JSON.stringify({
    abi: artifact.abi,
    contractAddress: address,
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 1337
  }, null, 2));

  console.log("ABI saved to backend/blockchain/ProductRegistry.json");
  console.log("CONTRACT_ADDRESS=" + address);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
