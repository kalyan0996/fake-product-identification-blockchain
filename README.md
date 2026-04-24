# Fake Product Identification System using Blockchain

A production-ready system for identifying fake products using blockchain technology.

## Features

- Manufacturer registration and login
- Product addition with QR code generation
- Blockchain-based product verification
- QR code scanning for verification
- Docker and Kubernetes deployment
- CI/CD with GitHub Actions
- Monitoring with Prometheus and Grafana

## Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Blockchain**: Custom SHA-256 blockchain
- **DevOps**: Docker, Kubernetes, GitHub Actions
- **Monitoring**: Prometheus, Grafana

## Setup

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Start MongoDB
4. Run backend: `cd backend && npm start`
5. Run frontend: `cd frontend && npm start`

### Docker

```bash
cd docker
docker-compose up
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## API Endpoints

- `POST /api/auth/register` - Register manufacturer
- `POST /api/auth/login` - Login
- `POST /api/products` - Add product
- `GET /api/products` - Get products
- `GET /api/verify/:productId` - Verify product

## Monitoring

- Metrics available at `/metrics`
- Configure Prometheus to scrape the backend
- Use Grafana for dashboards