const User = require("../models/userModel");
const mongoose = require("mongoose");

const handleGoogleAuth = async (profile) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let user = await User.findOne({ email: profile.emails[0].value })
        .select("email provider avatar credits isVerified")
        .lean()
        .maxTimeMS(5000);

      if (!user) {
        user = await User.create(
          [
            {
              email: profile.emails[0].value,
              provider: "google",
              avatar: profile.photos?.[0]?.value || null,
              credits: 10,
              isVerified: true,
            },
          ],
          { session },
        );
        user = user[0];
      }

      await session.commitTransaction();
      session.endSession();
      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Auth Service Error:", error);
    throw new Error("Authentication failed. Please try again.");
  }
};

module.exports = {
  handleGoogleAuth,
};
