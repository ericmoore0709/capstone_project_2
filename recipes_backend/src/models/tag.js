"use strict"
const db = require("../../db.js");
const { NotFoundError } = require("../../expressError.js");

class Tag {

    /**
     * Adds the tag to the database.
     * @param {Object} tag - The tag to add: { value }
     * @returns {Object} The added tag: { id, value }
     */
    static async create(tag) {
        const { value } = tag;
        const result = await db.query(`
            INSERT INTO tags
            (value)
            VALUES ($1)
            RETURNING id, value
            `, [value]);

        return result.rows[0];
    }

    /**
     * Retrieves all tags from the database.
     * @returns {Array<Object>} array of tags: [{ id, value, }, ...]
     */
    static async readAll() {
        const result = await db.query(
            `
            SELECT * FROM tags
            `
        );

        return result.rows;
    }

    /**
     * Retrieves a tag from the database.
     * @param {number} id the tag id
     * @returns {Object} the tag if exists { id, value }
     * @throws {NotFoundError} if not exists
     */
    static async readOneById(id) {
        const result = await db.query(
            `
                SELECT * FROM tags
                WHERE id = $1
                LIMIT 1
                `,
            [id]
        );

        if (!result.rows[0]) {
            throw new NotFoundError(`No tag found with id: ${id}`);
        }

        return result.rows[0];
    }

    /**
     * Retrieves all tags whose value includes the search term
     * @param {string} searchTerm the search term (string)
     * @returns {Array<Object>} an array of tags: [{ id, value }, ...]
     */
    static async readAllBySearchTerm(searchTerm) {
        const ilike = `%${searchTerm}%`;

        const result = await db.query(
            `
                SELECT * FROM tags
                WHERE value ILIKE $1
                `,
            [ilike]
        );

        return result.rows;
    }

    /**
     * Updates a tag in the database
     * @param {Object} tag the tag to edit: { id, value }
     * @returns {Object} the edited tag: { id, value }
     * @throws {NotFoundError} if not exists
     */
    static async update(tag) {
        const { id, value } = tag;

        const result = await db.query(`
                UPDATE tags SET value = $1
                WHERE id = $2
                RETURNING id, value
                `,
            [value, id]);

        if (!result.rows[0]) {
            throw new NotFoundError(`No tag found with id: ${id}`);
        }

        return result.rows[0];
    }

    /**
     * Deletes the tag from the database.
     * @param {number} id the tag id (Number [positive integer])
     * @returns {Object} the deleted tag
     * @throws {NotFoundError} if not exists
     */
    static async delete(id) {
        const result = await db.query(
            `
                DELETE FROM tags
                WHERE id = $1
                RETURNING id, value
                `,
            [id]
        );

        if (!result.rows[0]) {
            throw new NotFoundError(`No tag found with id: ${id}`);
        }

        return result.rows[0];
    }
}

module.exports = Tag;