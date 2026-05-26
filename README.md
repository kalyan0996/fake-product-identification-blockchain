# Fake Product Identification Blockchain

Blockchain-based fake product identification system using QR codes, React, Node.js, MongoDB, Docker, Kubernetes, and GitHub Actions.

---

# Clone Repository

```bash
git clone https://github.com/kalyan0996/fake-product-identification-blockchain.git

cd fake-product-identification-blockchain
```

---

# Run with Docker Compose (Recommended)

## Install Docker

### Ubuntu / EC2

```bash
sudo apt update -y

sudo apt install -y docker.io docker-compose

sudo systemctl start docker
sudo systemctl enable docker
```

---

## Start Project

```bash
docker compose up -d --build
```

---

## Check Running Containers

```bash
docker ps
```

---

## Open Application

Frontend:

```txt
http://localhost
```

Backend API:

```txt
http://localhost:5000
```

---

# Run Without Docker

## Install Requirements

```bash
sudo apt update -y

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install -y nodejs npm mongodb
```

---

# Backend Setup

```bash
cd backend

npm install
```

## Create `.env`

```env
MONGODB_URI=mongodb://localhost:27017/fake-product-db

JWT_SECRET=mysecret

PORT=5000
```

---

## Start Backend

```bash
npm start
```

---

# Frontend Setup

Open new terminal:

```bash
cd frontend

npm install

npm start
```

---

# Run Kubernetes Deployment

## Install kubectl

```bash
sudo snap install kubectl --classic
```

---

## Apply Kubernetes Files

```bash
cd k8s

kubectl apply -f .
```

---

## Check Pods

```bash
kubectl get pods
```

---

## Check Services

```bash
kubectl get svc
```

---

# GitHub Actions CI/CD

GitHub Actions workflow automatically deploys project after pushing to `main` branch.

## Create GitHub Secrets

Go to:

```txt
GitHub Repository → Settings → Secrets and variables → Actions
```

Add:

```txt
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

---

## Example Deploy Workflow

Create:

```txt
.github/workflows/deploy.yml
```

```yaml
name: Deploy Application

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}

          script: |
            cd ~/fake-product-identification-blockchain

            git pull origin main

            docker compose down

            docker compose up -d --build
```

---

# Useful Commands

## Docker

```bash
docker compose up -d

docker compose down

docker logs CONTAINER_ID

docker ps
```

---

## Kubernetes

```bash
kubectl get pods

kubectl get svc

kubectl logs POD_NAME
```

---

# Login Credentials

```txt
Email: demo@product.app
Password: Demo1234!
```

---

# Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Docker
- Kubernetes
- GitHub Actions
- Blockchain
- QR Code Authentication

---

# Repository

:contentReference[oaicite:0]{index=0}

Project uses blockchain-based QR verification for counterfeit product detection. :contentReference[oaicite:1]{index=1}
