const express = require('express');
const Shelf = require('../models/shelf');
const jsonschema = require('jsonschema');
const newShelfSchema = require('../schemas/shelfNew.json');
const updateShelfSchema = require('../schemas/shelfUpdate.json');
const { BadRequestError, NotFoundError } = require('../../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
const router = express.Router();

/**
 * POST / - Create a new shelf
 */
router.post('/', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, newShelfSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.message);
            throw new BadRequestError(errors);
        }
        const shelf = await Shelf.create(req.body);
        return res.status(201).json({ shelf });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET / - Retrieve all shelves
 */
router.get('/', async (req, res, next) => {
    try {
        const shelves = await Shelf.findAll();
        return res.status(200).json({ shelves });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /:id - Retrieve a shelf by ID
 */
router.get('/:id', async (req, res, next) => {
    try {
        const shelf = await Shelf.findById(req.params.id);
        if (!shelf) throw new NotFoundError(`Shelf not found: ${req.params.id}`);

        // add recipes to shelf
        const shelfRecipes = await Shelf.getRecipes(shelf.id);
        shelf.recipes = shelfRecipes;

        return res.status(200).json({ shelf });
    } catch (err) {
        return next(err);
    }
});

/**
 * GET /users/:user_id - Retrieve shelves by user ID
 */
router.get('/users/:user_id', async (req, res, next) => {
    try {
        const shelves = await Shelf.findByUserId(req.params.user_id);

        const populatedShelves = await Promise.all(
            shelves.map(async (shelf) => {
                const recipes = await Shelf.getRecipes(shelf.id);
                shelf.recipes = recipes;
                return shelf;
            })
        );

        return res.status(200).json({ shelves: populatedShelves });
    } catch (err) {
        return next(err);
    }
});

/**
 * PATCH /:id - Update a shelf by ID
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, updateShelfSchema);
        if (!validator.valid) {
            const errors = validator.errors.map(e => e.message);
            throw new BadRequestError(errors);
        }
        const shelf = await Shelf.update({ id: req.params.id, ...req.body });
        if (!shelf) throw new NotFoundError(`Shelf not found: ${req.params.id}`);

        return res.status(200).json({ shelf });
    } catch (err) {
        return next(err);
    }
});

/**
 * DELETE /:id - Delete a shelf by ID
 */
router.delete('/:id', async (req, res, next) => {
    try {

        const shelfToDelete = await Shelf.findById(req.params.id);
        const shelfRecipes = await Shelf.getRecipes(shelfToDelete.id);
        await Promise.all(
            shelfRecipes.map(async (recipe) => {
                await Shelf.removeRecipe(shelfToDelete.id, recipe.id);
            })
        );

        const result = await Shelf.delete(shelfToDelete.id);
        return res.status(200).json({ shelf: result });
    } catch (err) {
        return next(err);
    }
});

/**
 * POST /:shelf_id/recipes - adds recipe to shelf
 */
router.post('/:shelf_id/recipes/', async (req, res, next) => {
    const { shelf_id } = req.params;
    const { recipe_id } = req.body;

    try {
        await Shelf.addRecipe(shelf_id, recipe_id);
        const shelf = await Shelf.findById(shelf_id);

        // add recipes to shelf
        const shelfRecipes = await Shelf.getRecipes(shelf.id);
        shelf.recipes = shelfRecipes;

        return res.status(201).json({ shelf });
    } catch (err) {
        return next(err);
    }
});

/**
 * POST /:shelf_id/recipes/:recipe_id - removes recipe from shelf
 */
router.delete('/:shelf_id/recipes/:recipe_id', async (req, res, next) => {
    const { shelf_id, recipe_id } = req.params;

    try {
        await Shelf.removeRecipe(shelf_id, recipe_id);
        const shelf = await Shelf.findById(shelf_id);

        // add recipes to shelf
        const shelfRecipes = await Shelf.getRecipes(shelf.id);
        shelf.recipes = shelfRecipes;

        return res.status(200).json({ shelf });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
