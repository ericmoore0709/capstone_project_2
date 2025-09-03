const db = require('../../db');
const { NotFoundError, ConflictError } = require('../../expressError');

class Shelf {

    /**
     * Attempts to add shelf to the database
     * @param {Object} shelf the shelf to add: {userId, label}
     * @returns {Object} the created shelf: {id, userId, label}
     * @throws {Error} if (userId, label) relationship already exists 
     */
    static async create(shelf) {
        const { user_id: userId, label } = shelf;

        const duplicateCheck = await db.query(
            `
            SELECT * FROM shelves
            WHERE user_id = $1 
            AND label = $2 
            AND deleted_at IS NULL
            `,
            [userId, label]
        );

        if (duplicateCheck.rows[0])
            throw new ConflictError('Cannot have duplicate shelf name.');

        const result = await db.query(
            `
            INSERT INTO shelves (user_id, label)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", label
            `,
            [userId, label]
        );

        return result.rows[0];
    }

    /**
     * Attempts to find the shelf at the given id
     * @param {Number} shelfId the shelf id
     * @returns {Object} the shelf if exists: {id, userId, label}
     * @throws {NotFoundError} if not exists
     */
    static async findById(shelfId) {
        const result = await db.query(
            `
            SELECT id, user_id AS "userId", label
            FROM shelves
            WHERE id = $1 AND deleted_at IS NULL
            LIMIT 1
            `,
            [shelfId]
        );

        if (!result.rows[0]) throw new NotFoundError(`Shelf not found at id = ${shelfId}.`);

        return result.rows[0];
    }

    /**
     * Attempts to find all shelves at the given user id
     * @param {Number} userId the user id
     * @returns {Array<Object>} the array of shelves if user exists: [{id, userId, label}, ...]
     * @throws {NotFoundError} if user not exists
     */
    static async findByUserId(userId) {

        const userIdCheck = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (!userIdCheck.rows[0]) throw new NotFoundError(`User not found at ID = ${userId}`);

        const result = await db.query(
            `
            SELECT id, user_id AS "userId", label 
            FROM shelves
            WHERE user_id = $1 AND deleted_at IS NULL
            `,
            [userId]
        );

        return result.rows;
    }

    /**
     * Attempts to return all shelves from the database
     * @returns {Array<Object>} the array of shelves: [{id, userId, label}, ...]
     */
    static async findAll() {
        const result = await db.query(
            `
            SELECT id, user_id AS "userId", label 
            FROM shelves
            WHERE deleted_at IS NULL
            `
        );

        return result.rows;
    }

    /**
     * Attempts to update the shelf at the given id
     * @param {Object} shelf the shelf to update
     * @returns {Object} the updated shelf if exists: {id, userId, label}
     * @throws {NotFoundError} if shelf not exists
     */
    static async update(shelf) {
        const { id, label } = shelf;

        const result = await db.query(
            `
            UPDATE shelves
            SET label = $1
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING id, user_id AS "userId", label
            `,
            [label, id]
        );

        if (!result.rows[0]) throw new NotFoundError(`Shelf not found at ID = ${id}`);

        return result.rows[0];
    }

    /**
     * Attempts to delete shelf at the given id
     * @param {Number} shelfId the shelf id
     * @returns {Object} the deleted shelf if exists: {id, userId, label}
     * @throws {NotFoundError} if shelf not exists
     */
    static async delete(shelfId) {
        const result = await db.query(
            `
            UPDATE shelves
            SET deleted_at = now()
            WHERE id = $1 AND deleted_at IS NULL
            RETURNING id
            `,
            [shelfId]
        );

        if (!result.rows[0]) throw new NotFoundError(`Shelf not found at ID = ${shelfId}`);

        return result.rows[0];
    }

    /**
     * Creates association between shelf and recipe
     * @param {Number} shelfId the shelf id
     * @param {Number} recipeId the recipe id
     * @returns the created association
     */
    static async addRecipe(shelfId, recipeId) {
        const duplicateCheck = await db.query(
            `
            SELECT id FROM shelf_recipes
            WHERE shelf_id = $1 AND recipe_id = $2
            `,
            [shelfId, recipeId]
        );
        if (duplicateCheck.rows[0]) throw new ConflictError(`Recipe ${recipeId} is already in Shelf ${shelfId}.`);

        const result = await db.query(
            `
            INSERT INTO shelf_recipes (shelf_id, recipe_id)
            VALUES ($1, $2)
            RETURNING id, shelf_id AS "shelfId", recipe_id AS "recipeId"
            `,
            [shelfId, recipeId]
        );

        return result.rows[0];
    }

    /**
     * Deletes the association between shelf and recipe
     * @param {*} shelfId the shelf id
     * @param {*} recipeId the recipe id
     * @returns the deleted association
     */
    static async removeRecipe(shelfId, recipeId) {
        const existsCheck = await db.query(
            `
            SELECT id, shelf_id AS "shelfId", recipe_id AS "recipeId"
            FROM shelf_recipes
            WHERE shelf_id = $1 AND recipe_id = $2
            `,
            [shelfId, recipeId]
        );
        if (!existsCheck.rows[0]) throw new NotFoundError(`Recipe ${recipeId} not found in shelf ${shelfId}.`);

        const result = await db.query(
            `
            DELETE FROM shelf_recipes
            WHERE shelf_id = $1 AND recipe_id = $2
            RETURNING id, shelf_id AS "shelfId", recipe_id AS "recipeId"
            `,
            [shelfId, recipeId]
        );
        return existsCheck.rows[0];
    }

    /**
     * Retrieves all recipes associated with the given shelf ID
     * @param {*} shelfId the shelf ID
     * @returns a list of recipes
     */
    static async getRecipes(shelfId) {
        const result = await db.query(
            `
            SELECT r.id, r.title, r.description, r.visibility_id, r.uploaded_at, r.last_updated_at, r.image, r.author_id
            FROM shelf_recipes sr
            JOIN recipes r ON sr.recipe_id = r.id
            WHERE sr.shelf_id = $1
            `,
            [shelfId]
        );
        return result.rows;
    }

    /**
     * Gets all recipes (with author) associated with each shelf in ID array
     * @param {*} shelfIds the array of shelf IDs
     * @returns a map of recipes
     */
    static async getRecipesByShelfIncludeAuthors(shelfIds) {
        if (!shelfIds || shelfIds.length === 0) return [];

        const result = await db.query(
            `
            SELECT 
                sr.shelf_id,
                r.id, r.title, r.description, r.visibility_id, r.uploaded_at, r.last_updated_at, r.image, r.author_id,
                u.first_name, u.last_name
            FROM shelf_recipes sr
            JOIN recipes r ON sr.recipe_id = r.id
            JOIN users u ON u.id = r.author_id
            WHERE sr.shelf_id = ANY($1)
            `,
            [shelfIds]
        );

        let recipesByShelf = {};

        result.rows.forEach((r) => {
            if (!recipesByShelf[r.shelf_id]) recipesByShelf[r.shelf_id] = [];
            recipesByShelf[r.shelf_id].push({
                id: r.id,
                title: r.title,
                description: r.description,
                image: r.image,
                author_id: r.author_id,
                visibility_id: r.visibility_id,
                uploaded_at: r.uploaded_at,
                last_updated_at: r.last_updated_at,
                author: {
                    id: r.author_id,
                    first_name: r.first_name,
                    last_name: r.last_name
                }
            });
        });

        return recipesByShelf;
    }

}

module.exports = Shelf;