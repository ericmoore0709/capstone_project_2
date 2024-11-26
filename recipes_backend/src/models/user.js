"use strict";

const db = require("../../db.js");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const { NotFoundError, BadRequestError } = require("../../expressError.js");
const { BCRYPT_WORK_FACTOR } = require("../../config.js");

/** Related functions for users. */

class User {
    /** Register user with data.
     *
     * Returns { id, firstName, lastName, email, google_id, image }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register({ firstName, lastName, email, googleId, image = null }) {
        const duplicateCheck = await db.query(
            `SELECT id
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate email: ${email}`);
        }

        const result = await db.query(
            `INSERT INTO users
             (first_name, last_name, email, google_id, image)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, first_name AS "firstName", last_name AS "lastName", email, google_id AS "googleId", image`,
            [firstName, lastName, email, googleId, image]
        );

        return result.rows[0];
    }

    /** Find all users.
     *
     * Returns [{ id, firstName, lastName, email, googleId, image }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    google_id AS "googleId",
                    image
             FROM users`
        );

        return result.rows;
    }

    /** Given an email, return data about user.
     *
     * Returns { id, firstName, lastName, email, googleId, image }
     *
     * Throws NotFoundError if user not found.
     **/

    static async getByEmail(email) {
        const userRes = await db.query(
            `SELECT id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    google_id AS "googleId",
                    image
             FROM users
             WHERE email = $1`,
            [email]
        );

        const user = userRes.rows[0] || null;
        return user;
    }

    /** Given an ID, return data about user.
     *
     * Returns { id, firstName, lastName, email, googleId, image }
     *
     * Throws NotFoundError if user not found.
     **/

    static async getById(id) {
        const userRes = await db.query(
            `SELECT id,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    google_id AS "googleId",
                    image
             FROM users
             WHERE id = $1
             AND deleted_at IS NULL`,
            [id]
        );

        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`No user: ${id}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * Data can include: { firstName, lastName, email, googleId, image }
     *
     * Returns { id, firstName, lastName, email, googleId, image }
     *
     * Throws NotFoundError if user not found.
     **/

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            email: "email",
            googleId: "google_id",
            image: "image",
        });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    google_id AS "googleId",
                                    image`;
        const result = await db.query(querySql, [...values, id]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${id}`);

        return user;
    }

    /** Soft delete a user by ID, returns undefined. */

    static async softDelete(id) {
        const result = await db.query(
            `UPDATE users
             SET deleted_at = NOW()
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (!result.rows[0]) throw new NotFoundError(`No user: ${id}`);
        return result.rows[0];
    }
}

module.exports = User;
