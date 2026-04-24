require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const promClient = require('prom-client');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const blockchain = require('./services/blockchain');
const User = require('./models/User');

const app = express();

// Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/verify', verificationRoutes);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Connect to MongoDB and initialize blockchain
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultUser = new User({
        name: 'Demo Manufacturer',
        email: 'demo@product.app',
        password: 'Demo1234!'
      });
      await defaultUser.save();
      console.log('Created default user: demo@product.app / Demo1234!');
    }

    await blockchain.init();
    console.log('Blockchain initialized');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
  }
};

startServer();
