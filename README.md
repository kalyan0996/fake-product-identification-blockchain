# Fake Product Blockchain App - Deployment Guide

## Run with Docker Compose

### 1. Connect to EC2

```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
```

---

## 2. Install Docker & Git

```bash
sudo apt update -y

sudo apt install -y docker.io docker-compose git

sudo systemctl start docker
sudo systemctl enable docker
```

---

## 3. Clone Project

```bash
mkdir ~/apps
cd ~/apps

git clone YOUR_GITHUB_REPO_URL project

cd project
```

---

## 4. Run Docker Compose

```bash
docker compose up -d --build
```

---

## 5. Check Running Containers

```bash
docker ps
```

---

## 6. Open Application

```txt
http://YOUR_EC2_IP
```

---

# Run with Kubernetes

## 1. Install kubectl

```bash
sudo snap install kubectl --classic
```

---

## 2. Apply Kubernetes Files

```bash
cd ~/apps/project/k8s

kubectl apply -f .
```

---

## 3. Check Pods

```bash
kubectl get pods
```

---

## 4. Check Services

```bash
kubectl get svc
```

---

## 5. Open Application

Use External IP from:

```bash
kubectl get svc
```

---

# GitHub Actions CI/CD

## Create GitHub Secrets

Go to:

```txt
GitHub Repo → Settings → Secrets and variables → Actions
```

Add:

```txt
EC2_HOST
EC2_USERNAME
EC2_SSH_KEY
```

---

## Example GitHub Actions Workflow

Create file:

```txt
.github/workflows/deploy.yml
```

```yaml
name: Deploy App

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}

          script: |
            cd ~/apps/project

            git pull origin main

            docker compose down
            docker compose up -d --build
```

---

# Useful Commands

## Docker

```bash
docker ps
docker logs CONTAINER_ID
docker compose down
docker compose up -d
```

---

## Kubernetes

```bash
kubectl get pods
kubectl get svc
kubectl logs POD_NAME
kubectl delete -f .
```

---

# Login

```txt
Email: demo@product.app
Password: Demo1234!
```
