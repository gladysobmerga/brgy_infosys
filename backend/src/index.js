require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Barangay Information System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      residents: '/api/residents',
      certificates: '/api/certificates',
      requests: '/api/requests',
      officials: '/api/officials',
      dashboard: '/api/dashboard'
    }
  });
});

// API Routes
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
}

try {
  app.use('/api/residents', require('./routes/residentRoutes'));
  console.log('✅ Resident routes loaded');
} catch (error) {
  console.error('❌ Error loading resident routes:', error.message);
}

try {
  app.use('/api/certificates', require('./routes/certificateRoutes'));
  console.log('✅ Certificate routes loaded');
} catch (error) {
  console.error('❌ Error loading certificate routes:', error.message);
}

try {
  app.use('/api/requests', require('./routes/requestRoutes'));
  console.log('✅ Request routes loaded');
} catch (error) {
  console.error('❌ Error loading request routes:', error.message);
}

try {
  app.use('/api/officials', require('./routes/officialRoutes'));
  console.log('✅ Official routes loaded');
} catch (error) {
  console.error('❌ Error loading official routes:', error.message);
}

try {
  app.use('/api/dashboard', require('./routes/dashboardRoutes'));
  console.log('✅ Dashboard routes loaded');
} catch (error) {
  console.error('❌ Error loading dashboard routes:', error.message);
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
  console.log('=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});
