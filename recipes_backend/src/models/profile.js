const db = require("../../db.js");
const { NotFoundError, ConflictError } = require("../../expressError");

class Profile {

    /**
     * Attempts to persist the profile to the database.
     * @param {*} userId the ID of the profile user
     * @returns the persisted profile
     * @throws {ConflictError} - if profile already exists at userId 
     */
    static async create(userId) {

        const duplicateCheck = await db.query(
            `
            SELECT id FROM profiles
            WHERE user_id = $1
            `,
            [userId]
        );

        if (duplicateCheck.rows[0]) throw new ConflictError(`Profile already exists at userId ${userId}.`);

        const result = await db.query(
            `
            INSERT INTO profiles (user_id) 
            VALUES ($1)
            RETURNING id, user_id AS "userId", bio 
            `,
            [userId]
        );

        return result.rows[0];
    }

    /**
     * Attempts to find the user's profile
     * @param {*} userId the id of the user
     * @returns the user profile
     * @throws {NotFoundError} - if user ID not found
     */
    static async findByUserId(userId) {
        const result = await db.query(
            `
            SELECT id, user_id AS "userId", bio
            FROM profiles
            WHERE user_id = $1
            `,
            [userId]
        );

        if (!result.rows[0]) throw new NotFoundError(`Profile not found at user ID ${userId}`);

        return result.rows[0];
    }

    /**
     * Attempts to update the bio of the given user profile
     * @param {{number, string}} {userId, bio} - the user ID and updated bio 
     * @returns the updated profile
     * @throws {NotFoundError} - if user ID not found
     */
    static async update({ userId, bio }) {
        const exists = await db.query(
            `
            SELECT id FROM profiles WHERE user_id = $1;
            `,
            [userId]
        );

        if (!exists.rows[0]) throw new NotFoundError(`Profile not found at userId ${userId}`);

        const result = await db.query(
            `
            UPDATE profiles
            SET bio = $1
            WHERE user_id = $2
            RETURNING id, user_id AS "userId", bio
            `,
            [bio, userId]
        );

        return result.rows[0];
    }

    /**
     * Attempts to delete the profile at given user ID
     * @param {*} userId the profile user ID
     * @returns the deleted profile
     * @throws {NotFoundError} - if user ID not found
     */
    static async delete(userId) {
        const exists = await db.query(
            `
            SELECT id FROM profiles WHERE user_id = $1;
            `,
            [userId]
        );

        if (!exists.rows[0]) throw new NotFoundError(`Profile not found at userId ${userId}`);

        const result = await db.query(
            `
            DELETE FROM profiles
            WHERE user_id = $1
            RETURNING id, user_id AS "userId", bio
            `,
            [userId]
        );

        return result.rows[0];
    }

}

module.exports = Profile;