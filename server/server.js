const express = require('express');
const { authLimiter, imageLimiter, apiLimiter } = require('./middlewares/rateLimiter');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const paymentRoute = require('./routes/paymentRoute');
const authRoute = require('./routes/authRoute');
const emailVerificationRoute = require('./routes/emailVerificationRoute');
const userRoute = require('./routes/userRoute');
const creditRoute = require('./routes/creditRoute');
const imageRoute = require('./routes/imageRoute');
const profileRoute = require('./routes/profileRoute');
const path = require('path');
const validateEmailConfig = require('./config/emailConfig');

require('./config/passport');

const app = express();

// Initialize DB connection at startup
let dbConnection = null;
const getDbConnection = async () => {
  if (!dbConnection) {
    dbConnection = await connectDB();
  }
  return dbConnection;
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    if (!dbConnection) {
      await getDbConnection();
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Update CORS configuration with specific origins
app.use(cors({
  origin: ['https://astrapix.vercel.app', 'https://astrapix-client.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Add response time header
app.use((req, res, next) => {
  res.header('X-Response-Time', '0');
  next();
});

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use(express.json());
app.use(passport.initialize());

// Apply rate limiting before routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);
app.use('/auth', authLimiter);
app.use('/generate/generate', imageLimiter);
app.use('/api', apiLimiter); 

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', emailVerificationRoute);
app.use('/auth', authRoute);
app.use('/api', userRoute); // This will handle forgot password routes
app.use('/check', creditRoute);
app.use('/generate', imageRoute);
app.use('/api', profileRoute);
app.use('/api/payment', paymentRoute);

// Add timeout middleware
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(504).send('Request Timeout');
  });
  next();
});

// Add ping route for health check
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  try {
    return res.status(200).json({message: "AstraPix API is up & running..."})
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
})

// Optimize database connection
let isConnected = false;
const connectToDB = async () => {
  if (isConnected) return;
  try {
    await connectDB();
    isConnected = true;
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

// Replace app.listen with module.exports for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

// Add error handling for unhandled promises
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Initialize DB on startup
getDbConnection().catch(console.error);

const startServer = async () => {
  try {
    validateEmailConfig();
    // ...existing code...
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();