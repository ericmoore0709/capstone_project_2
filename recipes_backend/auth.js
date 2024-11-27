const passport = require('passport');
const User = require('./src/models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function () {
    // Configure Passport's Google OAuth2 strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const googleId = profile.id;
            const image = profile.photos[0]?.value || null; // Use Google profile image if available

            try {
                // Check if the user exists in the database
                let user = await User.getByEmail(email);

                // If the user doesn't exist, create a new user with all details
                if (!user) {
                    user = await User.register({
                        firstName,
                        lastName,
                        email,
                        googleId,
                        image
                    });
                } else {
                    // Update googleId and image if missing or changed
                    if (!user.googleId || user.image !== image) {
                        await User.update(user.id, { googleId, image });
                    }
                }

                // Pass the user data to Passport's `done` callback
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));

    // Serialize user ID into the session
    passport.serializeUser((user, done) => done(null, user.id));

    // Deserialize user by ID from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.getById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
