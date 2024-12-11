"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.JWT_SECRET || "secret-dev";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    const baseUri = process.env.DATABASE_URL || "postgresql:///capstone2";
    return process.env.NODE_ENV === "test" ? `${baseUri}_test` : baseUri;
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};