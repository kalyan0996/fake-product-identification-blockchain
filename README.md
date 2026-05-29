# Fake Product Identification Blockchain

A blockchain-based fake product identification system using QR codes for verifying genuine products and preventing counterfeiting.

**GitHub Repository:** https://github.com/kalyan0996/fake-product-identification-blockchain.git

---

## 📌 Project Overview

This project provides a secure solution for manufacturers and customers to verify authentic products using:

- **QR Code Verification** — Scan QR codes to instantly verify product authenticity
- **Blockchain Authentication** — Immutable product records on blockchain
- **Product Registration** — Manufacturers register products in the system
- **Real-time Detection** — Detect and flag counterfeit products
- **Manufacturer Dashboard** — Secure login and product management
- **Customer Verification** — Easy verification interface for end users

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Nginx |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Blockchain** | Ethereum (Smart Contracts) |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | AWS EC2, Nginx Reverse Proxy |

---

## ⛓️ Blockchain Technology

This project uses **Ethereum** as the blockchain backend for:

- **Immutable Product Records** — Product metadata stored on Ethereum smart contracts
- **Tamper-Proof Verification** — QR code hashes verified against blockchain
- **Transparent Authentication** — Customers can trace product history on-chain
- **Smart Contract Validation** — Automated verification logic through contracts
- **Decentralized Trust** — No single point of failure for product authentication

### How Blockchain Works in This Project:

1. Manufacturer registers a product with unique identifier
2. Product details hashed and stored on Ethereum smart contract
3. QR code generated with product hash
4. Customer scans QR code
5. Backend verifies hash against blockchain records
6. Authentic or counterfeit status displayed instantly

---

## 📂 Project Structure

```
fake-product-identification-blockchain/
│
├── backend/                    # Node.js Express API
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Authentication & validation
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic
│   ├── package.json
│   └── server.js
│
├── frontend/                   # React.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/                  # Production build
│
├── docker/                     # Docker configuration
│   ├── Dockerfile.backend      # Backend image definition
│   ├── Dockerfile.frontend     # Frontend image definition
│   └── docker-compose.yml      # Multi-container orchestration
│
├── k8s/                        # Kubernetes deployment files
├── monitoring/                 # Monitoring configuration
├── nginx.conf                  # Nginx reverse proxy config
└── README.md
```

---

## ☁️ AWS EC2 Deployment

### Recommended Configuration

| Component | Specification |
|---|---|
| OS | Ubuntu 22.04 LTS |
| Instance Type | t2.medium or higher |
| Storage | 20GB+ EBS |

### Security Group Rules

| Type | Port | Source |
|---|---|---|
| SSH | 22 | Your IP |
| HTTP | 3000 | 0.0.0.0/0 |
| Custom TCP | 5000 | 0.0.0.0/0 |
| Custom TCP | 27017 | Internal only |

### Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
```

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/kalyan0996/fake-product-identification-blockchain.git
cd fake-product-identification-blockchain
```

### 2. Install Docker

```bash
sudo apt update -y
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
newgrp docker
docker --version
```

### 3. Deploy with Docker Compose

```bash
cd docker
docker compose up -d --build
```

### 4. Verify Containers

```bash
docker ps
```

Expected output:
```
docker-frontend   Up   0.0.0.0:3000->80/tcp
docker-backend    Up   0.0.0.0:5000->5000/tcp
docker-mongo      Up   0.0.0.0:27017->27017/tcp
```

---

## 🌐 Access Application

| Component | URL |
|---|---|
| Frontend (Web App) | `http://YOUR_PUBLIC_IP:3000` |
| Backend API | `http://YOUR_PUBLIC_IP:5000` |
| MongoDB | `mongodb://YOUR_PUBLIC_IP:27017` |

### Example
```
http://13.232.150.219:3000
```

---

## 🔑 Default Credentials

| Field | Value |
|---|---|
| Email | `demo@product.app` |
| Password | `Demo1234!` |

---

## 🧪 Test Backend API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@product.app","password":"Demo1234!"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Demo Manufacturer",
    "email": "demo@product.app"
  }
}
```

---

## ❌ Common Issues & Solutions

### Issue: `permission denied while trying to connect to Docker daemon`

**Solution:**
```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

### Issue: `COPY failed: no source files were specified`

**Solution:** Ensure build context is correct in docker-compose.yml:
```yaml
backend:
  build:
    context: ..
    dockerfile: docker/Dockerfile.backend
```

### Issue: Frontend can't connect to backend API

**Solution:** Verify nginx.conf has proxy configuration:
```nginx
location /api/ {
    proxy_pass http://docker-backend:5000/api/;
    proxy_set_header Host $host;
}
```

### Issue: MongoDB connection failed

**Solution:** Check mongo container is running:
```bash
docker logs docker-mongo
```

---

## 📊 CI/CD Pipeline

This project uses **GitLab CI/CD** for automated deployment:

1. **Build Stage** — Docker images built for frontend and backend
2. **Test Stage** — Run automated tests
3. **Push Stage** — Push images to Docker Hub
4. **Deploy Stage** — Pull latest images and restart containers

Pipeline file: `.gitlab-ci.yml`

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- MongoDB URI environment variables
- Docker secrets management
- Nginx reverse proxy security headers

---

## 📝 Environment Variables

Create `.env` file in project root:

```env
MONGODB_URI=mongodb://mongo:27017/fake-product-db
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

---

## ✅ Features

- ✅ Manufacturer account registration and login
- ✅ Product registration with blockchain verification
- ✅ QR code generation for each product
- ✅ Customer product verification interface
- ✅ Real-time counterfeit detection
- ✅ Product history tracking on blockchain
- ✅ Responsive web interface
- ✅ Docker containerization
- ✅ Automated CI/CD pipeline
- ✅ MongoDB data persistence
- ✅ Nginx reverse proxy
- ✅ JWT authentication

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Kalyan**

- GitHub: https://github.com/kalyan0996
- Repository: https://github.com/kalyan0996/fake-product-identification-blockchain.git

---

## 📞 Support

For issues and questions:
1. Check the GitHub Issues page
2. Review error messages in docker logs: `docker logs <container_name>`
3. Ensure all environment variables are properly set
4. Verify AWS Security Group rules allow necessary ports

---

**Last Updated:** May 2026
