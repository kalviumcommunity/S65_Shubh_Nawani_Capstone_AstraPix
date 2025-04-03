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
      prompt: 'select_account consent'
    }),
    (req, res) => {
      try {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
        const userData = {
          _id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          credits: req.user.credits,
          avatar: req.user.avatar
        };
        
        const userDataParam = encodeURIComponent(JSON.stringify(userData));
        
        // Add SameSite and Secure attributes to cookies
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${userDataParam}`);
      } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/auth?error=Authentication failed`);
      }
    }
);

module.exports = router;