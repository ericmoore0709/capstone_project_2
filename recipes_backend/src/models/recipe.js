"use strict";

const db = require("../../db.js");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const { NotFoundError } = require("../../expressError.js");

class Recipe {

    /** Create recipe with data.
     *
     * Returns { id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at }
     *
     **/

    static async create({ title, description, image = null, author_id, visibility_id }) {
        const result = await db.query(
            `INSERT INTO recipes
           (title, description, image, author_id, visibility_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at`,
            [title, description, image, author_id, visibility_id]
        );

        return result.rows[0];
    }

    /**
     * Retrieve recipes based on filtering criteria.
     *
     * Params:
     * - userId (optional): If provided, retrieves recipes by this user.
     * - publicOnly (optional): If true, only retrieves public recipes.
     * - visibilityId (optional): Filters by specific visibility level if provided.
     *
     * Returns [{ id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at }, ...]
     */
    static async findRecipes({ userId = null, publicOnly = false, visibilityId = null }) {
        // Base query and params array
        let query = `SELECT id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at
                     FROM recipes
                     WHERE deleted_at IS NULL`;
        let queryParams = [];

        // Add filters conditionally based on the passed parameters
        if (userId) {
            query += ` AND author_id = $${queryParams.length + 1}`;
            queryParams.push(userId);
        }

        if (publicOnly) {
            query += ` AND visibility_id = 1`;  // Assuming 1 = 'Public'
        } else if (visibilityId !== null) {
            query += ` AND visibility_id = $${queryParams.length + 1}`;
            queryParams.push(visibilityId);
        }

        query += ` ORDER BY last_updated_at DESC`;

        const result = await db.query(query, queryParams);
        return result.rows;
    }

    /** Given a recipe id, return data about recipe.
     *
     * Returns { id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at }
     *
     * Throws NotFoundError if recipe not found or is soft-deleted.
     **/

    static async get(id) {
        const recipeRes = await db.query(
            `SELECT id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at
           FROM recipes
           WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );

        const recipe = recipeRes.rows[0];

        if (!recipe) throw new NotFoundError(`No recipe: ${id}`);

        return recipe;
    }

    /** Update recipe data with `data`.
     *
     * Data can include: { title, description, image, visibility_id }
     *
     * Returns { id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at }
     *
     * Throws NotFoundError if recipe not found.
     **/

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            title: "title",
            description: "description",
            image: "image",
            visibility_id: "visibility_id",
        });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE recipes 
                          SET ${setCols}, last_updated_at = NOW()
                          WHERE id = ${idVarIdx} AND deleted_at IS NULL
                          RETURNING id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at`;
        const result = await db.query(querySql, [...values, id]);
        const recipe = result.rows[0];

        if (!recipe) throw new NotFoundError(`No recipe: ${id}`);

        return recipe;
    }

    /** Soft delete recipe by setting deleted_at timestamp; returns { id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at }. */

    static async remove(id) {
        const result = await db.query(
            `UPDATE recipes
             SET deleted_at = NOW()
             WHERE id = $1
             RETURNING id, title, description, image, author_id, visibility_id, uploaded_at, last_updated_at`,
            [id]
        );
        const recipe = result.rows[0];

        if (!recipe) throw new NotFoundError(`No recipe: ${id}`);

        return recipe;
    }

    /** Find all tags for a specific recipe.
     *
     * Returns [{ id, value }, ...]
     **/

    static async getTags(recipeId) {
        const result = await db.query(
            `SELECT t.id, t.value
             FROM recipe_tags rt
             JOIN tags t ON rt.tag_id = t.id
             WHERE rt.recipe_id = $1`,
            [recipeId]
        );

        return result.rows;
    }

    /** Add a tag to a recipe.
     *
     * Returns { recipe_id, tag_id }
     **/

    static async addTag(recipeId, tagId) {
        const result = await db.query(
            `INSERT INTO recipe_tags (recipe_id, tag_id)
             VALUES ($1, $2)
             RETURNING recipe_id, tag_id`,
            [recipeId, tagId]
        );

        return result.rows[0];
    }

    /** Remove a tag from a recipe.
     *
     * Returns undefined.
     **/

    static async removeTag(recipeId, tagId) {
        await db.query(
            `DELETE FROM recipe_tags
             WHERE recipe_id = $1 AND tag_id = $2`,
            [recipeId, tagId]
        );
    }

    static async removeFromShelves(recipeId) {
        await db.query(
            `DELETE FROM shelf_recipes
            WHERE recipe_id = $1`,
            [recipeId]
        );
    }
}

module.exports = Recipe;
