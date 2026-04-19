const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
mongoose.set('bufferCommands', false);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware 
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });

    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
