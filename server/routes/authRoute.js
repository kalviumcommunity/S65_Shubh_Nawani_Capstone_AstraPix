const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account consent", // Add this to always show prompt
        accessType: "offline",
    }),
);

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", {
            session: false,
            prompt: "select_account consent",
            timeout: 10000, // 10 second timeout
        })(req, res, (err) => {
            if (err) {
                console.error("Google Auth Error:", err);
                return res.redirect(
                    `${process.env.CLIENT_URL}/auth?error=Authentication failed`,
                );
            }
            next();
        });
    },
    (req, res) => {
        try {
            if (!req.user) {
                throw new Error("User data not found");
            }

            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                },
            );
            const userData = {
                _id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                credits: req.user.credits,
                avatar: req.user.avatar,
            };

            const userDataParam = encodeURIComponent(JSON.stringify(userData));

            // Add SameSite and Secure attributes to cookies
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "Strict" : "Lax",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            res.redirect(
                `${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${userDataParam}`,
            );
        } catch (error) {
            console.error("Auth Callback Error:", error);
            res.redirect(
                `${process.env.CLIENT_URL}/auth?error=Authentication failed`,
            );
        }
    },
);

// Add error recovery route
router.get("/auth-error", (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/auth?error=Please try again`);
});

module.exports = router;
