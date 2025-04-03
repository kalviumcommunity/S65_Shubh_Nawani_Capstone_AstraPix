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


require('./config/passport');

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_ALT],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json());
app.use(passport.initialize());

// Apply rate limiting before routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/signup', authLimiter);
app.use('/auth', authLimiter);
app.use('/generate/generate', imageLimiter);
app.use('/api', apiLimiter);  // General API rate limiting

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/verify', emailVerificationRoute);
app.use('/auth', authRoute);
app.use('/api', userRoute); // This will handle forgot password routes
app.use('/check', creditRoute);
app.use('/generate', imageRoute);
app.use('/api', profileRoute);
app.use('/api/payment', paymentRoute);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  try {
    return res.status(200).json({message: "Backend API is up & running..."})
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
})

app.listen(PORT, async () => {
  try {
    await connectDB();
  } catch (err) {
    process.exit(1);
  }
});