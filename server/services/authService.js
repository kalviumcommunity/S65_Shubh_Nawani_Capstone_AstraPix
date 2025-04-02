const User = require('../models/userModel');

const handleGoogleAuth = async (profile) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        provider: 'google',
        avatar: profile.photos?.[0]?.value || null,
        credits: 10,
        isVerified: true
      });
    } else if (!user.avatar && profile.photos?.[0]?.value) {
      user.avatar = profile.photos[0].value;
      await user.save();
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleGoogleAuth
};