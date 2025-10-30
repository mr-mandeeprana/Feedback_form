// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const designationRoutes = require('./routes/designationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const cementCompanyRoutes = require('./routes/cementCompany');
const otpRoutes = require('./routes/otpRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Store connected clients by email for real-time OTP
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Register client with email for OTP delivery
  socket.on('register-otp', (email) => {
    connectedClients.set(email, socket.id);
    console.log(`Client ${socket.id} registered for OTP: ${email}`);
  });

  socket.on('disconnect', () => {
    // Remove from connected clients
    for (let [email, socketId] of connectedClients.entries()) {
      if (socketId === socket.id) {
        connectedClients.delete(email);
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Make io and connectedClients accessible in routes
app.set('io', io);
app.set('connectedClients', connectedClients);

app.use(cors());
app.use(express.json());

// Root route - must be before API routes
app.get('/', (req, res) => {
  console.log('Root route accessed from:', req.ip, 'at:', new Date().toISOString());
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({
    message: 'Beumer Feedback API Server',
    status: 'Running',
    version: 'v9',
    endpoints: {
      designations: '/api/designations',
      feedback: '/api/feedback',
      feedbackStats: '/api/feedback/stats',
      cementCompanies: '/api/cement-companies',
      otp: '/api/otp',
      test: '/test'
    },
    timestamp: new Date().toISOString(),
    otp_test_mode: true,
    note: 'Use OTP 123456 for testing'
  });
});

// Handle preflight OPTIONS requests
app.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/designations', designationRoutes);

// Feedback routes (with GET endpoints)
app.use('/api/feedback', feedbackRoutes);

// Handle OPTIONS for feedback routes
app.options('/api/feedback', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

app.use('/api/cement-companies', cementCompanyRoutes);

// OTP routes
app.use('/api/otp', otpRoutes);

// Handle OPTIONS for OTP routes
app.options('/api/otp', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with WebSocket support`);
});
