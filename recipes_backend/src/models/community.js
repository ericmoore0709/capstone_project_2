const db = require("../../db");
const { NotFoundError, ConflictError } = require("../../expressError");

class Community {

    /**
     * Attempts to create a new community in the database
     * @param {Object} community the community to create: {name, description, adminId}
     * @returns {Object} the created community: {id, name, description, adminId, createdAt, updatedAt}
     * @throws {Error} if community name already exists
     */
    static async create(community) {
        const { name, description, admin_id: adminId } = community;

        const duplicateCheck = await db.query(
            `
            SELECT * FROM communities
            WHERE name = $1
            `,
            [name]
        );

        if (duplicateCheck.rows[0])
            throw new ConflictError('Community name already exists.');

        const result = await db.query(
            `
            INSERT INTO communities (name, description, admin_id)
            VALUES ($1, $2, $3)
            RETURNING id, name, description, admin_id AS "adminId", created_at, last_updated_at
            `,
            [name, description, adminId]
        );

        return result.rows[0];
    }

    /**
     * Attempts to find a community by its ID
     * @param {Number} communityId the ID of the community
     * @returns {Object} the community if exists: {id, name, description, adminId, createdAt, updatedAt}
     * @throws {NotFoundError} if not exists
     */
    static async findById(communityId) {
        const result = await db.query(
            `
            SELECT id, name, description, admin_id AS "adminId", created_at, last_updated_at
            FROM communities
            WHERE id = $1
            LIMIT 1
            `,
            [communityId]
        );

        if (!result.rows[0]) throw new NotFoundError(`Community not found at id = ${communityId}.`);

        return result.rows[0];
    }

    /**
     * Attempts to find all communities administered by a given user ID
     * @param {Number} userId the user ID of the community admin
     * @returns {Array} list of communities: [{id, name, description, adminId, createdAt, updatedAt}, ...]
     */
    static async findByUserId(userId) {
        const result = await db.query(
            `
            SELECT id, name, description, admin_id AS "adminId", created_at, last_updated_at
            FROM communities
            WHERE admin_id = $1
            `,
            [userId]
        );

        return result.rows;
    }

    /**
     * Attempts to find all communities in the database
     * @returns {Array} list of communities: [{id, name, description, adminId, createdAt, updatedAt}, ...]
     */
    static async findAll() {
        const result = await db.query(
            `
            SELECT id, name, description, admin_id AS "adminId", created_at, last_updated_at
            FROM communities
            `
        );

        return result.rows;
    }

    static async update(id, data) {
        // Build the SET clause dynamically based on provided data
        const setClauses = [];
        const values = [];
        let idx = 1;

        for (let key in data) {
            if (['name', 'description', 'image'].includes(key)) {
                setClauses.push(`${key} = $${idx}`);
                values.push(data[key]);
                idx++;
            }
        }

        if (setClauses.length === 0) {
            throw new Error('No valid fields to update.');
        }

        // Always update the last_updated_at timestamp
        setClauses.push(`last_updated_at = NOW()`);

        const query = `
            UPDATE communities
            SET ${setClauses.join(', ')}
            WHERE id = $${idx}
            RETURNING id, name, description, admin_id AS "adminId", created_at, last_updated_at
        `;
        values.push(id);

        const result = await db.query(query, values);

        if (!result.rows[0]) throw new NotFoundError(`Community not found at id = ${id}.`);

        return result.rows[0];
    }

    /**
     * Deletes a community by its ID.
     * @param {*} id the ID of the community to delete
     * @returns navigates to previous page
     */
    static async deleteById(id) {
        const result = await db.query(
            `
            DELETE FROM communities
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        if (!result.rows[0]) throw new NotFoundError(`Community not found at id = ${id}.`);

        return;
    }
}

module.exports = Community;