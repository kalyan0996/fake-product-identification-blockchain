# Fake Product Identification Blockchain

Blockchain-based fake product identification system using QR codes, React.js, Node.js, MongoDB, Docker, and Nginx.

## 🚀 GitHub Repository

https://github.com/kalyan0996/fake-product-identification-blockchain

---

# 📌 Project Overview

This project helps manufacturers and customers verify genuine products using:

- QR Code verification
- Blockchain-based product records
- Product authentication
- Fake product detection
- Manufacturer login system

---

# 🛠 Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Docker
- Nginx
- Blockchain

---

# 📂 Project Structure

```text
fake-product-identification-blockchain/
│
├── backend/
├── frontend/
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── nginx.conf
└── README.md
```

---

# ☁️ AWS EC2 Setup

## Recommended EC2 Configuration

- Ubuntu 22.04
- t2.medium or higher

## Open These Ports in AWS Security Group

| Type | Port |
|---|---|
| SSH | 22 |
| Custom TCP | 3000 |
| Custom TCP | 5000 |
| Custom TCP | 27017 |

Source:

```text
0.0.0.0/0
```

---

# 🔐 Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
```

Example:

```bash
ssh -i mykey.pem ubuntu@13.234.112.29
```

---

# 🐳 Install Docker

## Update Ubuntu

```bash
sudo apt update -y
```

## Install Docker

```bash
sudo apt install docker.io docker-compose -y
```

## Start Docker

```bash
sudo systemctl start docker
```

## Enable Docker

```bash
sudo systemctl enable docker
```

## Add Ubuntu User to Docker Group

```bash
sudo usermod -aG docker ubuntu
```

## Apply Docker Group

```bash
newgrp docker
```

## Verify Docker

```bash
docker --version
```

---

# 📥 Clone Repository

```bash
git clone https://github.com/kalyan0996/fake-product-identification-blockchain.git
```

## Go Inside Project

```bash
cd fake-product-identification-blockchain
```

---

# 🌐 Create nginx.conf

Go to project root:

```bash
nano nginx.conf
```

Paste this:

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save file:

```text
CTRL + O
ENTER
CTRL + X
```

---

# 🐳 Create Dockerfile.frontend

Go to docker folder:

```bash
cd docker
```

Create file:

```bash
nano Dockerfile.frontend
```

Paste this:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN chmod -R 755 node_modules

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Save file.

---

# 🐳 Create docker-compose.yml

Inside docker folder:

```bash
nano docker-compose.yml
```

Paste this:

```yaml
services:
  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    container_name: docker-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build:
      context: ../backend
      dockerfile: ../docker/Dockerfile.backend
    container_name: docker-backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/fake-product-db
      - JWT_SECRET=mysecret
      - PORT=5000
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    container_name: docker-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Save file.

---

# 🚀 Build and Run Project

Go to docker folder:

```bash
cd ~/fake-product-identification-blockchain/docker
```

## Remove Old Docker Cache

```bash
docker builder prune -a -f
```

## Stop Old Containers

```bash
docker compose down
```

## Build and Start Containers

```bash
docker compose up -d --build
```

---

# ✅ Verify Running Containers

```bash
docker ps
```

Expected:

```text
docker-frontend
docker-backend
docker-mongo
```

---

# 🌐 Open Application

Frontend:

```text
http://YOUR_PUBLIC_IP:3000
```

Example:

```text
http://13.234.112.29:3000
```

Backend API:

```text
http://13.234.112.29:5000
```

---

# 🔑 Login Credentials

```text
Email: demo@product.app
Password: Demo1234!
```

---

# 🧪 Test Backend Login API

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"demo@product.app","password":"Demo1234!"}'
```

Expected:

```json
{
  "token":"JWT_TOKEN"
}
```

---

# 🐳 Useful Docker Commands

## Show Running Containers

```bash
docker ps
```

## View Frontend Logs

```bash
docker logs docker-frontend
```

## View Backend Logs

```bash
docker logs docker-backend
```

## Stop Containers

```bash
docker compose down
```

## Restart Project

```bash
docker compose up -d --build
```

## Restart Backend

```bash
docker restart docker-backend
```

## Restart Frontend

```bash
docker restart docker-frontend
```

---

# 🍃 MongoDB Commands

## Open Mongo Shell

```bash
docker exec -it docker-mongo mongosh
```

## Use Database

```javascript
use fake-product-db
```

## Show Collections

```javascript
show collections
```

## Show Users

```javascript
db.users.find().pretty()
```

## Exit Mongo Shell

```javascript
exit
```

---

# ❌ Common Errors & Fixes

## Error: react-scripts Permission denied

Fix:

Add this line in Dockerfile.frontend:

```dockerfile
RUN chmod -R 755 node_modules
```

---

## Error: ERR_CONNECTION_REFUSED

Fix:

Check containers:

```bash
docker ps
```

Check AWS Security Group ports.

---

## Error: nginx.conf not found

Fix:

Create file in project root:

```text
fake-product-identification-blockchain/nginx.conf
```

---

## Error: Docker permission denied

Fix:

```bash
sudo usermod -aG docker ubuntu
```

Then:

```bash
newgrp docker
```

---

# ✅ Features

- Manufacturer login
- Product registration
- QR code verification
- Blockchain product tracking
- Fake product detection
- Docker deployment
- MongoDB database
- Nginx reverse proxy

---

# 👨‍💻 Author

Kalyan

GitHub:

https://github.com/kalyan0996
