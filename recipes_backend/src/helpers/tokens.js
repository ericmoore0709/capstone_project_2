const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");

/** return signed JWT from user data. */

function createToken(user) {

    let payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        googleId: user.googleId
    };

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };