const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const creditRoute = require('./routes/creditRoute');
const imageRoute = require('./routes/imageRoute');
const profileRoute = require('./routes/profileRoute');
const path = require('path');


require('./config/passport');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoute);
app.use('/api', userRoute);
app.use('/check', creditRoute);
app.use('/generate', imageRoute);
app.use('/api', profileRoute);

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
    console.log(`Server is listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err.message);
  }
});