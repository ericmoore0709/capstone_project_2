const db = require("../../db");
const { NotFoundError } = require("../../expressError");

class Ingredient {
    /**
     * Adds the given ingredient to the database
     * @param {*} ingredient the ingredient to add
     * @returns the created ingredient
     */
    static async create(ingredient) {
        const { content, recipeId } = ingredient;

        const result = await db.query(
            `
            INSERT INTO
            ingredients (content, recipe_id)
            VALUES ($1, $2)
            RETURNING *;
            `,
            [content, recipeId]
        );

        return result.rows[0];
    }

    /**
     * Finds the ingredient associated with the given ID
     * @param {*} id the ingredient ID
     * @returns the ingredient if exists
     */
    static async findById(id) {
        const result = await db.query(
            `
            SELECT * 
            FROM ingredients
            WHERE ID = $1;
            `,
            [id]
        );

        if (!result.rows[0]) throw new NotFoundError(`Ingredient not found at id = ${id}.`);
        return result.rows[0];
    }

    /**
     * Retrieves all ingredients associated with the given recipe ID
     * @param {*} recipeId the recipe ID
     * @returns the list of ingredients
     */
    static async findAllByRecipeId(recipeId) {
        const result = await db.query(
            `
            SELECT *
            FROM ingredients
            WHERE recipe_id = $1;
            `,
            [recipeId]
        );

        return result.rows;
    }

    /**
     * Updates the value of an ingredient in the database.
     * @param {*} ingredient the ingredient to update
     * @returns the updated ingredient
     */
    static async update(ingredient) {
        const { id, content } = ingredient;

        const result = await db.query(
            `
            UPDATE ingredients SET
            content = $1
            WHERE id = $2
            RETURNING *;  
            `,
            [content, id]
        );
        if (!result.rows[0]) throw new NotFoundError(`Ingredient not found at id = ${id}`);
        return result.rows[0];
    }

    /**
     * Deletes an ingredient from the database 
     * @param {*} id the ingredient ID
     * @returns the deleted ingredient
     */
    static async delete(id) {
        const result = await db.query(
            `
            DELETE FROM ingredients
            WHERE id = $1
            LIMIT 1
            RETURNING *
            `,
            [id]
        );
        if (!result.rows[0]) throw new NotFoundError(`Ingredient not found at id = ${id}`);
        return result.rows[0];
    }
}

module.exports = Ingredient;