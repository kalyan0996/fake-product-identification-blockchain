# 🛡️ Fake Product Identification System — Blockchain Powered

A full-stack platform to register and verify product authenticity using a local Ethereum blockchain.

**Stack:** React · Node.js · Solidity · Hardhat · Ganache · MongoDB · Docker · AWS EC2

---

## 📌 How It Works

```
Manufacturer adds product from frontend
        ↓
Backend saves to MongoDB + registers on Ethereum blockchain
        ↓
Anyone enters product ID on Verify page
        ↓
Verified against blockchain → Authentic ✅ or Fake ❌
```

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Axios |
| Backend | Node.js 22, Express, JWT, Ethers.js v5 |
| Blockchain | Solidity 0.8.19, Hardhat v3, Ganache v7 |
| Database | MongoDB 6, Mongoose |
| Infrastructure | Docker, Docker Compose, Nginx, AWS EC2 |

---

## 🏗️ Architecture

```
User Browser ──► Frontend (React + Nginx) :3000
                        │ REST API
                 Backend (Express) :5000
                    │              │
            Ganache Blockchain   MongoDB
            (Docker internal)    :27017
```

---

## ⚡ Fresh Setup — Run Once on New EC2

### Prerequisites
- AWS EC2 Ubuntu 22.04+
- Ports **3000** and **5000** open in EC2 Security Group

---

### Step 1 — SSH and Clone

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
node --version    # must show v22.x.x
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

### Step 4 — Install Blockchain Dependencies and Compile

```bash
cd ~/fake-product-identification-blockchain/blockchain
npm install
npx hardhat compile
# Expected: Compiled 1 Solidity file with solc 0.8.19
```

---

### Step 5 — Start Docker Containers

```bash
cd ~/fake-product-identification-blockchain/docker
docker compose up -d
sleep 12
docker ps
# Must show 4 containers: frontend, backend, mongo, ganache
```

---

### Step 6 — Deploy Smart Contract to Docker Ganache + Sync Everything

```bash
cd ~/fake-product-identification-blockchain/blockchain
rm -rf ignition/deployments/
echo "y" | npx hardhat ignition deploy ignition/modules/ProductRegistry.ts --network ganache

ADDR=$(node -e "const d=require('./ignition/deployments/chain-1337/deployed_addresses.json'); console.log(Object.values(d)[0]);")
echo "Contract deployed at: $ADDR"

node -e "
const fs=require('fs');
const artifact=JSON.parse(fs.readFileSync('ignition/deployments/chain-1337/artifacts/ProductRegistryModule#ProductRegistry.json','utf8'));
fs.writeFileSync('../backend/blockchain/ProductRegistry.json', JSON.stringify({abi:artifact.abi,contractAddress:'\$ADDR',rpcUrl:'http://ganache:8545',chainId:1337},null,2));
console.log('ProductRegistry.json updated');
"

sed -i "s|CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$ADDR|" \
  ~/fake-product-identification-blockchain/docker/docker-compose.yml

echo "docker-compose.yml updated with: $ADDR"
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
# Must show: Contract OK. Products: 0
```

---

### Step 8 — Verify Everything Works

```bash
# Check blockchain connected
curl -s http://localhost:5000/api/blockchain/status | python3 -m json.tool
# Must show: "status": "connected", productCount: 0

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@product.app", "password": "Demo1234!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Register test product on blockchain
curl -s -X POST http://localhost:5000/api/blockchain/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"TEST-001","name":"Test Product","manufacturer":"Test Co"}' | python3 -m json.tool

# Verify test product
curl -s http://localhost:5000/api/blockchain/verify/TEST-001 | python3 -m json.tool
# Must show: "isAuthentic": true
```

---

### Step 9 — Open the App

```
Frontend:  http://YOUR_EC2_IP:3000
Backend:   http://YOUR_EC2_IP:5000
Login:     demo@product.app / Demo1234!
```

---

## 🔁 After Every EC2 Restart — Run This ONE Command

> Ganache resets on every reboot. Run this each time the server restarts.

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

---

## ✅ How to Use the App

1. Go to `http://YOUR_EC2_IP:3000`
2. Login with `demo@product.app` / `Demo1234!`
3. Click **Add Product** → fill name and description → submit
4. Product saves to **MongoDB** and **Ethereum blockchain** automatically
5. Copy the product ID shown
6. Go to **Verify** page → paste product ID → click Verify
7. See ✅ **Product is authentic!**
8. Enter a random fake ID → see ❌ **Verification failed**

---

## 📊 Useful Check Commands

```bash
# All containers running
docker ps

# Backend logs
docker logs docker-backend

# Ganache transaction logs
docker logs docker-ganache

# MongoDB — view all products
docker exec -it docker-mongo mongosh fake-product-db --eval "db.products.find().pretty()"

# MongoDB — count products
docker exec -it docker-mongo mongosh fake-product-db --eval "db.products.countDocuments()"

# Blockchain status
curl -s http://localhost:5000/api/blockchain/status | python3 -m json.tool

# Verify a specific product
curl -s http://localhost:5000/api/blockchain/verify/YOUR-PRODUCT-ID | python3 -m json.tool

# Verify a fake product (should return isAuthentic: false)
curl -s http://localhost:5000/api/blockchain/verify/FAKE-999 | python3 -m json.tool
```

---

## 📋 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login, get JWT token |
| POST | `/api/auth/register` | No | Create new account |
| GET | `/api/blockchain/status` | No | Blockchain connection status |
| POST | `/api/blockchain/register` | Yes | Register product on blockchain |
| GET | `/api/blockchain/verify/:id` | No | Verify product authenticity |
| POST | `/api/products` | Yes | Add product (MongoDB + blockchain) |
| GET | `/api/products` | Yes | List my products |
| PUT | `/api/products/:id` | Yes | Update product |
| DELETE | `/api/products/:id` | Yes | Delete product |

---

## 🔑 Quick Reference

| Item | Value |
|---|---|
| Frontend | `http://YOUR_EC2_IP:3000` |
| Backend API | `http://YOUR_EC2_IP:5000` |
| Demo login | `demo@product.app` / `Demo1234!` |
| Chain ID | 1337 (local Ganache) |
| Solidity version | 0.8.19 |
| Ganache mnemonic | `myth like bonus scare over problem client lizard pioneer submit female collect` |
| Deployer private key | `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d` |
| Backend → Ganache URL | `http://ganache:8545` (Docker internal only) |

---

## 🐞 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `contractAddress: ""` empty | CONTRACT_ADDRESS not set | Run the EC2 restart command |
| `isAuthentic: false` after adding product | Wrong contract address | Run the EC2 restart command |
| `Error HHE22` Hardhat not found | Node modules missing | `cd blockchain && npm install` |
| `CACHED [backend 5/5]` during build | Docker layer cache | `docker rmi -f docker-backend && docker compose up -d --build backend` |
| `CALL_EXCEPTION` on verify | Stale contract address in docker-compose.yml | Run EC2 restart command |
| `Only owner can call this` | Wrong private key | Use Ganache account 0 key in docker-compose.yml |
| Frontend verify always fails | Old verificationController | `git pull` then rebuild backend |
| Products in DB but not blockchain | Old productController | `git pull` then rebuild backend |

---

## 📂 Key Files Changed from Original

| File | What was fixed |
|---|---|
| `backend/controllers/productController.js` | Now saves to real Ethereum blockchain on product add |
| `backend/controllers/verificationController.js` | Now verifies against real Ethereum blockchain |
| `backend/blockchain/blockchainService.js` | Always reads CONTRACT_ADDRESS from env var |
| `docker/docker-compose.yml` | CONTRACT_ADDRESS env var added to backend service |

---

*Built with ❤️ — Local Blockchain · No gas fees · No internet dependency*
