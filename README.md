# AWS EC2 Deployment Guide

Complete step-by-step guide to deploy the Fake Product Identification System on AWS EC2.

---

## Prerequisites

- AWS account with EC2 access
- SSH client (PuTTY, Git Bash, or terminal)
- Domain name (optional, for production)

---

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2)
2. Click **Launch Instance**
3. **Select AMI**: Choose **Ubuntu Server 22.04 LTS** (free tier eligible)
4. **Instance Type**: Select **t2.micro** (free tier) or **t2.small** for better performance
5. **Configure Instance**:
   - Number of instances: `1`
   - Keep default settings
6. **Add Storage**: Keep default `30 GB`
7. **Add Tags**: 
   - Key: `Name`
   - Value: `fake-product-blockchain-app`
8. **Configure Security Group**:
   - Create new security group: `fake-product-sg`
   - Add inbound rules:
     - SSH (22) from `0.0.0.0/0` (restrict to your IP for security)
     - HTTP (80) from `0.0.0.0/0`
     - HTTPS (443) from `0.0.0.0/0`
     - Custom TCP (5000) from `0.0.0.0/0` (backend)
     - Custom TCP (3000) from `0.0.0.0/0` (frontend dev)
9. Click **Review and Launch**
10. Select/create a key pair (download `.pem` file - keep it safe)
11. Click **Launch**

### 1.2 Get Instance Details

1. Wait 2-3 minutes for instance to start
2. Go to **Instances** in EC2 console
3. Copy the **Public IPv4 address** (e.g., `54.123.45.67`)

---

## Step 2: Connect to EC2 Instance

### Windows Users (PowerShell)

```powershell
# Navigate to where you saved your .pem file
cd C:\Users\YourUsername\Downloads

# Connect via SSH
ssh -i "your-key-pair.pem" ubuntu@your-ec2-public-ip

# Example:
ssh -i "fake-product-key.pem" ubuntu@54.123.45.67
```

### Mac/Linux Users

```bash
# Make key file readable
chmod 400 ~/Downloads/your-key-pair.pem

# Connect via SSH
ssh -i ~/Downloads/your-key-pair.pem ubuntu@54.123.45.67
```

---

## Step 3: Update System & Install Dependencies

Once connected to EC2, run:

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install Git
sudo apt install -y git

# Install Docker
sudo apt install -y docker.io

# Add ubuntu user to docker group (run Docker without sudo)
sudo usermod -aG docker ubuntu

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify Docker
docker --version
```

**Exit and reconnect for docker group changes to take effect:**

```bash
exit
# Reconnect via SSH
ssh -i "your-key-pair.pem" ubuntu@54.123.45.67
```

---

## Step 4: Clone Project Repository

```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone the repository
git clone <YOUR_REPO_URL> fake-product-blockchain
cd fake-product-blockchain

# Verify structure
ls -la
```

---

## Step 5: Set Up MongoDB in Docker

```bash
# Start MongoDB container
docker run -d \
  --name fake-product-mongodb \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=SecurePassword123 \
  mongo:latest

# Verify MongoDB is running
docker ps

# Check logs
docker logs fake-product-mongodb
```

---

## Step 6: Configure & Deploy Backend

### 6.1 Setup Backend Environment

```bash
cd ~/apps/fake-product-blockchain/backend

# Create .env file
sudo nano .env
```

**Add the following content** (press `Ctrl+Shift+V` to paste):

```
MONGODB_URI=mongodb://admin:SecurePassword123@localhost:27017/fake-product-db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
PORT=5000
NODE_ENV=production
```

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

### 6.2 Install Backend Dependencies

```bash
cd ~/apps/fake-product-blockchain/backend
npm install
```

### 6.3 Test Backend Start

```bash
npm start
```

**Expected Output:**
```
Connected to MongoDB
Created default user: demo@product.app / Demo1234!
Blockchain initialized
Server running on port 5000
```

Press `Ctrl+C` to stop (we'll run it with PM2 next)

---

## Step 7: Setup PM2 for Process Management

PM2 keeps your app running and auto-restarts on failure.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend with PM2
cd ~/apps/fake-product-blockchain/backend
pm2 start server.js --name "fake-product-backend"

# Verify it's running
pm2 list
pm2 logs fake-product-backend

# Setup PM2 to start on system reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save PM2 process list
pm2 save
```

---

## Step 8: Configure & Deploy Frontend

### 8.1 Build Frontend for Production

```bash
cd ~/apps/fake-product-blockchain/frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Verify build
ls -la build/
```

### 8.2 Install & Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Stop default Nginx
sudo systemctl stop nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/fake-product
```

**Add the following content:**

```nginx
# API Backend Proxy
upstream backend {
    server localhost:5000;
}

# Server configuration
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # Frontend React app
    location / {
        root /home/ubuntu/apps/fake-product-blockchain/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache control for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Metrics endpoint
    location /metrics {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

### 8.3 Enable Nginx Configuration

```bash
# Enable the configuration
sudo ln -s /etc/nginx/sites-available/fake-product /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

---

## Step 9: Verify Everything is Running

```bash
# Check all processes
pm2 list
sudo systemctl status nginx
docker ps

# Test endpoints
curl http://localhost:5000
curl http://localhost/

# Check backend logs
pm2 logs fake-product-backend

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Step 10: Access Your Application

### Public Access

Open your browser and go to:
```
http://your-ec2-public-ip
```

**Example:**
```
http://54.123.45.67
```

### Login Credentials

```
Email: demo@product.app
Password: Demo1234!
```

---

## Step 11: Optional - Setup SSL Certificate (HTTPS)

### Use Let's Encrypt for Free SSL

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain if you have one)
# For now, we skip this as EC2 IPs don't have DNS by default

# If you have a domain, use:
# sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Step 12: Useful Commands for Management

### Backend Management

```bash
# View logs
pm2 logs fake-product-backend

# Restart backend
pm2 restart fake-product-backend

# Stop backend
pm2 stop fake-product-backend

# Start backend
pm2 start fake-product-backend

# Delete from PM2
pm2 delete fake-product-backend
```

### MongoDB Management

```bash
# View MongoDB logs
docker logs fake-product-mongodb

# Stop MongoDB
docker stop fake-product-mongodb

# Start MongoDB
docker start fake-product-mongodb

# Remove MongoDB container
docker rm fake-product-mongodb
```

### Nginx Management

```bash
# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx

# Stop Nginx
sudo systemctl stop nginx

# Start Nginx
sudo systemctl start nginx
```

### System Management

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check listening ports
sudo netstat -tlnp | grep LISTEN
```

---

## Step 13: Backup & Maintenance

### Backup MongoDB Data

```bash
# Create backup directory
mkdir -p ~/backups

# Backup MongoDB
docker exec fake-product-mongodb mongodump --out /data/backup

# Copy from container to host
docker cp fake-product-mongodb:/data/backup ~/backups/mongo_backup_$(date +%Y%m%d)
```

### Backup Frontend Build

```bash
# Archive frontend build
cd ~/apps/fake-product-blockchain
tar -czf ~/backups/frontend_build_$(date +%Y%m%d).tar.gz frontend/build/
```

---

## Troubleshooting

### Backend won't start
```bash
# Check PM2 logs
pm2 logs fake-product-backend

# Check if MongoDB is running
docker ps | grep mongo

# Check if port 5000 is in use
sudo lsof -i :5000
```

### Frontend shows blank page
```bash
# Check Nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -50 /var/log/nginx/access.log

# Verify frontend build exists
ls -la ~/apps/fake-product-blockchain/frontend/build/
```

### MongoDB connection refused
```bash
# Check if MongoDB container is running
docker ps | grep mongo

# View MongoDB logs
docker logs fake-product-mongodb

# Restart MongoDB
docker restart fake-product-mongodb
```

### Cannot connect to EC2
```bash
# Check security group rules in AWS console
# Ensure SSH (22) is open to your IP

# Check key pair permissions
ls -la ~/Downloads/your-key-pair.pem
# Should show: -rw-r--r-- (or chmod 400)

# Try verbose SSH connection
ssh -vvv -i ~/Downloads/your-key-pair.pem ubuntu@your-ec2-ip
```

---

## Performance Optimization

### 1. Add Swap Memory

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 2. Optimize Node.js

Edit backend startup in PM2:
```bash
pm2 start server.js --name "fake-product-backend" --node-args="--max-old-space-size=512"
```

### 3. Enable Gzip Compression in Nginx

```bash
sudo nano /etc/nginx/nginx.conf
```

Add under `http` section:
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
gzip_min_length 1000;
```

---

## Cost Estimation (Free Tier)

- **EC2 t2.micro**: Free for 12 months (750 hours/month)
- **Data transfer**: 1 GB free per month (outbound)
- **Storage**: Free tier eligible

**Estimated monthly cost after free tier**: $8-15 USD (t2.small with data transfer)

---

## Security Best Practices

1. ✅ Restrict SSH access to your IP only
2. ✅ Change default MongoDB credentials
3. ✅ Use HTTPS/SSL certificate
4. ✅ Enable EC2 instance backups
5. ✅ Regularly update packages: `sudo apt update && sudo apt upgrade`
6. ✅ Use strong JWT secret in `.env`
7. ✅ Enable CloudWatch monitoring

---

## Next Steps

- Set up custom domain with Route53
- Configure CloudFront CDN for static assets
- Setup auto-scaling with load balancer
- Configure monitoring and alerting
- Setup CI/CD pipeline with GitHub Actions

---

## Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Backend logs: `docker logs fake-product-mongodb`

---

**Created**: May 26, 2026
**Last Updated**: May 26, 2026
