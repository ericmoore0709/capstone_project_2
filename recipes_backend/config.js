"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.JWT_SECRET || "secret-dev";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    const baseUri = process.env.DATABASE_URL || "postgresql:///capstone2";
    const testUri = process.env.TEST_DATABASE_URL || `${baseUri}_test`
    return process.env.NODE_ENV === "test" ? testUri : baseUri;
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};