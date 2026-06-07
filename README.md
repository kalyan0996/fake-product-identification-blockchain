<div align="center">

<img src="https://img.shields.io/badge/Blockchain-Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white"/>
<img src="https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/MongoDB-6-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>

<br/><br/>

# 🛡️ Fake Product Identification System

### Verify product authenticity in seconds using Ethereum blockchain

*A full-stack platform where every product gets an immutable blockchain record — making counterfeits impossible to fake.*

</div>

---

## 📌 What This Does

When a manufacturer adds a product through the web UI, it is **simultaneously stored in MongoDB and registered on an Ethereum smart contract**. Anyone can then scan or enter a product ID to verify whether it is genuine — the blockchain never lies.

```
Manufacturer adds product via frontend
          │
          ▼
  ┌───────────────────┐
  │   Express Backend  │
  └────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
MongoDB        Ganache
(product       (Solidity
 details)       contract)
    │             │
    └──────┬──────┘
           │
           ▼
  Customer scans QR / enters ID
           │
           ▼
  ✅ Authentic   ❌ Counterfeit
```

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Tailwind CSS, Axios | Product management & verification UI |
| **Backend** | Node.js 22, Express, Ethers.js v5, JWT | REST API + blockchain bridge |
| **Blockchain** | Solidity 0.8.19, Hardhat v3, Ganache v7 | Immutable product registry |
| **Database** | MongoDB 6, Mongoose | Product metadata & QR codes |
| **Infrastructure** | Docker, Docker Compose, Nginx, AWS EC2 | Containerised deployment |

---

## 🏗️ Architecture

```
Internet
   │
   ├──► :3000  docker-frontend  (React build served via Nginx)
   │              │ REST /api/*
   └──► :5000  docker-backend   (Express + Ethers.js)
                  │                    │
         docker-mongo           docker-ganache
         MongoDB :27017         Ethereum RPC :8545
         (persistent volume)    (resets on restart)
```

> **Note:** Ganache is an in-memory local blockchain. It resets every time the server reboots. See [After Every EC2 Restart](#-after-every-ec2-restart--one-command) to redeploy in 30 seconds.

---

## ⚡ Fresh Setup — New EC2 Instance

### Prerequisites
- Ubuntu 22.04+ EC2 instance
- Ports **3000** and **5000** open in your Security Group inbound rules

---

### Step 1 — SSH in and Clone

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

git clone https://github.com/kalyan0996/fake-product-identification-blockchain.git
cd fake-product-identification-blockchain
```

---

### Step 2 — Install Node.js 22

```bash
sudo apt-get remove -y nodejs
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # ✅ must show v22.x.x
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

### Step 4 — Install Blockchain Dependencies & Compile Contract

```bash
cd ~/fake-product-identification-blockchain/blockchain
npm install
npx hardhat compile
# ✅ Expected: Compiled 1 Solidity file with solc 0.8.19
```

---

### Step 5 — Start All Docker Containers

```bash
cd ~/fake-product-identification-blockchain/docker
docker compose up -d
sleep 12
docker ps
# ✅ Must show 4 containers: frontend, backend, mongo, ganache
```

---

### Step 6 — Deploy Smart Contract + Sync Address Everywhere

```bash
cd ~/fake-product-identification-blockchain/blockchain
rm -rf ignition/deployments/
echo "y" | npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache

ADDR=$(node -e "const d=require('./ignition/deployments/chain-1337/deployed_addresses.json'); console.log(Object.values(d)[0]);")
echo "✅ Contract deployed at: $ADDR"

node -e "
const fs=require('fs');
const artifact=JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({
  abi: artifact.abi,
  contractAddress: '$ADDR',
  rpcUrl: 'http://ganache:8545',
  chainId: 1337
}, null, 2));
console.log('ProductRegistry.json updated');
"

sed -i "s|CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$ADDR|" \
  ~/fake-product-identification-blockchain/docker/docker-compose.yml

echo "✅ docker-compose.yml synced with: $ADDR"
```

---

### Step 7 — Rebuild Backend with New Contract Address

```bash
cd ~/fake-product-identification-blockchain/docker
docker compose stop backend
docker compose rm -f backend
docker rmi -f docker-backend 2>/dev/null
docker compose up -d --build backend
sleep 15
docker logs docker-backend
# ✅ Must show: Contract OK. Products: 0
```

---

### Step 8 — Verify the Full Flow Works

```bash
# Check blockchain is connected
curl -s http://localhost:5000/api/blockchain/status | python3 -m json.tool
# ✅ "status": "connected"

# Get auth token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@product.app", "password": "Demo1234!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Register a test product
curl -s -X POST http://localhost:5000/api/blockchain/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"TEST-001","name":"Test Product","manufacturer":"Test Co"}' \
  | python3 -m json.tool
# ✅ "success": true, "transactionHash": "0x..."

# Verify the product
curl -s http://localhost:5000/api/blockchain/verify/TEST-001 | python3 -m json.tool
# ✅ "isAuthentic": true

# Verify a fake product
curl -s http://localhost:5000/api/blockchain/verify/FAKE-999 | python3 -m json.tool
# ✅ "isAuthentic": false
```

---

### Step 9 — Open the App

| Service | URL |
|---|---|
| 🌐 Frontend | `http://YOUR_EC2_IP:3000` |
| ⚙️ Backend API | `http://YOUR_EC2_IP:5000` |
| 🔑 Demo Login | `demo@product.app` / `Demo1234!` |

---

## 🔁 After Every EC2 Restart — One Command

> Ganache is in-memory and resets on every reboot. Run this single command each time your server restarts. It redeploys the contract, syncs all config files, and rebuilds the backend automatically.

```bash
cd ~/fake-product-identification-blockchain/docker && \
docker compose up -d && \
sleep 12 && \
cd ~/fake-product-identification-blockchain/blockchain && \
rm -rf ignition/deployments/ && \
echo "y" | npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache && \
ADDR=$(node -e "const d=require('./ignition/deployments/chain-1337/deployed_addresses.json'); console.log(Object.values(d)[0]);") && \
node -e "
const fs=require('fs');
const artifact=JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({abi:artifact.abi,contractAddress:'$ADDR',rpcUrl:'http://ganache:8545',chainId:1337},null,2));
" && \
sed -i "s|CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$ADDR|" ~/fake-product-identification-blockchain/docker/docker-compose.yml && \
cd ~/fake-product-identification-blockchain/docker && \
docker compose stop backend && \
docker compose rm -f backend && \
docker compose up -d backend && \
sleep 12 && \
curl -s http://localhost:5000/api/blockchain/status | python3 -m json.tool
```

✅ Done when you see `"status": "connected"` with a non-empty `contractAddress`.

---

## ✅ How to Use the App

1. Go to `http://YOUR_EC2_IP:3000`
2. Login with `demo@product.app` / `Demo1234!`
3. Click **Add Product** → enter name & description → submit
4. The product is saved to **MongoDB** and **Ethereum blockchain** simultaneously
5. Copy the product ID shown on the dashboard
6. Go to **Verify** page → paste the product ID → click **Verify**
7. ✅ **Product is authentic!** — confirmed on blockchain
8. Enter any random ID → ❌ **Verification failed** — not on blockchain

---

## 📊 Useful Commands

```bash
# ── Containers ──────────────────────────────────────────────
docker ps                                    # all running containers
docker logs docker-backend                   # backend logs
docker logs docker-ganache                   # ganache transaction logs

# ── MongoDB ─────────────────────────────────────────────────
# View all products
docker exec -it docker-mongo mongosh fake-product-db \
  --eval "db.products.find().pretty()"

# Count products
docker exec -it docker-mongo mongosh fake-product-db \
  --eval "db.products.countDocuments()"

# ── Blockchain ───────────────────────────────────────────────
# Connection status + product count
curl -s http://localhost:5000/api/blockchain/status | python3 -m json.tool

# Verify a real product (replace with actual product ID from MongoDB)
curl -s http://localhost:5000/api/blockchain/verify/YOUR-PRODUCT-ID | python3 -m json.tool

# Verify a fake product
curl -s http://localhost:5000/api/blockchain/verify/FAKE-999 | python3 -m json.tool
```

---

## 📋 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT token |
| `GET` | `/api/blockchain/status` | ❌ | Blockchain connection + product count |
| `POST` | `/api/blockchain/register` | ✅ | Register product directly on blockchain |
| `GET` | `/api/blockchain/verify/:id` | ❌ | Verify product authenticity |
| `POST` | `/api/products` | ✅ | Add product — saves to MongoDB **and** blockchain |
| `GET` | `/api/products` | ✅ | List current user's products |
| `PUT` | `/api/products/:id` | ✅ | Update product details |
| `DELETE` | `/api/products/:id` | ✅ | Delete product |

**Auth header format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 Quick Reference

| Item | Value |
|---|---|
| Chain ID | `1337` (local Ganache) |
| Solidity | `0.8.19` |
| Backend → Ganache | `http://ganache:8545` (Docker internal) |
| Ganache mnemonic | `myth like bonus scare over problem client lizard pioneer submit female collect` |
| Deployer private key | `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d` |

---

## 🐞 Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `contractAddress: ""` empty | Contract not deployed | Run the EC2 restart command |
| `isAuthentic: false` after adding product | Wrong contract address in compose | Run the EC2 restart command |
| `CALL_EXCEPTION` on verify | Stale contract address — Ganache reset | Run the EC2 restart command |
| `Error HHE22` Hardhat not found | `node_modules` missing | `cd blockchain && npm install` |
| `CACHED [backend 5/5]` — old image | Docker layer cache used | `docker rmi -f docker-backend` then rebuild |
| `Only owner can call this` | Wrong signer private key | Confirm deployer key matches Ganache account 0 |
| `Blockchain initialized` in logs (not `Contract OK`) | Old `blockchainService.js` baked in image | `git pull` then `docker rmi -f docker-backend && docker compose up -d --build backend` |
| Frontend verify always fails | Old `verificationController.js` | `git pull` then rebuild backend |
| Products visible in MongoDB but not on blockchain | Old `productController.js` | `git pull` then rebuild backend |

---

## 📂 Key Files

```
fake-product-identification-blockchain/
├── blockchain/
│   ├── contracts/
│   │   └── ProductRegistry.sol          # Solidity smart contract
│   ├── ignition/modules/
│   │   └── ProductRegistry.ts           # Hardhat Ignition deploy module
│   └── hardhat.config.ts                # Hardhat + Ganache network config
│
├── backend/
│   ├── blockchain/
│   │   ├── blockchainService.js         # ⭐ Ethers.js — reads CONTRACT_ADDRESS from env
│   │   └── ProductRegistry.json         # ABI + deployed contract address
│   ├── controllers/
│   │   ├── productController.js         # ⭐ Saves to MongoDB + blockchain on add
│   │   └── verificationController.js    # ⭐ Verifies against real blockchain
│   ├── models/
│   │   └── Product.js                   # Mongoose schema
│   └── server.js                        # Express app entry point
│
├── frontend/
│   └── src/                             # React 18 source
│
└── docker/
    ├── docker-compose.yml               # ⭐ CONTRACT_ADDRESS env var lives here
    ├── Dockerfile.backend
    └── Dockerfile.frontend
```

> ⭐ = files modified from original to enable real blockchain integration

---

## 📄 Smart Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductRegistry {
    struct Product {
        string productId;
        string name;
        string manufacturer;
        uint256 timestamp;
        bool isRegistered;
    }

    mapping(string => Product) private products;

    function registerProduct(string memory _productId, string memory _name, string memory _manufacturer)
        public onlyOwner { ... }

    function getProduct(string memory _productId)
        public view returns (string, string, string, uint256, bool) { ... }

    function verifyProduct(string memory _productId)
        public returns (bool) { ... }
}
```

Deployed via **Hardhat Ignition** to a local **Ganache** chain (Chain ID 1337). Each product registration is a real Ethereum transaction with a transaction hash and block number.

---

<div align="center">

**Built with ❤️ — Local Blockchain · No Gas Fees · No Internet Dependency**

*Solidity · Hardhat · Ganache · Node.js · React · MongoDB · Docker · AWS EC2*

</div>
