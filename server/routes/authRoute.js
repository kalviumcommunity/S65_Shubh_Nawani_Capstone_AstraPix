const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account consent', // Add this to always show prompt
    accessType: 'offline'
  })
);

router.get('/google/callback',
    passport.authenticate('google', { 
      session: false,
      prompt: 'select_account consent' // Add here as well
    }),
    (req, res) => {
      try {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
        const userData = {
          _id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          credits: req.user.credits
        };
        
        // Include user data in the redirect URL
        const userDataParam = encodeURIComponent(JSON.stringify(userData));
        res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${userDataParam}`);
      } catch (error) {
        console.error('OAuth Callback Error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth?error=Authentication failed`);
      }
    }
);

module.exports = router;