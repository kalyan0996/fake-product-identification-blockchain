<div align="center">

# 🛡️ Fake Product Identification System

### A blockchain-powered platform to register and verify product authenticity

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-v3-FFF100?style=flat-square)](https://hardhat.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)

**Manufacturers register products on an immutable local blockchain. Anyone can verify authenticity instantly.**

[Overview](#-overview) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📌 Overview

The Fake Product Identification System uses a **local Ethereum blockchain (Ganache)** to create tamper-proof product records. When a manufacturer registers a product, a transaction is written permanently to the chain. Anyone scanning a product can instantly verify whether it is genuine or counterfeit — with no external blockchain network, no gas fees, and no internet dependency.

```
Manufacturer registers product  →  Written permanently to blockchain
Consumer scans product          →  Verified against blockchain record
Result: Authentic ✅ or Fake ❌
```

---

## 🧱 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18 | UI framework |
| Tailwind CSS | 3 | Utility-first styling |
| Axios | — | HTTP requests to backend API |
| React Router | — | Client-side navigation |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | JavaScript runtime |
| Express.js | — | REST API server |
| MongoDB + Mongoose | 6 | User accounts and product metadata |
| JSON Web Token (JWT) | — | Authentication and session management |
| Ethers.js | v5 | Backend-to-blockchain communication |

### Blockchain
| Technology | Version | Purpose |
|---|---|---|
| Solidity | 0.8.19 | Smart contract language |
| Hardhat | v3 | Compile, test, and deploy contracts |
| Hardhat Ignition | — | Deployment manager (Hardhat v3) |
| Ganache | v7 | Local Ethereum blockchain node |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerizes all 4 services |
| AWS EC2 (Ubuntu 22.04) | Application host |
| Nginx | Serves pre-built React frontend |

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────────┐
                        │           AWS EC2 Instance          │
                        │                                     │
  User Browser  ──────► │  ┌─────────────┐                   │
                        │  │   Frontend  │  React + Nginx     │
                        │  │  Port 3000  │                   │
                        │  └──────┬──────┘                   │
                        │         │ REST API                  │
                        │  ┌──────▼──────┐                   │
                        │  │   Backend   │  Express + JWT     │
                        │  │  Port 5000  │                   │
                        │  └──────┬──────┘                   │
                        │         │              │            │
                        │  ┌──────▼──────┐  ┌───▼──────────┐ │
                        │  │  Ganache    │  │   MongoDB    │ │
                        │  │ Blockchain  │  │  Port 27017  │ │
                        │  │  Port 8545  │  │              │ │
                        │  │  (internal) │  │              │ │
                        │  └─────────────┘  └──────────────┘ │
                        └─────────────────────────────────────┘
```

> **Note:** Ganache runs on the internal Docker network only. The backend reaches it via `http://ganache:8545`. Port 8545 is not exposed to the public internet.

---

## 📂 Project Structure

```
fake-product-identification-blockchain/
│
├── backend/
│   ├── blockchain/
│   │   ├── blockchainService.js    # Ethers.js — communicates with smart contract
│   │   └── ProductRegistry.json   # Contract ABI + address (auto-generated)
│   ├── controllers/                # Route handler logic
│   ├── middleware/                 # JWT authentication middleware
│   ├── models/                     # Mongoose schemas (User, Product)
│   ├── routes/                     # API route definitions
│   ├── services/                   # Business logic layer
│   ├── .env                        # Environment variables ← you create this
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── blockchain/
│   ├── contracts/
│   │   └── ProductRegistry.sol     # The Solidity smart contract
│   ├── ignition/modules/
│   │   └── ProductRegistry.ts      # Hardhat Ignition deployment module
│   ├── hardhat.config.ts           # Hardhat config (Ganache network, Solidity 0.8.19)
│   └── package.json
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml          # Defines: ganache, mongo, backend, frontend
│
├── frontend/
│   ├── build/                      # Pre-built React app (used by Docker)
│   └── src/                        # React source code
│
├── nginx.conf                       # Nginx config for frontend container
└── README.md
```

---

## 🧠 Smart Contract

**File:** `blockchain/contracts/ProductRegistry.sol`  
**Compiler:** Solidity 0.8.19 (EVM target: paris)

```solidity
// Key functions

registerProduct(string productId, string name, string manufacturer)
  Access:   Owner only (the account that deployed the contract)
  Effect:   Writes product permanently to the blockchain
  Safety:   Reverts if product ID already exists — prevents duplicate registration
  Event:    Emits ProductRegistered(productId, name, manufacturer, timestamp)

verifyProduct(string productId) returns (bool)
  Access:   Public — anyone can call
  Effect:   Returns true if product was registered, false if unknown/fake
  Event:    Emits ProductVerified(productId, isAuthentic, timestamp)

getProduct(string productId) returns (id, name, manufacturer, timestamp, isRegistered)
  Access:   Public view — no transaction needed
  Effect:   Returns full product details

getProductCount() returns (uint256)
  Access:   Public view
  Effect:   Returns total number of registered products
```

**Deployer account (Ganache deterministic):**
```
Address:     0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
Private key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```
> ⚠️ This is Ganache's public test key. It holds fake ETH only. Never use on a real network.

---

## ⚡ Quick Start

### Prerequisites

- AWS EC2 running Ubuntu 22.04
- Ports **3000** and **5000** open in your EC2 Security Group

---

### Step 1 — SSH and Clone

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

git clone https://github.com/kalyan0996/fake-product-identification-blockchain.git
cd fake-product-identification-blockchain
```

---

### Step 2 — Install Node.js 22

> Hardhat v3 requires Node.js 22. Node.js 18 will be rejected.

```bash
sudo apt-get remove -y nodejs
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version    # ✅ must show v22.x.x
```

---

### Step 3 — Install Docker

```bash
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker
newgrp docker
```

---

### Step 4 — Install Blockchain Dependencies & Compile

```bash
cd ~/fake-product-identification-blockchain/blockchain
npm install
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file with solc 0.8.19 (evm target: paris)
```

---

### Step 5 — Deploy Smart Contract (Initial)

Start a temporary local Ganache:

```bash
npx ganache --port 8545 --chain.chainId 1337 --wallet.deterministic true \
  --wallet.totalAccounts 10 --host 0.0.0.0 &
sleep 5
```

Verify Ganache is running:

```bash
curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Expected: {"id":1,"jsonrpc":"2.0","result":"0x0"}
```

Deploy the contract:

```bash
rm -rf ignition/deployments/
npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache
# Type y when prompted
```

Output will show:
```
ProductRegistryModule#ProductRegistry - 0xYOUR_CONTRACT_ADDRESS
```

**Copy that address — you will need it in the next step.**

---

### Step 6 — Save ABI to Backend

```bash
node -e "
const fs = require('fs');
const artifact = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
const deployed = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/deployed_addresses.json','utf8'));
const addr = Object.values(deployed)[0];
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({
  abi: artifact.abi,
  contractAddress: addr,
  rpcUrl: 'http://ganache:8545',
  chainId: 1337
}, null, 2));
console.log('Done. Address:', addr);
"
```

---

### Step 7 — Create the `.env` File

```bash
cd ~/fake-product-identification-blockchain/backend

cat > .env << 'ENVEOF'
MONGODB_URI=mongodb://mongo:27017/fake-product-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=production
BLOCKCHAIN_RPC_URL=http://ganache:8545
CONTRACT_ADDRESS=PASTE_YOUR_ADDRESS_HERE
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
ENVEOF
```

Replace the placeholder with your contract address from Step 5:

```bash
# Replace 0xYOUR_CONTRACT_ADDRESS with your actual address
sed -i "s|PASTE_YOUR_ADDRESS_HERE|0xYOUR_CONTRACT_ADDRESS|" .env

cat .env    # verify it looks correct
```

A correctly filled `.env` looks like:

```env
MONGODB_URI=mongodb://mongo:27017/fake-product-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=production
BLOCKCHAIN_RPC_URL=http://ganache:8545
CONTRACT_ADDRESS=0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
BLOCKCHAIN_CHAIN_ID=1337
BLOCKCHAIN_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

---

### Step 8 — Start Docker

```bash
pkill -f ganache; sleep 2

cd ~/fake-product-identification-blockchain/docker
docker compose down
docker compose up -d
```

Verify all 4 containers are running:

```bash
docker ps
```

Expected:

```
CONTAINER          STATUS    PORTS
docker-frontend    Up        0.0.0.0:3000->80/tcp
docker-backend     Up        0.0.0.0:5000->5000/tcp
docker-mongo       Up        0.0.0.0:27017->27017/tcp
docker-ganache     Up        (internal Docker network)
```

---

### Step 9 — Redeploy Contract to Docker's Ganache

Docker's Ganache is a fresh instance — you must redeploy the contract to it:

```bash
cd ~/fake-product-identification-blockchain/blockchain
rm -rf ignition/deployments/
npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache
# Type y — copy the new address
```

Update the ABI file with the new address:

```bash
node -e "
const fs = require('fs');
const artifact = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
const deployed = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/deployed_addresses.json','utf8'));
const addr = Object.values(deployed)[0];
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({
  abi: artifact.abi,
  contractAddress: addr,
  rpcUrl: 'http://ganache:8545',
  chainId: 1337
}, null, 2));
console.log('Done. Address:', addr);
"
```

Update `.env` with the new address:

```bash
cd ~/fake-product-identification-blockchain/backend

# Replace 0xNEW_ADDRESS with your actual new contract address
sed -i "s|CONTRACT_ADDRESS=0x[a-fA-F0-9]*|CONTRACT_ADDRESS=0xNEW_ADDRESS|" .env
```

Restart the backend:

```bash
cd ~/fake-product-identification-blockchain/docker
docker compose restart backend
sleep 8
docker logs docker-backend    # should show: Blockchain initialized
```

---

## 🧪 Testing

### Blockchain Status

```bash
curl http://localhost:5000/api/blockchain/status
```

### Register a Product

```bash
curl -X POST http://localhost:5000/api/blockchain/register \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD-001",
    "name": "Test Product",
    "manufacturer": "Kalyan Industries"
  }'
```

Expected response:
```json
{
  "message": "Product registered on blockchain",
  "success": true,
  "transactionHash": "0xabc123...",
  "blockNumber": 1
}
```

### Verify a Real Product

```bash
curl http://localhost:5000/api/blockchain/verify/PROD-001
```

Expected response:
```json
{
  "success": true,
  "isAuthentic": true,
  "productId": "PROD-001",
  "name": "Test Product",
  "manufacturer": "Kalyan Industries"
}
```

### Verify a Fake Product

```bash
curl http://localhost:5000/api/blockchain/verify/FAKE-999
```

Expected response:
```json
{
  "isAuthentic": false
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@product.app", "password": "Demo1234!"}'
```

---

## 📋 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create a user account |
| `POST` | `/api/auth/login` | No | Login, receive JWT token |
| `GET` | `/api/blockchain/status` | No | Check blockchain connection |
| `POST` | `/api/blockchain/register` | Yes | Register product on blockchain |
| `GET` | `/api/blockchain/verify/:productId` | No | Verify product authenticity |

---

## 🔁 After Every EC2 Restart

> Ganache resets completely on every restart. Run this sequence each time the server reboots.

```bash
# 1. Start all containers
cd ~/fake-product-identification-blockchain/docker
docker compose up -d
sleep 10

# 2. Redeploy contract to fresh Ganache
cd ~/fake-product-identification-blockchain/blockchain
rm -rf ignition/deployments/
npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache
# Type y — copy the new address printed at the bottom

# 3. Update ABI file
node -e "
const fs = require('fs');
const artifact = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
const deployed = JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/deployed_addresses.json','utf8'));
const addr = Object.values(deployed)[0];
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({
  abi: artifact.abi,
  contractAddress: addr,
  rpcUrl: 'http://ganache:8545',
  chainId: 1337
}, null, 2));
console.log('Done. Address:', addr);
"

# 4. Update .env — replace 0xNEW_ADDRESS with actual new address
cd ~/fake-product-identification-blockchain/backend
sed -i "s|CONTRACT_ADDRESS=0x[a-fA-F0-9]*|CONTRACT_ADDRESS=0xNEW_ADDRESS|" .env

# 5. Restart backend
cd ~/fake-product-identification-blockchain/docker
docker compose restart backend
```

---

## 📊 View Logs

```bash
docker logs docker-backend      # API server + blockchain connection status
docker logs docker-ganache      # Blockchain transactions
docker logs docker-frontend     # Nginx access logs
docker logs docker-mongo        # Database logs
```

---

## 🐞 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Cannot read properties of null (reading 'registerProduct')` | Stale or wrong contract address in `.env` | Redeploy contract, update `.env` with new address, restart backend |
| `invalid opcode` when registering | Solidity version too new for Ganache EVM | Ensure `hardhat.config.ts` uses version `0.8.19` |
| `Only owner can call this` | Private key mismatch — wrong account signing transactions | Use Ganache account 0 private key: `0x4f3edf...b23b1d` |
| `Nothing new to deploy` from Ignition | Cached old deployment is blocking fresh deploy | Run `rm -rf ignition/deployments/` before deploying |
| `Contract_ADDRESS=xe78...` (missing `0`) | Typo in `.env` — address must start with `0x` | Run `sed -i "s\|CONTRACT_ADDRESS=xe\|CONTRACT_ADDRESS=0xe\|" .env` |
| Port 8545 refused from host | Expected — Ganache is on Docker internal network only | No fix needed. Backend uses `http://ganache:8545` internally |
| `ERESOLVE` npm conflict in blockchain folder | ethers v5 vs v6 conflict | The blockchain folder uses ethers v6; backend uses ethers v5 separately — install them independently |

---

## 🔑 Quick Reference

| Item | Value |
|---|---|
| Frontend URL | `http://YOUR_EC2_IP:3000` |
| Backend API | `http://YOUR_EC2_IP:5000` |
| Blockchain | Local Ganache — chainId `1337` |
| Solidity version | `0.8.19` (do not use 0.8.28 — causes `invalid opcode`) |
| Hardhat version | v3 (uses Ignition, not `hardhat run scripts/`) |
| Deployer private key | `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d` |
| Ganache mnemonic | `myth like bonus scare over problem client lizard pioneer submit female collect` |
| Backend → Ganache URL | `http://ganache:8545` (Docker internal — never `localhost`) |

---

<div align="center">

Built with ❤️ by **kalyan0996**  
AWS EC2 · Ubuntu 22.04 · Local Blockchain — No external network required

</div>
