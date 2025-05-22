const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { handleGoogleAuth } = require("../services/authService");
const User = require("../models/userModel");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean().maxTimeMS(5000);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
        process.env.NODE_ENV === "production"
            ? `${process.env.SERVER_URL}/auth/google/callback`
            : process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
    timeout: 25000, // Set timeout to 25 seconds
};

passport.use(
    new GoogleStrategy(
        config,
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await handleGoogleAuth(profile);
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        },
    ),
);

module.exports = passport;
