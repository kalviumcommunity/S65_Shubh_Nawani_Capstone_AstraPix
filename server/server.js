const express = require('express');
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
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(passport.initialize());

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
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('Server startup error:', err.message);
    process.exit(1);
  }
});