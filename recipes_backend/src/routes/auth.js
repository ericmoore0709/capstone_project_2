const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { JWT_SECRET, CLIENT_BASE_URL } = process.env;

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const { id, googleId, email, firstName, lastName, image } = req.user;

            // Create JWT token
            const token = jwt.sign(
                { id, googleId, email, firstName, lastName, image },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.redirect(`${process.env.CLIENT_BASE_URL}?token=${token}`);

        } catch (err) {
            console.error("Error during Google OAuth callback:", err);
            return res.redirect(`${CLIENT_BASE_URL}?error=authentication_failed`);
        }
    }
);

module.exports = router;
