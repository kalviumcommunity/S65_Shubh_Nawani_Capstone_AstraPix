const User = require('../models/userModel');

const handleGoogleAuth = async (profile) => {
  try {
    console.log('Processing Google profile:', {
      email: profile.emails[0].value,
      avatar: profile.photos?.[0]?.value
    });

    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        provider: 'google',
        avatar: profile.photos?.[0]?.value || null,
        credits: 10,
        isVerified: true
      });
    } else {
      // Update existing user's avatar if it's not set
      if (!user.avatar && profile.photos?.[0]?.value) {
        user.avatar = profile.photos[0].value;
        await user.save();
      }
    }

    // Verify the user object has the avatar
    console.log('User after auth:', {
      id: user._id,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider
    });

    return user;
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};

module.exports = {
  handleGoogleAuth
};